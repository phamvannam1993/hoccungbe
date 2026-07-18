'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { listChildren, placementQuestions, placementSubmit, getCurrentChildId, gradeLabel, type Child, type PlacementResult } from '../lib/childData';
import KidIcon from '../components/edu/KidIcon';
import { ArrowRight, CalendarClock } from 'lucide-react';

type Question = { quizId: number; lessonId: number; questionText: string; options: { key: string; text: string }[]; difficulty: string; courseType: string };

// Icon khảo sát (public/icons/khao_sat)
function K({ name, className = 'h-8 w-8' }: { name: string; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/icons/khao_sat/${name}.webp`} alt="" className={`${className} object-contain`} />;
}

const TIER_STYLE: Record<string, { grad: string; emoji: string }> = {
  easy: { grad: 'from-emerald-400 to-teal-500', emoji: '🌱' },
  medium: { grad: 'from-blue-500 to-cyan-500', emoji: '🌿' },
  hard: { grad: 'from-amber-400 to-orange-500', emoji: '🌳' },
};

// Màu vòng chữ cái đáp án A/B/C/D…
const OPT_COLORS = ['#3b82f6', '#22c55e', '#3b82f6', '#f97316', '#8b5cf6', '#ec4899'];

const SUBJECT: Record<string, { name: string; emoji: string; color: string }> = {
  math: { name: 'Toán', emoji: '🔢', color: '#7c3aed' },
  language: { name: 'Tiếng Việt', emoji: '📖', color: '#16a34a' },
  english: { name: 'Tiếng Anh', emoji: '🅰️', color: '#2563eb' },
};

export default function KhaoSatClient() {
  const [child, setChild] = useState<Child | null>(null);
  const [grade, setGrade] = useState('1');
  const [stage, setStage] = useState<'intro' | 'loading' | 'quiz' | 'submitting' | 'result' | 'nochild'>('intro');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<PlacementResult | null>(null);

  useEffect(() => {
    const id = getCurrentChildId();
    if (!id) { setStage('nochild'); return; }
    listChildren().then((arr) => {
      const c = arr.find((x) => x.id === id) ?? null;
      setChild(c);
      setGrade(c?.currentLevel || '1');
    }).catch(() => {});
  }, []);

  async function start() {
    setStage('loading');
    try {
      const qs = await placementQuestions(grade, 12);
      if (!qs.length) { setStage('intro'); return; }
      setQuestions(qs); setIdx(0); setAnswers({}); setStage('quiz');
    } catch { setStage('intro'); }
  }

  function pick(quizId: number, key: string) { setAnswers((a) => ({ ...a, [quizId]: key })); }
  function next() { if (idx < questions.length - 1) setIdx((i) => i + 1); else finish(answers); }

  async function finish(finalAnswers: Record<number, string>) {
    setStage('submitting');
    const id = getCurrentChildId();
    const payload = Object.entries(finalAnswers).map(([quizId, selected]) => ({ quizId: Number(quizId), selected }));
    try {
      const r = await placementSubmit(id, grade, payload);
      setResult(r); setStage('result');
    } catch { setStage('quiz'); }
  }

  const q = questions[idx];
  const answered = q ? answers[q.quizId] != null : false;
  const isLast = idx === questions.length - 1;

  return (
    <section className="mx-auto max-w-5xl px-3 py-6 sm:px-6 sm:py-8">
      {/* ── INTRO ── */}
      {(stage === 'intro' || stage === 'loading') && (
        <div className="mx-auto max-w-xl overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-slate-100">
          <div className="bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 px-6 py-8 text-center text-white">
            <K name="15_tiger_mascot" className="mx-auto h-28 w-28 drop-shadow" />
            <h1 className="mt-3 text-2xl font-black sm:text-3xl">Khảo sát đầu vào</h1>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/90">Làm nhanh 12 câu để hệ thống hiểu năng lực của bé và tạo lộ trình học cá nhân hóa phù hợp nhất.</p>
          </div>
          <div className="px-6 py-6">
            {child && (
              <div className="mb-4 flex items-center justify-center gap-2 text-sm text-slate-500">
                Làm khảo sát cho <strong className="text-slate-800">{child.nickname || child.fullName}</strong>
                <span className="rounded-full bg-sky-50 px-2 py-0.5 text-xs font-bold text-sky-600">{gradeLabel(grade)}</span>
              </div>
            )}
            <ul className="mx-auto max-w-sm space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">✅ 12 câu hỏi ngắn, khoảng 3–5 phút</li>
              <li className="flex items-center gap-2">✅ Không tính điểm, không áp lực</li>
              <li className="flex items-center gap-2">✅ Xác định điểm mạnh, điểm cần cải thiện</li>
            </ul>
            <button onClick={start} disabled={stage === 'loading'} className="mt-6 w-full rounded-full bg-gradient-to-r from-blue-600 to-violet-600 py-3.5 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60">
              {stage === 'loading' ? 'Đang chuẩn bị câu hỏi…' : '🚀 Bắt đầu khảo sát'}
            </button>
            <Link href="/ho-so-be" className="mt-3 block text-center text-xs font-bold text-slate-400 hover:text-slate-600">← Quay lại hồ sơ</Link>
          </div>
        </div>
      )}

      {/* ── NO CHILD ── */}
      {stage === 'nochild' && (
        <div className="mx-auto max-w-xl rounded-[28px] bg-white p-8 text-center shadow-sm ring-1 ring-slate-100">
          <KidIcon name="tigerRead" className="mx-auto h-20 w-20" />
          <h1 className="mt-3 text-xl font-black text-slate-900">Cần hồ sơ bé trước đã</h1>
          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">Hãy tạo hồ sơ cho bé để hệ thống biết bé học lớp mấy rồi làm khảo sát nhé.</p>
          <Link href="/ho-so-be" className="mt-5 inline-block rounded-full bg-[#2563eb] px-6 py-3 text-sm font-bold text-white hover:bg-[#1d4ed8]">Tạo hồ sơ bé →</Link>
        </div>
      )}

      {/* ── QUIZ ── */}
      {stage === 'quiz' && q && (
        <div className="space-y-4">
          {/* Header xanh */}
          <div className="relative overflow-hidden rounded-[24px] px-4 py-5 text-center text-white shadow-sm sm:px-5 sm:py-6" style={{ background: 'linear-gradient(120deg,#2563eb 0%,#3b82f6 60%,#1d4ed8 100%)' }}>
            <Link href="/ho-so-be" className="absolute left-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-blue-600 shadow-md sm:left-4 sm:top-1/2 sm:h-auto sm:w-auto sm:-translate-y-1/2 sm:gap-1.5 sm:bg-white/20 sm:px-3 sm:py-1.5 sm:text-sm sm:font-bold sm:text-white sm:ring-1 sm:ring-white/30 sm:hover:bg-white/30">
              <K name="01_back" className="h-5 w-5 sm:h-4 sm:w-4" /> <span className="hidden sm:inline">Quay lại</span>
            </Link>
            <K name="02_header_book_star" className="pointer-events-none absolute right-2 top-1/2 h-12 w-12 -translate-y-1/2 sm:right-3 sm:h-16 sm:w-16" />
            <h1 className="px-12 text-xl font-black leading-tight sm:px-0 sm:text-3xl">Khảo sát đầu vào</h1>
            <p className="mt-1 px-8 text-[11px] leading-snug text-white/90 sm:px-0 sm:text-sm">Bài khảo sát ngắn để hiểu năng lực hiện tại của bé</p>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
            {/* Cột trái */}
            <div className="min-w-0 space-y-4 lg:flex-[1.7]">
            {/* Progress */}
            <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-slate-100 sm:gap-4 sm:p-4">
              <span className="shrink-0 text-sm font-black text-slate-700 sm:text-base">Câu <span className="text-blue-600">{idx + 1}</span>/{questions.length}</span>
              <div className="order-last h-2.5 w-full overflow-hidden rounded-full bg-slate-100 sm:order-none sm:w-auto sm:flex-1">
                <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all" style={{ width: `${Math.round(((idx + 1) / questions.length) * 100)}%` }} />
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-bold text-blue-600 sm:text-xs">🕐 Chỉ mất khoảng 5–7 phút</span>
            </div>

            {/* Question */}
            <div className="rounded-[24px] bg-white p-3.5 shadow-sm ring-1 ring-slate-100 sm:p-6">
              <div className="text-center">
                <K name="15_tiger_mascot" className="mx-auto h-14 w-14 drop-shadow sm:h-24 sm:w-24" />
                <div className="mx-auto mt-1 inline-block rounded-full bg-blue-50 px-3 py-0.5 text-[11px] font-bold text-blue-600 ring-1 ring-blue-100 sm:mt-2 sm:rounded-2xl sm:px-4 sm:py-1.5 sm:text-sm">Bé trả lời thoải mái nhé!</div>
                <div className="mt-1.5 sm:mt-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-black ring-1 ring-violet-100 sm:px-3 sm:py-1 sm:text-sm" style={{ color: SUBJECT[q.courseType]?.color ?? '#7c3aed' }}>
                    {q.courseType === 'math' ? <K name="03_math_subject" className="h-4 w-4 sm:h-5 sm:w-5" /> : <span>{SUBJECT[q.courseType]?.emoji ?? '📘'}</span>} {SUBJECT[q.courseType]?.name ?? 'Bài học'}
                  </span>
                </div>
                <p className="mt-2 text-base font-black leading-snug text-slate-800 sm:mt-4 sm:text-3xl">{q.questionText}</p>
              </div>

              <div className="mt-3 grid gap-2 sm:mt-5 sm:gap-2.5 sm:grid-cols-2">
                {q.options.map((o, i) => {
                  const on = answers[q.quizId] === o.key;
                  const col = OPT_COLORS[i % OPT_COLORS.length];
                  return (
                    <button key={o.key} onClick={() => pick(q.quizId, o.key)}
                      className={`relative flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left ring-2 transition sm:gap-3 sm:rounded-2xl sm:px-4 sm:py-3.5 ${on ? 'bg-blue-50 ring-blue-500' : 'bg-white ring-slate-200 hover:ring-blue-300'}`}>
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-black text-white sm:h-9 sm:w-9 sm:text-sm" style={{ background: col }}>{o.key}</span>
                      <span className="min-w-0 pr-5 text-sm font-black leading-snug text-slate-800 sm:text-lg">{o.text}</span>
                      {on && <K name="14_check_selected" className="absolute right-2.5 top-1/2 h-5 w-5 -translate-y-1/2 sm:right-3 sm:h-6 sm:w-6" />}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2.5 text-center text-[11px] text-slate-400 sm:mt-4 sm:text-xs">💡 Hệ thống sẽ dựa vào các câu trả lời để gợi ý lộ trình phù hợp.</p>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button onClick={next} className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-blue-200 bg-white py-3.5 text-sm font-black text-blue-600 transition hover:bg-blue-50"><CalendarClock size={18} /> Để sau</button>
              <button onClick={next} disabled={!answered}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3.5 text-sm font-black text-white shadow-lg transition hover:bg-blue-700 disabled:opacity-50">
                {isLast ? 'Xem kết quả' : 'Câu tiếp theo'} <ArrowRight size={18} />
              </button>
            </div>
            </div>

            {/* Cột phải */}
            <div className="min-w-0 space-y-4 lg:w-80 lg:shrink-0">
              {/* Hệ thống đang ghi nhận */}
              <div className="rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-5">
                <h2 className="mb-3 text-sm font-black text-slate-900 sm:text-base">Hệ thống đang ghi nhận</h2>
                <div className="grid grid-cols-4 gap-1 text-center lg:grid-cols-2 lg:gap-y-4">
                  {[
                    { i: '04_target_accuracy', t: 'Độ chính xác' }, { i: '05_stopwatch_speed', t: 'Tốc độ trả lời' },
                    { i: '06_brain_skill', t: 'Kỹ năng hiện tại' }, { i: '07_puzzle_level', t: 'Mức độ phù hợp' },
                  ].map((x) => (
                    <div key={x.t}>
                      <K name={x.i} className="mx-auto h-9 w-9 sm:h-11 sm:w-11" />
                      <p className="mt-1 text-[10px] font-semibold leading-tight text-slate-500 sm:mt-1.5 sm:text-xs">{x.t}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trấn an */}
              <div className="flex items-center justify-center gap-2.5 rounded-[24px] bg-amber-50 p-4 ring-1 ring-amber-100">
                <K name="08_star_notice" className="h-8 w-8 shrink-0" />
                <p className="text-xs font-bold text-slate-600">Không chấm điểm công khai · Bé chỉ cần cố gắng hết sức</p>
                <K name="09_heart_notice" className="h-6 w-6 shrink-0" />
              </div>

              {/* Info (ẩn trên mobile) */}
              <div className="hidden rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-100 lg:block">
                <p className="flex items-center gap-2.5 text-sm font-bold text-slate-600"><K name="10_document_info" className="h-7 w-7" /> Khảo sát gồm {questions.length} câu</p>
                <div className="my-3 h-px bg-slate-100" />
                <p className="flex items-center gap-2.5 text-sm font-bold text-slate-600"><K name="11_chat_info" className="h-7 w-7" /> Mỗi lần chỉ 1 câu</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {stage === 'submitting' && (
        <div className="mx-auto max-w-xl rounded-[28px] bg-white p-12 text-center shadow-sm ring-1 ring-slate-100">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500" />
          <p className="mt-4 font-bold text-slate-500">Đang phân tích năng lực của bé…</p>
        </div>
      )}

      {/* ── RESULT ── */}
      {stage === 'result' && result && (
        <div className="mx-auto max-w-2xl space-y-4">
          <div className={`overflow-hidden rounded-[28px] bg-gradient-to-br ${TIER_STYLE[result.tier].grad} p-7 text-center text-white shadow-lg`}>
            <div className="text-5xl">{TIER_STYLE[result.tier].emoji}</div>
            <p className="mt-2 text-sm font-bold text-white/90">Mức độ phù hợp cho bé</p>
            <h1 className="text-3xl font-black sm:text-4xl">{result.level}</h1>
            <p className="mt-2 text-sm text-white/90">{result.desc}</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-black ring-1 ring-white/30">
              Kết quả: {result.correct}/{result.total} câu đúng ({result.overallPct}%)
            </div>
          </div>

          {result.skills.length > 0 && (
            <div className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <h2 className="mb-3 text-base font-black text-slate-900">📊 Năng lực theo kỹ năng</h2>
              <div className="space-y-2.5">
                {result.skills.map((s) => (
                  <div key={s.skillId} className="flex items-center gap-3">
                    <span className="w-28 shrink-0 truncate text-xs font-bold text-slate-600">{s.name}</span>
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full" style={{ width: `${Math.max(4, s.pct)}%`, background: s.pct >= 70 ? '#22c55e' : s.pct >= 50 ? '#3b82f6' : '#f59e0b' }} />
                    </div>
                    <span className="w-9 text-right text-xs font-black text-slate-500">{s.pct}%</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {result.strengths.length > 0 && (
                  <div className="rounded-2xl bg-emerald-50 px-4 py-3 ring-1 ring-emerald-100">
                    <p className="text-xs font-bold text-emerald-700">💪 Điểm mạnh</p>
                    <p className="mt-0.5 text-sm font-black text-slate-700">{result.strengths.join(', ')}</p>
                  </div>
                )}
                {result.weaknesses.length > 0 && (
                  <div className="rounded-2xl bg-amber-50 px-4 py-3 ring-1 ring-amber-100">
                    <p className="text-xs font-bold text-amber-700">🎯 Cần cải thiện</p>
                    <p className="mt-0.5 text-sm font-black text-slate-700">{result.weaknesses.join(', ')}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="rounded-[24px] bg-violet-50 p-5 text-center ring-1 ring-violet-100">
            <p className="text-sm font-bold text-violet-800">🎉 Đã tạo xong lộ trình cá nhân hóa cho bé!</p>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              <Link href="/hoc-hom-nay" className="rounded-full bg-gradient-to-r from-blue-600 to-violet-600 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5">🚀 Bắt đầu học hôm nay</Link>
              <Link href="/ho-so-be" className="rounded-full bg-white py-3 text-sm font-bold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50">Xem hồ sơ</Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
