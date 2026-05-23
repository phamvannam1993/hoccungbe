'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../lib/api';

// ─── TTS (Google Translate, same as QuizPlayPage) ────────────────────────────

function preprocessTTS(text: string): string {
  return text
    .replace(/[\u{1F000}-\u{1FFFF}|\u{2600}-\u{27BF}|\u{1F300}-\u{1F9FF}|\u{FE00}-\u{FE0F}|\u{200D}]/gu, '')
    .replace(/_{2,}/g, 'mấy')
    .replace(/\?/g, '')
    .replace(/(\d)[-−–](\d)/g, '$1 đến $2')
    .replace(/[+＋]/g, ' cộng ')
    .replace(/[-−–]/g, ' trừ ')
    .replace(/[×✕*＊·]/g, ' nhân ')
    .replace(/[÷]/g, ' chia ')
    .replace(/=/g, ' bằng ')
    .replace(/</g, ' nhỏ hơn ')
    .replace(/>/g, ' lớn hơn ')
    .replace(/≤/g, ' nhỏ hơn hoặc bằng ')
    .replace(/≥/g, ' lớn hơn hoặc bằng ')
    .replace(/≠/g, ' khác ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

let _examTtsAudio: HTMLAudioElement | null = null;

function speakExam(text: string) {
  const cleaned = preprocessTTS(text);
  if (!cleaned) return;
  if (_examTtsAudio) { _examTtsAudio.pause(); _examTtsAudio = null; }
  const url = `/api/tts?q=${encodeURIComponent(cleaned)}`;
  const audio = new Audio(url);
  _examTtsAudio = audio;
  audio.play().catch(() => {
    // fallback Web Speech
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(cleaned);
    u.lang = 'vi-VN'; u.rate = 0.85;
    window.speechSynthesis.speak(u);
  });
}

function SpeakButton({ text }: { text: string }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); speakExam(text); }}
      title="Đọc câu hỏi"
      className="shrink-0 w-9 h-9 rounded-full bg-gray-100 text-gray-500 hover:bg-blue-100 hover:text-blue-600 flex items-center justify-center transition-colors"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
      </svg>
    </button>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

type QType = 'single_choice' | 'multiple_choice' | 'true_false' | 'matching'
  | 'fill_blank' | 'number_compare' | 'table_fill' | 'drag_to_position';

interface OptionItem { key: string; text: string; }

// fill_blank node
interface FBNode { key: string; type: 'given' | 'blank' | 'op'; value: string; }
// number_compare pair
interface NCPair { key: string; left: string; right: string; }
// table_fill structure
interface TableFillOptions { headers: string[]; rows: { op: string; keys: string[] }[] }
// drag_to_position
interface DragPosition { key: string; label: string; fixed: boolean; value?: string; cx: number; cy: number; }
interface DragOptions { tokens: string[]; positions: DragPosition[] }

interface ExamQuestion {
  id: number;
  questionText: string;
  questionType: QType;
  difficultyLevel: 'easy' | 'medium' | 'hard';
  optionsJson?: unknown;
  correctAnswerJson?: unknown;
  explanation?: string;
  points: number;
  sortOrder: number;
}

