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
      className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110"
      style={{
        background: 'linear-gradient(135deg, #FFE5F1, #EBD8FF)',
        border: '3px solid #A06CD5',
        boxShadow: '0 3px 0 #A06CD566',
        color: '#A06CD5',
      }}
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

// ─── Kid-friendly palette ─────────────────────────────────────────────────────

const OPTION_COLORS = [
  { c: '#FF6B9D', bg: 'linear-gradient(135deg, #FFE5F1 0%, #FFD6E8 100%)', dark: '#c2185b' }, // pink
  { c: '#4ECDC4', bg: 'linear-gradient(135deg, #C9F0FF 0%, #B3E5DC 100%)', dark: '#0f766e' }, // cyan
  { c: '#A06CD5', bg: 'linear-gradient(135deg, #EBD8FF 0%, #DDC3FF 100%)', dark: '#6b21a8' }, // purple
  { c: '#FF9F45', bg: 'linear-gradient(135deg, #FFF4D6 0%, #FFE5B4 100%)', dark: '#c2410c' }, // orange
];

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
        <div key={ci} className="flex flex-wrap items-center gap-1.5">
          {chain.map((node) => {
            if (node.type === 'op') {
              return <span key={node.key} className="text-xl font-black text-purple-700 px-1 kid-display">{node.value}</span>;
            }
            if (node.type === 'given') {
              return (
                <div
                  key={node.key}
                  className="w-11 h-11 rounded-full flex items-center justify-center font-black text-base kid-display"
                  style={{
                    background: 'linear-gradient(135deg, #C9F0FF, #B3E5DC)',
                    border: '3px solid #4ECDC4',
                    boxShadow: '0 3px 0 #4ECDC466',
                    color: '#0f766e',
                  }}
                >
                  {node.value}
                </div>
              );
            }
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
                className={`w-11 h-11 rounded-full text-center font-black text-base outline-none kid-display ${
                  submitted ? (isOk ? 'kid-bounce' : 'kid-shake') : ''
                }`}
                style={{
                  border: '3px solid ' + (submitted ? (isOk ? '#22c55e' : '#ef4444') : '#FF9F45'),
                  background: submitted ? (isOk ? '#DCFCE7' : '#FEE2E2') : '#FFF4D6',
                  color: submitted ? (isOk ? '#15803d' : '#b91c1c') : '#c2410c',
                  boxShadow: '0 3px 0 ' + (submitted ? (isOk ? '#22c55e66' : '#ef444466') : '#FF9F4566'),
                }}
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
            <span className="font-black text-purple-800 min-w-[3rem] text-right kid-display text-lg">{pair.left}</span>
            <div className="flex gap-1.5">
              {ops.map((op) => {
                const isSelected = selected === op;
                const isCorrectOp = op === correct;
                let bg = 'linear-gradient(135deg, #FFF, #FAFAFA)';
                let border = '#A06CD5';
                let color = '#A06CD5';
                let extra = '';
                if (submitted) {
                  if (isCorrectOp) { bg = '#DCFCE7'; border = '#22c55e'; color = '#15803d'; extra = 'kid-bounce'; }
                  else if (isSelected && !isCorrectOp) { bg = '#FEE2E2'; border = '#ef4444'; color = '#b91c1c'; extra = 'kid-shake'; }
                  else { bg = '#F5F3FF'; border = '#E9D5FF'; color = '#A78BFA'; }
                } else if (isSelected) {
                  bg = 'linear-gradient(135deg, #FFE5F1, #FFD6E8)'; border = '#FF6B9D'; color = '#c2185b';
                }
                return (
                  <button
                    key={op}
                    onClick={() => !submitted && onChange(pair.key, op)}
                    className={`w-11 h-11 rounded-2xl font-black text-lg transition-all kid-display ${extra}`}
                    style={{ background: bg, border: `3px solid ${border}`, color, boxShadow: `0 3px 0 ${border}55` }}
                  >
                    {op}
                  </button>
                );
              })}
            </div>
            <span className="font-black text-purple-800 min-w-[3rem] kid-display text-lg">{pair.right}</span>
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
      <table className="border-collapse text-sm kid-display">
        <thead>
          <tr>
            <th className="border-2 border-pink-300 px-3 py-2 font-black w-12" style={{ background: '#FFE5F1', color: '#c2185b' }}></th>
            {opts.headers.map((h, i) => (
              <th key={i} className="border-2 border-pink-300 px-3 py-2 font-black min-w-[3rem]" style={{ background: '#FFE5F1', color: '#c2185b' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {opts.rows.map((row) => (
            <tr key={row.op}>
              <td className="border-2 border-orange-300 px-3 py-2 font-black text-center" style={{ background: '#FFF4D6', color: '#c2410c' }}>{row.op}</td>
              {row.keys.map((k) => {
                if (k === '_given') {
                  return <td key={k} className="border-2 border-purple-200 px-3 py-2 text-center font-bold text-purple-500">—</td>;
                }
                const val = fillAnswers[k] ?? '';
                const correct = correctMap[k];
                const isOk = submitted ? val.trim() === String(correct) : null;
                if (correct === undefined) {
                  return <td key={k} className="border-2 border-purple-200 px-3 py-2 text-center font-bold text-purple-700">{k}</td>;
                }
                return (
                  <td key={k} className="border-2 border-purple-200 p-1 text-center">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={val}
                      onChange={(e) => onChange(k, e.target.value)}
                      disabled={submitted}
                      className={`w-11 h-9 text-center font-black rounded-xl outline-none text-sm ${submitted ? (isOk ? 'kid-bounce' : 'kid-shake') : ''}`}
                      style={{
                        border: '2px solid ' + (submitted ? (isOk ? '#22c55e' : '#ef4444') : '#A06CD5'),
                        background: submitted ? (isOk ? '#DCFCE7' : '#FEE2E2') : '#fff',
                        color: submitted ? (isOk ? '#15803d' : '#b91c1c') : '#A06CD5',
                      }}
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

  const usedTokens = new Set(Object.values(dragAnswers));
  const availableTokens = opts.tokens.filter((t) => !usedTokens.has(t));

  const handlePosClick = (pos: DragPosition) => {
    if (submitted || pos.fixed) return;
    if (dragAnswers[pos.key]) {
      onChange(pos.key, null);
      return;
    }
    if (selectedToken) {
      onChange(pos.key, selectedToken);
      setSelectedToken(null);
    }
  };

  return (
    <div className="ml-9 space-y-3">
      <svg viewBox="0 0 220 200" className="w-full max-w-xs rounded-2xl" style={{ background: 'linear-gradient(135deg, #FFE5F1 0%, #E5F4FF 100%)', border: '3px solid #FF6B9D', boxShadow: '0 4px 0 #FF6B9D44' }}>
        <polygon points="110,20 20,180 200,180" fill="none" stroke="#A06CD5" strokeWidth="2.5" />
        <line x1="65" y1="100" x2="155" y2="100" stroke="#A06CD5" strokeWidth="1.5" strokeDasharray="4,3" />
        <line x1="65" y1="100" x2="110" y2="180" stroke="#A06CD5" strokeWidth="1.5" strokeDasharray="4,3" />
        <line x1="155" y1="100" x2="110" y2="180" stroke="#A06CD5" strokeWidth="1.5" strokeDasharray="4,3" />
        {opts.positions.map((pos) => {
          const placed = pos.fixed ? pos.value : dragAnswers[pos.key];
          const correct = correctMap[pos.key];
          let bg = pos.fixed ? '#C9F0FF' : (placed ? '#FFF4D6' : '#fff');
          let stroke = pos.fixed ? '#4ECDC4' : '#A06CD5';
          if (submitted && !pos.fixed) {
            bg = placed === correct ? '#DCFCE7' : '#FEE2E2';
            stroke = placed === correct ? '#22c55e' : '#ef4444';
          }
          return (
            <g key={pos.key} onClick={() => handlePosClick(pos)} style={{ cursor: pos.fixed || submitted ? 'default' : 'pointer' }}>
              <circle cx={pos.cx} cy={pos.cy} r="19" fill={bg} stroke={stroke} strokeWidth="2.5" />
              <text x={pos.cx} y={pos.cy + 5} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1e293b">
                {placed ?? ''}
              </text>
              {submitted && !pos.fixed && placed !== correct && (
                <text x={pos.cx} y={pos.cy + 22} textAnchor="middle" fontSize="10" fill="#22c55e" fontWeight="bold">{correct}</text>
              )}
            </g>
          );
        })}
      </svg>
      {!submitted && (
        <div className="flex flex-wrap gap-2">
          {availableTokens.map((tok) => {
            const sel = selectedToken === tok;
            return (
              <button
                key={tok}
                onClick={() => setSelectedToken(sel ? null : tok)}
                className="w-11 h-11 rounded-full font-black text-base transition-all kid-display"
                style={{
                  background: sel ? 'linear-gradient(135deg, #FF6B9D, #FF9F45)' : 'linear-gradient(135deg, #FFF4D6, #FFE5B4)',
                  border: '3px solid ' + (sel ? '#FF6B9D' : '#FF9F45'),
                  color: sel ? '#fff' : '#c2410c',
                  boxShadow: '0 3px 0 ' + (sel ? '#c2185b' : '#FF9F4566'),
                }}
              >
                {tok}
              </button>
            );
          })}
          {availableTokens.length === 0 && <span className="text-xs text-purple-500 italic font-medium">Đã đặt hết số 🎉</span>}
        </div>
      )}
      {!submitted && selectedToken && (
        <p className="text-xs font-bold text-pink-600">👆 Đã chọn <strong>{selectedToken}</strong> — bấm vào ô trống trên tam giác để đặt</p>
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
      {opts.map((o, i) => {
        const selected = userMatch[o.key];
        const correct = correctMap[o.key];
        const lc = OPTION_COLORS[i % OPTION_COLORS.length];
        return (
          <div key={o.key} className="flex items-center gap-3 flex-wrap">
            <div
              className="px-3 py-1.5 rounded-xl font-bold text-sm min-w-[6rem] kid-display"
              style={{ background: lc.bg, border: `2px solid ${lc.c}`, color: lc.dark }}
            >
              {o.text}
            </div>
            <span className="text-purple-400 font-black text-lg">↔</span>
            <div className="flex gap-2 flex-wrap">
              {rightItems.map((rv, ri) => {
                const isSelected = selected === rv;
                const isCorrect = submitted && rv === correct;
                const isWrong = submitted && isSelected && rv !== correct;
                const rc = OPTION_COLORS[(ri + 2) % OPTION_COLORS.length];
                let border = rc.c, bg: string = rc.bg, color = rc.dark, extra = '';
                if (isCorrect) { border = '#22c55e'; bg = '#DCFCE7'; color = '#15803d'; extra = 'kid-bounce'; }
                else if (isWrong) { border = '#ef4444'; bg = '#FEE2E2'; color = '#b91c1c'; extra = 'kid-shake'; }
                else if (isSelected) { border = '#FF6B9D'; bg = 'linear-gradient(135deg, #FFE5F1, #FFD6E8)'; color = '#c2185b'; }
                return (
                  <button
                    key={rv}
                    onClick={() => !submitted && setMatch(o.key, rv)}
                    className={`px-3 py-1.5 rounded-xl text-sm font-bold transition-all kid-display ${extra}`}
                    style={{ border: `2px solid ${border}`, background: bg, color, boxShadow: `0 2px 0 ${border}55` }}
                  >
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
    pct >= 90 ? { label: 'Xuất sắc', color: '#22c55e', gradient: 'linear-gradient(135deg, #6BCB77, #4ECDC4)', emoji: '🏆', pass: true }
    : pct >= 70 ? { label: 'Giỏi', color: '#4ECDC4', gradient: 'linear-gradient(135deg, #4ECDC4, #A06CD5)', emoji: '⭐', pass: true }
    : pct >= 50 ? { label: 'Đạt', color: '#FF9F45', gradient: 'linear-gradient(135deg, #FFD93D, #FF9F45)', emoji: '👍', pass: true }
    : { label: 'Chưa đạt', color: '#FF6B9D', gradient: 'linear-gradient(135deg, #FF6B9D, #FF9F45)', emoji: '📚', pass: false };

  return (
    <div className="kid-bg min-h-screen relative overflow-hidden">
      {/* Confetti decorations if pass */}
      {grade.pass && (
        <>
          <div className="pointer-events-none absolute top-6 left-4 text-5xl kid-bounce select-none" aria-hidden>🎉</div>
          <div className="pointer-events-none absolute top-10 right-6 text-5xl kid-bounce select-none" style={{ animationDelay: '0.3s' }} aria-hidden>🎊</div>
          <div className="pointer-events-none absolute top-1/3 left-2 text-4xl kid-bounce select-none" style={{ animationDelay: '0.6s' }} aria-hidden>⭐</div>
          <div className="pointer-events-none absolute top-1/2 right-3 text-4xl kid-bounce select-none" style={{ animationDelay: '0.9s' }} aria-hidden>✨</div>
        </>
      )}

      <div className="max-w-2xl mx-auto px-4 py-8 relative">
        <div
          className="bg-white rounded-[32px] border-4 border-pink-200 p-8 mb-6 text-center kid-pop-in"
          style={{ boxShadow: '0 12px 40px rgba(255,107,157,0.25)' }}
        >
          <div className="text-7xl mb-3 kid-bounce">{grade.emoji}</div>
          <h2
            className="text-3xl font-black kid-display mb-2"
            style={{ background: grade.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            {grade.label}!
          </h2>
          <div
            className="text-6xl font-black my-4 kid-display"
            style={{ background: grade.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            {score}
          </div>
          <div className="text-purple-600 text-sm font-bold">/ {exam.totalPoints} điểm</div>
          <div className="mt-5 flex justify-center gap-3 flex-wrap text-sm font-bold">
            <span className="px-3 py-1.5 rounded-full" style={{ background: '#DCFCE7', color: '#15803d', border: '2px solid #6BCB77' }}>✅ Đúng: {correctCount}</span>
            <span className="px-3 py-1.5 rounded-full" style={{ background: '#FEE2E2', color: '#b91c1c', border: '2px solid #ef4444' }}>❌ Sai: {totalQ - correctCount}</span>
            <span className="px-3 py-1.5 rounded-full" style={{ background: '#EBD8FF', color: '#6b21a8', border: '2px solid #A06CD5' }}>📋 Tổng: {totalQ}</span>
          </div>
          <div className="mt-6 h-4 bg-pink-100 rounded-full overflow-hidden border-2 border-pink-200">
            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: grade.gradient }} />
          </div>
          <p className="text-xs text-purple-500 mt-2 font-bold">{pct}% câu đúng 🌟</p>
        </div>

        <div
          className="bg-white rounded-3xl border-4 border-purple-200 p-6 mb-6"
          style={{ boxShadow: '0 8px 30px rgba(160,108,213,0.18)' }}
        >
          <h3
            className="font-black text-xl mb-4 kid-display flex items-center gap-2"
            style={{ background: 'linear-gradient(135deg, #A06CD5, #4ECDC4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            📖 Xem lại đáp án
          </h3>
          <div className="space-y-3">
            {results.map((r, idx) => (
              <div
                key={r.q.id}
                className="rounded-2xl p-4"
                style={{
                  background: r.correct ? 'linear-gradient(135deg, #DCFCE7, #BBF7D0)' : 'linear-gradient(135deg, #FEE2E2, #FECACA)',
                  border: `3px solid ${r.correct ? '#6BCB77' : '#ef4444'}`,
                  boxShadow: `0 3px 0 ${r.correct ? '#6BCB7755' : '#ef444455'}`,
                }}
              >
                <p className="font-bold text-purple-900 text-sm">
                  <span className="mr-2 text-lg">{r.correct ? '✅' : '❌'}</span>
                  Câu {idx + 1}: {r.q.questionText}
                </p>
                {r.q.explanation && (
                  <p className="text-xs text-purple-700/80 mt-1 italic ml-7">💡 {r.q.explanation}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={onRetry}
            className="kid-btn-3d"
            style={{ background: 'linear-gradient(135deg, #4ECDC4, #A06CD5)', boxShadow: '0 5px 0 #6b21a8', color: '#fff', padding: '12px 24px' }}
          >
            🔄 Làm lại
          </button>
          <Link
            href="/de-thi"
            className="kid-btn-3d inline-flex items-center"
            style={{ background: 'linear-gradient(135deg, #FFF4D6, #FFE5B4)', boxShadow: '0 5px 0 #FF9F4566', color: '#c2410c', padding: '12px 24px' }}
          >
            ← Danh sách đề thi
          </Link>
        </div>
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
    return (
      <div className="kid-bg min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-pink-400 border-t-transparent" />
      </div>
    );
  }
  if (notFound || !exam) {
    return (
      <div className="kid-bg min-h-screen">
        <div className="max-w-xl mx-auto px-4 py-16 text-center">
          <div
            className="bg-white rounded-[32px] border-4 border-pink-200 p-10"
            style={{ boxShadow: '0 8px 30px rgba(255,107,157,0.20)' }}
          >
            <div className="text-6xl mb-4 kid-bounce">📋</div>
            <h1
              className="text-2xl font-black kid-display mb-4"
              style={{ background: 'linear-gradient(135deg, #FF6B9D, #FFD93D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              Không tìm thấy đề thi
            </h1>
            <Link
              href="/de-thi"
              className="kid-btn-3d inline-flex items-center"
              style={{ background: 'linear-gradient(135deg, #4ECDC4, #A06CD5)', boxShadow: '0 5px 0 #6b21a8', color: '#fff', padding: '10px 22px' }}
            >
              ← Quay lại danh sách
            </Link>
          </div>
        </div>
      </div>
    );
  }
  if (submitted) {
    return <ResultScreen exam={exam} answers={answers} tfAnswers={tfAnswers} fillAnswers={fillAnswers} ncAnswers={ncAnswers} dragAnswers={dragAnswers} onRetry={handleRetry} />;
  }

  const DIFF_LABEL: Record<string, string> = { easy: 'Dễ', medium: 'Trung bình', hard: 'Khó' };
  const DIFF_STYLE: Record<string, { bg: string; color: string; border: string; emoji: string }> = {
    easy: { bg: '#DCFCE7', color: '#15803d', border: '#6BCB77', emoji: '🌱' },
    medium: { bg: '#FFF4D6', color: '#c2410c', border: '#FF9F45', emoji: '🔥' },
    hard: { bg: '#FEE2E2', color: '#b91c1c', border: '#ef4444', emoji: '⚡' },
  };

  return (
    <div className="kid-bg min-h-screen relative overflow-hidden">
      {/* Floating decorations */}
      <div className="pointer-events-none absolute top-32 left-2 text-3xl kid-bounce select-none opacity-70" aria-hidden>⭐</div>
      <div className="pointer-events-none absolute top-44 right-3 text-3xl kid-bounce select-none opacity-70" style={{ animationDelay: '0.5s' }} aria-hidden>🎈</div>

      <div className="max-w-2xl mx-auto px-4 py-6 relative">
        {/* Sticky header */}
        <div
          className="bg-white rounded-3xl border-4 border-pink-200 p-5 mb-5 sticky top-2 z-10 kid-pop-in"
          style={{ boxShadow: '0 8px 30px rgba(255,107,157,0.20)' }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h1
                className="text-xl sm:text-2xl font-black kid-display leading-snug"
                style={{ background: 'linear-gradient(135deg, #FF6B9D, #A06CD5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                📝 {exam.title}
              </h1>
              {exam.description && <p className="text-xs sm:text-sm text-purple-700/80 mt-1 font-medium">{exam.description}</p>}
            </div>
            {timeLeft !== null && (
              <div
                className={`shrink-0 text-center px-4 py-2 rounded-2xl font-black text-sm kid-display ${timeLeft < 60 ? 'kid-pulse-glow' : ''}`}
                style={{
                  background: timeLeft < 60
                    ? 'linear-gradient(135deg, #FEE2E2, #FECACA)'
                    : 'linear-gradient(135deg, #FF9F45, #FFD93D)',
                  color: timeLeft < 60 ? '#b91c1c' : '#fff',
                  border: '3px solid ' + (timeLeft < 60 ? '#ef4444' : '#FF9F45'),
                  boxShadow: '0 4px 0 ' + (timeLeft < 60 ? '#ef444466' : '#c2410c66'),
                }}
              >
                ⏱️ {formatTime(timeLeft)}
              </div>
            )}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 h-3 bg-pink-100 rounded-full overflow-hidden border-2 border-pink-200">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${(answeredCount / exam.questions.length) * 100}%`, background: 'linear-gradient(90deg, #FF6B9D, #FFD93D)' }}
              />
            </div>
            <span className="text-xs font-black text-purple-700 shrink-0 kid-display">{answeredCount}/{exam.questions.length} 🎯</span>
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

            const diff = DIFF_STYLE[q.difficultyLevel];

            return (
              <div
                key={q.id}
                className="bg-white rounded-3xl p-5 transition-all"
                style={{
                  border: `4px solid ${isAnswered ? '#4ECDC4' : '#FFE5F1'}`,
                  boxShadow: isAnswered ? '0 6px 20px rgba(78,205,196,0.20)' : '0 6px 20px rgba(255,107,157,0.15)',
                }}
              >
                <div className="flex items-start gap-2 mb-3">
                  <span
                    className="shrink-0 w-9 h-9 rounded-full text-white text-sm font-black flex items-center justify-center mt-0.5 kid-display"
                    style={{ background: 'linear-gradient(135deg, #FF6B9D, #A06CD5)', boxShadow: '0 3px 0 #c2185b55' }}
                  >
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-start gap-2">
                      <p className="text-purple-900 font-bold leading-snug flex-1 kid-display">{q.questionText}</p>
                      <SpeakButton text={q.questionText} />
                    </div>
                    <span
                      className="inline-block mt-2 text-xs px-2.5 py-1 rounded-full font-black kid-display"
                      style={{ background: diff.bg, color: diff.color, border: `2px solid ${diff.border}` }}
                    >
                      {diff.emoji} {DIFF_LABEL[q.difficultyLevel]} · {q.points} điểm
                    </span>
                  </div>
                </div>

                {/* single_choice / multiple_choice */}
                {(q.questionType === 'single_choice' || q.questionType === 'multiple_choice') && (() => {
                  const opts = shuffledOpts[q.id] ?? (Array.isArray(q.optionsJson) ? q.optionsJson as OptionItem[] : []);
                  return (
                    <div className="space-y-2 ml-9">
                      {opts.map((opt, oi) => {
                        const selected = answers[q.id] === opt.key;
                        const correctKey = String(q.correctAnswerJson);
                        const oc = OPTION_COLORS[oi % OPTION_COLORS.length];
                        let border = oc.c;
                        let bg: string = oc.bg;
                        let color = oc.dark;
                        let extra = '';
                        if (submitted) {
                          if (opt.key === correctKey) { border = '#22c55e'; bg = 'linear-gradient(135deg, #DCFCE7, #BBF7D0)'; color = '#15803d'; extra = 'kid-bounce'; }
                          else if (selected) { border = '#ef4444'; bg = 'linear-gradient(135deg, #FEE2E2, #FECACA)'; color = '#b91c1c'; extra = 'kid-shake'; }
                          else { border = '#E9D5FF'; bg = '#FAF5FF'; color = '#A78BFA'; }
                        } else if (selected) {
                          border = '#FF6B9D'; bg = 'linear-gradient(135deg, #FFE5F1, #FFD6E8)'; color = '#c2185b';
                        }
                        return (
                          <button
                            key={opt.key}
                            onClick={() => !submitted && setAnswers((p) => ({ ...p, [q.id]: opt.key }))}
                            className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all kid-display hover:scale-[1.02] ${extra}`}
                            style={{ border: `3px solid ${border}`, background: bg, color, boxShadow: `0 4px 0 ${border}55` }}
                          >
                            <span
                              className="inline-flex w-7 h-7 rounded-full items-center justify-center text-xs mr-2 font-black kid-display"
                              style={{ background: selected || (submitted && opt.key === correctKey) ? oc.c : '#fff', color: selected || (submitted && opt.key === correctKey) ? '#fff' : oc.c, border: `2px solid ${oc.c}` }}
                            >
                              {opt.key}
                            </span>
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
                      const baseColor = val
                        ? { c: '#6BCB77', bg: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)', dark: '#15803d' }
                        : { c: '#FF6B9D', bg: 'linear-gradient(135deg, #FFE5F1, #FFD6E8)', dark: '#c2185b' };
                      let border = baseColor.c, bg: string = baseColor.bg, color = baseColor.dark, extra = '';
                      if (isCorrect) { border = '#22c55e'; bg = 'linear-gradient(135deg, #DCFCE7, #BBF7D0)'; color = '#15803d'; extra = 'kid-bounce'; }
                      else if (isWrong) { border = '#ef4444'; bg = 'linear-gradient(135deg, #FEE2E2, #FECACA)'; color = '#b91c1c'; extra = 'kid-shake'; }
                      else if (!submitted && !selected) { bg = '#fff'; color = '#A78BFA'; border = '#E9D5FF'; }
                      return (
                        <button
                          key={String(val)}
                          onClick={() => !submitted && setTfAnswers((p) => ({ ...p, [q.id]: val }))}
                          className={`flex-1 py-3 rounded-2xl text-base font-black transition-all kid-display ${extra}`}
                          style={{ border: `3px solid ${border}`, background: bg, color, boxShadow: `0 4px 0 ${border}55` }}
                        >
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
        <div
          className="bg-white rounded-3xl border-4 border-pink-200 p-6 text-center"
          style={{ boxShadow: '0 8px 30px rgba(255,107,157,0.20)' }}
        >
          {answeredCount < exam.questions.length && (
            <p className="text-sm font-bold text-orange-600 mb-3 kid-display">⚠️ Còn {exam.questions.length - answeredCount} câu chưa trả lời nhé!</p>
          )}
          <button
            onClick={handleSubmit}
            className="kid-btn-3d text-base"
            style={{
              background: 'linear-gradient(135deg, #6BCB77, #4ECDC4)',
              boxShadow: '0 6px 0 #0f766e',
              color: '#fff',
              padding: '14px 36px',
            }}
          >
            🏆 Nộp bài
          </button>
        </div>
      </div>
    </div>
  );
}