interface ExamData {
  id: number;
  title: string;
  slug: string;
  subject: string;
  grade: number;
  semester: number;
  description?: string;
  timeLimitMinutes?: number;
  totalPoints: number;
  questions: ExamQuestion[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isCorrectAnswer(q: ExamQuestion, answers: Record<number, string>, tfAnswers: Record<number, boolean | null>, fillAnswers: Record<string, string>, ncAnswers: Record<string, string>, dragAnswers: Record<string, string>): boolean {
  const ca = q.correctAnswerJson as Record<string, unknown>;
  if (q.questionType === 'single_choice' || q.questionType === 'multiple_choice') {
    return answers[q.id] === String(q.correctAnswerJson);
  }
  if (q.questionType === 'true_false') {
    return tfAnswers[q.id] === q.correctAnswerJson;
  }
  if (q.questionType === 'fill_blank' || q.questionType === 'table_fill') {
    if (!ca) return false;
    return Object.entries(ca).every(([k, v]) => String(fillAnswers[k] ?? '').trim() === String(v));
  }
  if (q.questionType === 'number_compare') {
    if (!ca) return false;
    return Object.entries(ca).every(([k, v]) => ncAnswers[k] === String(v));
  }
  if (q.questionType === 'drag_to_position') {
    if (!ca) return false;
    return Object.entries(ca).every(([k, v]) => dragAnswers[k] === String(v));
  }
  if (q.questionType === 'matching') {
    if (!ca) return false;
    const userMatch = tryParseJson(answers[q.id] ?? '') as Record<string, string> | null;
    if (!userMatch) return false;
    return Object.entries(ca).every(([k, v]) => userMatch[k] === String(v));
  }
  return false;
}

function tryParseJson(s: string): unknown {
  try { return JSON.parse(s); } catch { return null; }
}

// ─── FillBlank question ───────────────────────────────────────────────────────

function FillBlankQuestion({ nodes, fillAnswers, onChange, submitted, correctMap }: {
  nodes: FBNode[];
  fillAnswers: Record<string, string>;
  onChange: (key: string, val: string) => void;
  submitted: boolean;
  correctMap: Record<string, string>;
}) {
  // Group nodes into chains separated by '|' op
  const chains: FBNode[][] = [];
  let cur: FBNode[] = [];
  for (const n of nodes) {
    if (n.type === 'op' && n.value === '|') { chains.push(cur); cur = []; }
    else cur.push(n);
  }
  if (cur.length) chains.push(cur);

  return (
    <div className="space-y-4 ml-9">
      {chains.map((chain, ci) => (
        <div key={ci} className="flex flex-wrap items-center gap-1">
          {chain.map((node) => {
            if (node.type === 'op') {
              return <span key={node.key} className="text-lg font-bold text-gray-700 px-1">{node.value}</span>;
            }
            if (node.type === 'given') {
              return (
                <div key={node.key} className="w-10 h-10 rounded-full bg-blue-100 border-2 border-blue-300 flex items-center justify-center font-bold text-blue-800 text-sm">
                  {node.value}
                </div>
              );
            }
            // blank
            const val = fillAnswers[node.key] ?? '';
            const correct = submitted ? String(correctMap[node.key]) : null;
            const isOk = submitted ? val.trim() === correct : null;
            return (
              <input
                key={node.key}
                type="text"
                inputMode="numeric"
                value={val}
                onChange={(e) => onChange(node.key, e.target.value)}
                disabled={submitted}
                className={`w-10 h-10 rounded-full border-2 text-center font-bold text-sm outline-none ${
                  submitted
                    ? isOk ? 'border-green-500 bg-green-50 text-green-700' : 'border-red-400 bg-red-50 text-red-700'
                    : 'border-dashed border-gray-400 bg-white focus:border-blue-500'
                }`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── NumberCompare question ───────────────────────────────────────────────────

function NumberCompareQuestion({ pairs, ncAnswers, onChange, submitted, correctMap }: {
  pairs: NCPair[];
  ncAnswers: Record<string, string>;
  onChange: (key: string, val: string) => void;
  submitted: boolean;
  correctMap: Record<string, string>;
}) {
  const ops = ['<', '=', '>'];
  return (
    <div className="space-y-3 ml-9">
      {pairs.map((pair) => {
        const selected = ncAnswers[pair.key];
        const correct = correctMap[pair.key];
        return (
          <div key={pair.key} className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-gray-800 min-w-[3rem] text-right">{pair.left}</span>
            <div className="flex gap-1">
              {ops.map((op) => {
                const isSelected = selected === op;
                const isCorrectOp = op === correct;
                let cls = 'w-9 h-9 rounded-lg border-2 font-bold text-base transition-all ';
                if (submitted) {
                  if (isCorrectOp) cls += 'border-green-500 bg-green-100 text-green-700';
                  else if (isSelected && !isCorrectOp) cls += 'border-red-400 bg-red-50 text-red-600';
                  else cls += 'border-gray-200 text-gray-400';
                } else {
                  cls += isSelected ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 hover:border-gray-400 text-gray-600';
                }
                return (
                  <button key={op} onClick={() => !submitted && onChange(pair.key, op)} className={cls}>
                    {op}
                  </button>
                );
              })}
            </div>
            <span className="font-bold text-gray-800 min-w-[3rem]">{pair.right}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── TableFill question ───────────────────────────────────────────────────────

function TableFillQuestion({ opts, fillAnswers, onChange, submitted, correctMap }: {
  opts: TableFillOptions;
  fillAnswers: Record<string, string>;
  onChange: (key: string, val: string) => void;
  submitted: boolean;
  correctMap: Record<string, string>;
}) {
  return (
    <div className="ml-9 overflow-x-auto">
      <table className="border-collapse text-sm">
        <thead>
          <tr>
            <th className="border border-gray-300 px-3 py-2 bg-blue-50 text-gray-700 font-bold w-12"></th>
            {opts.headers.map((h, i) => (
              <th key={i} className="border border-gray-300 px-3 py-2 bg-blue-50 text-gray-700 font-bold min-w-[3rem]">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {opts.rows.map((row) => (
            <tr key={row.op}>
              <td className="border border-gray-300 px-3 py-2 bg-amber-50 font-bold text-amber-700 text-center">{row.op}</td>
              {row.keys.map((k) => {
                if (k === '_given') {
                  // given means the header itself — show it
                  return <td key={k} className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-600">—</td>;
                }
                const val = fillAnswers[k] ?? '';
                const correct = correctMap[k];
                const isOk = submitted ? val.trim() === String(correct) : null;
                if (correct === undefined) {
                  // static cell
                  return <td key={k} className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700">{k}</td>;
                }
                return (
                  <td key={k} className="border border-gray-300 p-1 text-center">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={val}
                      onChange={(e) => onChange(k, e.target.value)}
                      disabled={submitted}
                      className={`w-10 h-8 text-center font-bold rounded border outline-none text-sm ${
                        submitted
                          ? isOk ? 'border-green-500 bg-green-50 text-green-700' : 'border-red-400 bg-red-50 text-red-700'
                          : 'border-gray-300 focus:border-blue-500 bg-white'
                      }`}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── DragToPosition question ──────────────────────────────────────────────────

function DragToPositionQuestion({ opts, dragAnswers, onChange, submitted, correctMap }: {
  opts: DragOptions;
  dragAnswers: Record<string, string>;
  onChange: (posKey: string, token: string | null) => void;
  submitted: boolean;
  correctMap: Record<string, string>;
}) {
  const [selectedToken, setSelectedToken] = useState<string | null>(null);

  // tokens still available (not placed)
  const usedTokens = new Set(Object.values(dragAnswers));
  const availableTokens = opts.tokens.filter((t) => !usedTokens.has(t));

  const handlePosClick = (pos: DragPosition) => {
    if (submitted || pos.fixed) return;
    if (dragAnswers[pos.key]) {
      // remove placed token
      onChange(pos.key, null);
      return;
    }
    if (selectedToken) {
      onChange(pos.key, selectedToken);
      setSelectedToken(null);
    }
  };

  // SVG viewBox 220x200
  return (
    <div className="ml-9 space-y-3">
      <svg viewBox="0 0 220 200" className="w-full max-w-xs border border-gray-200 rounded-xl bg-gray-50">
        {/* Triangle lines */}
        <polygon points="110,20 20,180 200,180" fill="none" stroke="#94a3b8" strokeWidth="2" />
        {/* midpoints lines */}
        <line x1="65" y1="100" x2="155" y2="100" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,3" />
        <line x1="65" y1="100" x2="110" y2="180" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,3" />
        <line x1="155" y1="100" x2="110" y2="180" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,3" />
        {opts.positions.map((pos) => {
          const placed = pos.fixed ? pos.value : dragAnswers[pos.key];
          const correct = correctMap[pos.key];
          let bg = pos.fixed ? '#dbeafe' : (placed ? '#fef9c3' : '#fff');
          let stroke = pos.fixed ? '#3b82f6' : '#94a3b8';
          if (submitted && !pos.fixed) {
            bg = placed === correct ? '#dcfce7' : '#fee2e2';
            stroke = placed === correct ? '#22c55e' : '#ef4444';
          }
          return (
            <g key={pos.key} onClick={() => handlePosClick(pos)} style={{ cursor: pos.fixed || submitted ? 'default' : 'pointer' }}>
              <circle cx={pos.cx} cy={pos.cy} r="18" fill={bg} stroke={stroke} strokeWidth="2" />
              <text x={pos.cx} y={pos.cy + 5} textAnchor="middle" fontSize="13" fontWeight="bold" fill="#1e293b">
                {placed ?? ''}
              </text>
              {submitted && !pos.fixed && placed !== correct && (
                <text x={pos.cx} y={pos.cy + 20} textAnchor="middle" fontSize="10" fill="#22c55e">{correct}</text>
              )}
            </g>
          );
        })}
      </svg>
      {/* Token pool */}
      {!submitted && (
        <div className="flex flex-wrap gap-2">
          {availableTokens.map((tok) => (
            <button
              key={tok}
              onClick={() => setSelectedToken(selectedToken === tok ? null : tok)}
              className={`w-10 h-10 rounded-full border-2 font-bold text-sm transition-all ${
                selectedToken === tok ? 'border-blue-500 bg-blue-100 text-blue-800' : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              {tok}
            </button>
          ))}
          {availableTokens.length === 0 && <span className="text-xs text-gray-400 italic">Đã đặt hết số</span>}
        </div>
      )}
      {!submitted && selectedToken && (
        <p className="text-xs text-blue-600">Đã chọn <strong>{selectedToken}</strong> — bấm vào ô trống trên tam giác để đặt</p>
      )}
    </div>
  );
}

// ─── Matching question ────────────────────────────────────────────────────────

function MatchingQuestion({ q, answers, setAnswers, submitted }: {
  q: ExamQuestion;
  answers: Record<number, string>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  submitted: boolean;
}) {
  const opts: OptionItem[] = Array.isArray(q.optionsJson) ? q.optionsJson as OptionItem[] : [];
  const correctMap = (q.correctAnswerJson as Record<string, string>) ?? {};
  const rightItems = [...new Set(Object.values(correctMap))];
  const userMatch: Record<string, string> = tryParseJson(answers[q.id] ?? '{}') as Record<string, string> ?? {};

  const setMatch = (leftKey: string, rightVal: string) => {
    const updated = { ...userMatch };
    if (updated[leftKey] === rightVal) { delete updated[leftKey]; }
    else { updated[leftKey] = rightVal; }
    setAnswers((p) => ({ ...p, [q.id]: JSON.stringify(updated) }));
  };

  return (
    <div className="ml-9 space-y-2">
      {opts.map((o) => {
        const selected = userMatch[o.key];
        const correct = correctMap[o.key];
        return (
          <div key={o.key} className="flex items-center gap-3 flex-wrap">
            <div className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-sm font-medium text-blue-800 min-w-[6rem]">{o.text}</div>
            <span className="text-gray-400">↔</span>
            <div className="flex gap-2 flex-wrap">
              {rightItems.map((rv) => {
                const isSelected = selected === rv;
                const isCorrect = submitted && rv === correct;
                const isWrong = submitted && isSelected && rv !== correct;
                return (
                  <button key={rv} onClick={() => !submitted && setMatch(o.key, rv)}
                    className={`px-3 py-1.5 rounded-lg border-2 text-sm font-medium transition-all ${
                      isCorrect ? 'border-green-500 bg-green-50 text-green-700'
                      : isWrong ? 'border-red-400 bg-red-50 text-red-600'
                      : isSelected ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}>
                    {rv}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Result screen ────────────────────────────────────────────────────────────

function ResultScreen({
  exam, answers, tfAnswers, fillAnswers, ncAnswers, dragAnswers, onRetry,
}: {
  exam: ExamData;
  answers: Record<number, string>;
  tfAnswers: Record<number, boolean | null>;
  fillAnswers: Record<string, string>;
  ncAnswers: Record<string, string>;
  dragAnswers: Record<string, string>;
  onRetry: () => void;
}) {
  const results = exam.questions.map((q) => ({
    q,
    correct: isCorrectAnswer(q, answers, tfAnswers, fillAnswers, ncAnswers, dragAnswers),
  }));

  const correctCount = results.filter((r) => r.correct).length;
  const totalQ = exam.questions.length;
  const score = ((correctCount / totalQ) * exam.totalPoints).toFixed(1);
  const pct = Math.round((correctCount / totalQ) * 100);

  const grade =
    pct >= 90 ? { label: 'Xuất sắc', color: '#22c55e', emoji: '🏆' }
    : pct >= 70 ? { label: 'Giỏi', color: '#3b82f6', emoji: '⭐' }
    : pct >= 50 ? { label: 'Đạt', color: '#f59e0b', emoji: '👍' }
    : { label: 'Chưa đạt', color: '#ef4444', emoji: '📚' };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 text-center">
        <div className="text-6xl mb-3">{grade.emoji}</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">{grade.label}!</h2>
        <div className="text-5xl font-black my-4" style={{ color: grade.color }}>{score}</div>
        <div className="text-gray-500 text-sm">/ {exam.totalPoints} điểm</div>
        <div className="mt-4 flex justify-center gap-6 text-sm text-gray-600">
          <span>✅ Đúng: <strong>{correctCount}</strong></span>
          <span>❌ Sai: <strong>{totalQ - correctCount}</strong></span>
          <span>📋 Tổng: <strong>{totalQ}</strong> câu</span>
        </div>
        <div className="mt-5 h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: grade.color }} />
        </div>
        <p className="text-xs text-gray-400 mt-1">{pct}% câu đúng</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h3 className="font-bold text-gray-800 mb-4 text-lg">Xem lại đáp án</h3>
        <div className="space-y-3">
          {results.map((r, idx) => (
            <div key={r.q.id} className={`rounded-xl p-4 border-l-4 ${r.correct ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'}`}>
              <p className="font-medium text-gray-800 text-sm">
                <span className="mr-2">{r.correct ? '✅' : '❌'}</span>
                Câu {idx + 1}: {r.q.questionText}
              </p>
              {r.q.explanation && (
                <p className="text-xs text-gray-500 mt-1 italic">{r.q.explanation}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 justify-center">
        <button onClick={onRetry} className="px-6 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors">
          🔄 Làm lại
        </button>
        <Link href="/de-thi" className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-bold hover:bg-gray-200 transition-colors">
          ← Danh sách đề thi
        </Link>
      </div>
    </div>
  );
}

// ─── Main ExamPage ────────────────────────────────────────────────────────────

export default function ExamPage({ slug }: { slug: string }) {
  const [exam, setExam] = useState<ExamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [tfAnswers, setTfAnswers] = useState<Record<number, boolean | null>>({});
  const [fillAnswers, setFillAnswers] = useState<Record<string, string>>({});
  const [ncAnswers, setNcAnswers] = useState<Record<string, string>>({});
  const [dragAnswers, setDragAnswers] = useState<Record<string, string>>({});
  const [shuffledOpts, setShuffledOpts] = useState<Record<number, OptionItem[]>>({});

  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    apiFetch<ExamData>(`/exams/${slug}`)
      .then((data) => {
        setExam(data);
        const shuffled: Record<number, OptionItem[]> = {};
        data.questions.forEach((q) => {
          if ((q.questionType === 'single_choice' || q.questionType === 'multiple_choice') && Array.isArray(q.optionsJson)) {
            const arr = [...(q.optionsJson as OptionItem[])];
            for (let i = arr.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            shuffled[q.id] = arr;
          }
        });
        setShuffledOpts(shuffled);
        if (data.timeLimitMinutes) setTimeLeft(data.timeLimitMinutes * 60);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (timeLeft === null || submitted) return;
    if (timeLeft <= 0) { handleSubmit(); return; }
    timerRef.current = setInterval(() => setTimeLeft((t) => (t ?? 1) - 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, submitted]);

  const handleSubmit = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetry = () => {
    setAnswers({}); setTfAnswers({}); setFillAnswers({}); setNcAnswers({}); setDragAnswers({});
    setSubmitted(false);
    if (exam?.timeLimitMinutes) setTimeLeft(exam.timeLimitMinutes * 60);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const answeredCount = exam
    ? exam.questions.filter((q) => {
        if (q.questionType === 'true_false') return tfAnswers[q.id] !== undefined;
        if (q.questionType === 'fill_blank') {
          const nodes = (q.optionsJson as FBNode[]) ?? [];
          const blanks = nodes.filter((n) => n.type === 'blank');
          return blanks.length > 0 && blanks.every((n) => fillAnswers[n.key]);
        }
        if (q.questionType === 'number_compare') {
          const pairs = (q.optionsJson as NCPair[]) ?? [];
          return pairs.every((p) => ncAnswers[p.key]);
        }
        if (q.questionType === 'table_fill') {
          const correct = (q.correctAnswerJson as Record<string, unknown>) ?? {};
          return Object.keys(correct).every((k) => fillAnswers[k]);
        }
        if (q.questionType === 'drag_to_position') {
          const positions = ((q.optionsJson as DragOptions)?.positions ?? []).filter((p) => !p.fixed);
          return positions.every((p) => dragAnswers[p.key]);
        }
        return answers[q.id] !== undefined;
      }).length
    : 0;

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" /></div>;
  }
  if (notFound || !exam) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">📋</div>
        <h1 className="text-2xl font-bold text-gray-800">Không tìm thấy đề thi</h1>
        <Link href="/de-thi" className="mt-6 inline-block text-blue-600 hover:underline">← Quay lại danh sách</Link>
      </div>
    );
  }
  if (submitted) {
    return <ResultScreen exam={exam} answers={answers} tfAnswers={tfAnswers} fillAnswers={fillAnswers} ncAnswers={ncAnswers} dragAnswers={dragAnswers} onRetry={handleRetry} />;
  }

  const DIFF_LABEL: Record<string, string> = { easy: 'Dễ', medium: 'Trung bình', hard: 'Khó' };
  const DIFF_COLOR: Record<string, string> = { easy: '#22c55e', medium: '#f59e0b', hard: '#ef4444' };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Sticky header */}
      <div className="bg-white rounded-2xl shadow-sm p-5 mb-5 sticky top-0 z-10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-snug">{exam.title}</h1>
            {exam.description && <p className="text-xs text-gray-500 mt-0.5">{exam.description}</p>}
          </div>
          {timeLeft !== null && (
            <div className={`shrink-0 text-center px-3 py-1.5 rounded-xl font-mono font-bold text-sm ${timeLeft < 60 ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-700'}`}>
              ⏱ {formatTime(timeLeft)}
            </div>
          )}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${(answeredCount / exam.questions.length) * 100}%` }} />
          </div>
          <span className="text-xs text-gray-500 shrink-0">{answeredCount}/{exam.questions.length} câu</span>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4 mb-6">
        {exam.questions.map((q, idx) => {
          const isAnswered = (() => {
            if (q.questionType === 'true_false') return tfAnswers[q.id] !== undefined;
            if (q.questionType === 'fill_blank') {
              const blanks = (q.optionsJson as FBNode[] ?? []).filter((n) => n.type === 'blank');
              return blanks.length > 0 && blanks.every((n) => fillAnswers[n.key]);
            }
            if (q.questionType === 'number_compare') return (q.optionsJson as NCPair[] ?? []).every((p) => ncAnswers[p.key]);
            if (q.questionType === 'table_fill') return Object.keys((q.correctAnswerJson as Record<string, unknown>) ?? {}).every((k) => fillAnswers[k]);
            if (q.questionType === 'drag_to_position') {
              const positions = ((q.optionsJson as DragOptions)?.positions ?? []).filter((p) => !p.fixed);
              return positions.every((p) => dragAnswers[p.key]);
            }
            return answers[q.id] !== undefined;
          })();

          return (
            <div key={q.id} className={`bg-white rounded-2xl shadow-sm p-5 border-2 transition-colors ${isAnswered ? 'border-blue-200' : 'border-transparent'}`}>
              <div className="flex items-start gap-2 mb-3">
                <span className="shrink-0 w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">{idx + 1}</span>
                <div className="flex-1">
                  <div className="flex items-start gap-2">
                    <p className="text-gray-900 font-medium leading-snug flex-1">{q.questionText}</p>
                    <SpeakButton text={q.questionText} />
                  </div>
                  <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: DIFF_COLOR[q.difficultyLevel] + '20', color: DIFF_COLOR[q.difficultyLevel] }}>
                    {DIFF_LABEL[q.difficultyLevel]} · {q.points} điểm
                  </span>
                </div>
              </div>

              {/* single_choice / multiple_choice */}
              {(q.questionType === 'single_choice' || q.questionType === 'multiple_choice') && (() => {
                const opts = shuffledOpts[q.id] ?? (Array.isArray(q.optionsJson) ? q.optionsJson as OptionItem[] : []);
                return (
                  <div className="space-y-2 ml-9">
                    {opts.map((opt) => {
                      const selected = answers[q.id] === opt.key;
                      const correctKey = String(q.correctAnswerJson);
                      let cls = 'w-full text-left px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ';
                      if (submitted) {
                        if (opt.key === correctKey) cls += 'border-green-500 bg-green-50 text-green-800';
                        else if (selected) cls += 'border-red-400 bg-red-50 text-red-700';
                        else cls += 'border-gray-200 text-gray-500';
                      } else {
                        cls += selected ? 'border-blue-500 bg-blue-50 text-blue-800' : 'border-gray-200 hover:border-gray-300 text-gray-700';
                      }
                      return (
                        <button key={opt.key} onClick={() => !submitted && setAnswers((p) => ({ ...p, [q.id]: opt.key }))} className={cls}>
                          <span className={`inline-flex w-6 h-6 rounded-full items-center justify-center text-xs mr-2 font-bold ${selected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}>{opt.key}</span>
                          {opt.text}
                        </button>
                      );
                    })}
                  </div>
                );
              })()}

              {/* true_false */}
              {q.questionType === 'true_false' && (
                <div className="flex gap-3 ml-9">
                  {[true, false].map((val) => {
                    const selected = tfAnswers[q.id] === val;
                    const isCorrect = submitted && val === q.correctAnswerJson;
                    const isWrong = submitted && selected && val !== q.correctAnswerJson;
                    return (
                      <button key={String(val)} onClick={() => !submitted && setTfAnswers((p) => ({ ...p, [q.id]: val }))}
                        className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${
                          isCorrect ? 'border-green-500 bg-green-50 text-green-700'
                          : isWrong ? 'border-red-400 bg-red-50 text-red-700'
                          : selected ? (val ? 'border-green-400 bg-green-50 text-green-700' : 'border-red-400 bg-red-50 text-red-700')
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}>
                        {val ? '✓ Đúng' : '✗ Sai'}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* matching */}
              {q.questionType === 'matching' && (
                <MatchingQuestion q={q} answers={answers} setAnswers={setAnswers} submitted={submitted} />
              )}

              {/* fill_blank */}
              {q.questionType === 'fill_blank' && (() => {
                const nodes = (q.optionsJson as FBNode[]) ?? [];
                const correctMap = (q.correctAnswerJson as Record<string, string>) ?? {};
                return (
                  <FillBlankQuestion
                    nodes={nodes}
                    fillAnswers={fillAnswers}
                    onChange={(k, v) => setFillAnswers((p) => ({ ...p, [k]: v }))}
                    submitted={submitted}
                    correctMap={correctMap}
                  />
                );
              })()}

              {/* number_compare */}
              {q.questionType === 'number_compare' && (() => {
                const pairs = (q.optionsJson as NCPair[]) ?? [];
                const correctMap = (q.correctAnswerJson as Record<string, string>) ?? {};
                return (
                  <NumberCompareQuestion
                    pairs={pairs}
                    ncAnswers={ncAnswers}
                    onChange={(k, v) => setNcAnswers((p) => ({ ...p, [k]: v }))}
                    submitted={submitted}
                    correctMap={correctMap}
                  />
                );
              })()}

              {/* table_fill */}
              {q.questionType === 'table_fill' && (() => {
                const opts = q.optionsJson as TableFillOptions;
                const correctMap = (q.correctAnswerJson as Record<string, string>) ?? {};
                return (
                  <TableFillQuestion
                    opts={opts}
                    fillAnswers={fillAnswers}
                    onChange={(k, v) => setFillAnswers((p) => ({ ...p, [k]: v }))}
                    submitted={submitted}
                    correctMap={correctMap}
                  />
                );
              })()}

              {/* drag_to_position */}
              {q.questionType === 'drag_to_position' && (() => {
                const opts = q.optionsJson as DragOptions;
                const correctMap = (q.correctAnswerJson as Record<string, string>) ?? {};
                return (
                  <DragToPositionQuestion
                    opts={opts}
                    dragAnswers={dragAnswers}
                    onChange={(k, v) => {
                      if (v === null) setDragAnswers((p) => { const n = { ...p }; delete n[k]; return n; });
                      else setDragAnswers((p) => ({ ...p, [k]: v }));
                    }}
                    submitted={submitted}
                    correctMap={correctMap}
                  />
                );
              })()}
            </div>
          );
        })}
      </div>

      {/* Submit */}
      <div className="bg-white rounded-2xl shadow-sm p-5 text-center">
        {answeredCount < exam.questions.length && (
          <p className="text-sm text-amber-600 mb-3">⚠️ Còn {exam.questions.length - answeredCount} câu chưa trả lời</p>
        )}
        <button onClick={handleSubmit} className="px-10 py-3 bg-blue-600 text-white rounded-full font-bold text-base shadow hover:bg-blue-700 transition-colors">
          Nộp bài →
        </button>
      </div>
    </div>
  );
}
