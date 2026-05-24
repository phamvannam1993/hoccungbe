'use client';

import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiFetch } from '../../lib/api';
import { buildExerciseUrl, DIFF_TO_SLUG } from '../../lib/quiz-slug';

const KidsCtx = createContext(false);
const useKids = () => useContext(KidsCtx);

// Returns true if text looks like a number or math expression (not plain words)
function isMathText(text: string): boolean {
  return /^[\d\s+\-×÷*/:=<>≤≥≠.,()%^√π]+$/.test(text.trim());
}

function formatMath(text: string): string {
  if (!isMathText(text)) return text;
  return text
    .replace(/\s*([+\-×÷*/:=<>≤≥≠])\s*/g, ' $1 ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

// ─── Types ────────────────────────────────────────────────────────────────────

type OptionItem = { key: string; text: string; audioUrl?: string; imageUrl?: string; pair?: string };

type QuizItem = {
  id: number;
  questionText: string;
  questionImageUrl?: string;
  questionAudioUrl?: string;
  questionType:
    | 'single_choice' | 'multiple_choice' | 'true_false'
    | 'drag_drop' | 'image_choice' | 'matching'
    | 'fill_blank' | 'table_fill' | 'number_line'
    | 'sorting' | 'cross_out' | 'coloring'
    | 'puzzle' | 'game' | 'counting';
  difficultyLevel: 'easy' | 'medium' | 'hard';
  optionsJson?: OptionItem[];
  correctAnswerJson?: unknown;
  explanation?: string;
  explanationAudioUrl?: string;
  points: number;
};

type ExerciseData = {
  exerciseNumber: number;
  difficultyLevel: 'easy' | 'medium' | 'hard';
  label: string;
  stars: number;
  quizCount: number;
  quizzes: QuizItem[];
};

type LessonMeta = {
  id: number;
  title: string;
  slug: string;
  course?: { title: string; slug: string };
};

const DIFF_COLOR: Record<string, string> = {
  easy: '#E8871A',
  medium: '#D85C4A',
  hard: '#C4892A',
};

const DIFF_LABEL: Record<string, string> = {
  easy: 'Bài tập cơ bản',
  medium: 'Bài tập trung bình',
  hard: 'Bài tập nâng cao',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function playAudio(url?: string) {
  if (!url) return;
  new Audio(url).play().catch(() => {});
}

function AudioBtn({ url, small }: { url?: string; small?: boolean }) {
  if (!url) return null;
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); playAudio(url); }}
      className={`shrink-0 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center transition-colors ${small ? 'w-6 h-6' : 'w-7 h-7'}`}
      title="Nghe audio"
    >
      <svg viewBox="0 0 24 24" fill="white" className={small ? 'w-3 h-3 ml-0.5' : 'w-3.5 h-3.5 ml-0.5'}>
        <path d="M8 5v14l11-7z"/>
      </svg>
    </button>
  );
}

// ─── Existing interaction components ─────────────────────────────────────────

function SingleChoice({ options, selected, checked, correctKey, onSelect }: {
  options: OptionItem[]; selected: string; checked: boolean; correctKey: string | null; onSelect: (key: string) => void;
}) {
  return (
    <div className={`grid gap-3 ${
      options.length === 2 ? 'grid-cols-2' :
      options.length === 3 ? (options.some(o => isMathText(o.text) && o.text.length > 6) ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-3') :
      options.some(o => isMathText(o.text) && o.text.length > 8) ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2'
    }`}>
      {options.map((opt) => {
        const isSel = selected === opt.key;
        const isRight = checked && opt.key === correctKey;
        const isWrong = checked && isSel && opt.key !== correctKey;
        return (
          <button key={opt.key}
            onClick={() => { if (!checked) { onSelect(opt.key); if (opt.audioUrl) playAudio(opt.audioUrl); else speak(opt.text); } }}
            style={{
              borderWidth: 3,
              borderStyle: 'solid',
              borderColor: isRight ? '#22c55e' : isWrong ? '#ef4444' : isSel ? '#f59e0b' : '#f0b429',
              borderRadius: 16,
              background: isRight ? '#f0fdf4' : isWrong ? '#fef2f2' : isSel ? '#fffbeb' : '#ffffff',
              boxShadow: isSel && !checked ? '0 2px 8px rgba(245,158,11,0.25)' : '0 1px 4px rgba(0,0,0,0.06)',
              transform: isSel && !checked ? 'scale(1.02)' : 'scale(1)',
              transition: 'all 0.15s',
              cursor: checked ? 'default' : 'pointer',
            }}
            className="relative flex flex-col items-center justify-center min-h-[110px] pl-3 pr-10 py-4"
          >
            {(() => {
              const idx2 = options.indexOf(opt);
              const optColor = isRight ? '#15803d' : isWrong ? '#b91c1c' : OPTION_COLORS[idx2 % OPTION_COLORS.length];
              const isMath = isMathText(opt.text || opt.key);
              return (
                <div className="flex items-center gap-2">
                  {opt.audioUrl && <AudioBtn url={opt.audioUrl} small />}
                  <span style={{
                    fontSize: isMath ? (opt.text.length > 11 ? 14 : opt.text.length > 8 ? 18 : opt.text.length > 5 ? 26 : opt.text.length > 3 ? 36 : 48) : 16,
                    fontWeight: isMath ? 900 : 700,
                    color: isMath ? optColor : (isRight ? '#15803d' : isWrong ? '#b91c1c' : '#1e293b'),
                    textShadow: isMath && !checked && !isSel ? `2px 3px 0 ${optColor}55` : undefined,
                    letterSpacing: '-0.5px',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                  }}>{formatMath(opt.text || opt.key)}</span>
                </div>
              );
            })()}
            {isRight && <span className="absolute top-2 right-2.5 text-green-500 font-black text-base">✓</span>}
            {isWrong && <span className="absolute top-2 right-2.5 text-red-500 font-black text-base">✗</span>}
          </button>
        );
      })}
    </div>
  );
}

const OPTION_COLORS = ['#3b82f6','#e53935','#9c27b0','#f97316','#0d9488','#7c3aed'];

function MultipleChoice({ options, selected, checked, correctKeys, onToggle }: {
  options: OptionItem[]; selected: string[]; checked: boolean; correctKeys: string[]; onToggle: (key: string) => void;
}) {
  return (
    <div className={`grid gap-4 ${options.length === 2 ? 'grid-cols-2' : options.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
      {options.map((opt, idx) => {
        const isSel = selected.includes(opt.key);
        const isRight = checked && correctKeys.includes(opt.key);
        const isWrong = checked && isSel && !correctKeys.includes(opt.key);
        const optColor = isRight ? '#15803d' : isWrong ? '#b91c1c' : OPTION_COLORS[idx % OPTION_COLORS.length];
        return (
          <button key={opt.key}
            onClick={() => { if (!checked) { onToggle(opt.key); if (opt.audioUrl) playAudio(opt.audioUrl); else speak(opt.text); } }}
            style={{
              borderWidth: 3,
              borderStyle: 'solid',
              borderColor: isRight ? '#22c55e' : isWrong ? '#ef4444' : isSel ? '#f59e0b' : '#f0b429',
              borderRadius: 16,
              background: isRight ? '#f0fdf4' : isWrong ? '#fef2f2' : isSel ? '#fffbeb' : '#ffffff',
              boxShadow: isSel && !checked ? '0 2px 8px rgba(245,158,11,0.25)' : '0 1px 4px rgba(0,0,0,0.06)',
              transform: isSel && !checked ? 'scale(1.02)' : 'scale(1)',
              transition: 'all 0.15s',
              cursor: checked ? 'default' : 'pointer',
            }}
            className="relative flex flex-col items-center justify-center min-h-[110px] pl-3 pr-10 py-4"
          >
            {/* Checkbox indicator */}
            <span className={`absolute top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-black transition-all ${isSel ? 'border-amber-500 bg-amber-500 text-white' : 'border-gray-300 bg-white'}`}>
              {isSel && '✓'}
            </span>
            {opt.audioUrl && <AudioBtn url={opt.audioUrl} small />}
            {(() => {
              const isMath = isMathText(opt.text);
              return (
                <span style={{
                  fontSize: isMath ? (opt.text.length > 11 ? 14 : opt.text.length > 8 ? 18 : opt.text.length > 5 ? 26 : opt.text.length > 3 ? 36 : 48) : 16,
                  fontWeight: isMath ? 900 : 700,
                  color: isMath ? optColor : (isRight ? '#15803d' : isWrong ? '#b91c1c' : '#1e293b'),
                  textShadow: isMath && !checked && !isSel ? `2px 3px 0 ${optColor}55` : undefined,
                  letterSpacing: '-0.5px',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                }}>{formatMath(opt.text)}</span>
              );
            })()}
            {isRight && !isSel && <span className="absolute top-3 right-3 text-green-500 font-black text-base">✓</span>}
            {isWrong && <span className="absolute bottom-2 right-3 text-xs text-red-500 font-bold">✗ Sai</span>}
          </button>
        );
      })}
    </div>
  );
}

function TrueFalse({ selected, checked, correctAnswer, onSelect }: {
  selected: string; checked: boolean; correctAnswer: boolean | null; onSelect: (val: string) => void;
}) {
  const opts = [
    { key: 'true', label: '✅ Đúng', correct: correctAnswer === true },
    { key: 'false', label: '❌ Sai', correct: correctAnswer === false },
  ];
  return (
    <div className="flex gap-4">
      {opts.map((opt) => {
        const isSel = selected === opt.key;
        const isRight = checked && opt.correct;
        const isWrong = checked && isSel && !opt.correct;
        return (
          <button key={opt.key} onClick={() => !checked && onSelect(opt.key)}
            className={`flex-1 py-5 rounded-2xl border-2 text-lg font-bold transition-all ${isRight ? 'border-green-500 bg-green-50 text-green-700' : isWrong ? 'border-red-500 bg-red-50 text-red-700' : isSel ? 'border-amber-400 bg-amber-50 text-amber-700' : 'border-gray-200 bg-white text-gray-700 hover:border-amber-300'} ${checked ? 'cursor-default' : 'cursor-pointer'}`}
          >{opt.label}</button>
        );
      })}
    </div>
  );
}

function DragDrop({ options, order, checked, correctOrder, onReorder }: {
  options: OptionItem[]; order: string[]; checked: boolean; correctOrder: string[]; onReorder: (newOrder: string[]) => void;
}) {
  const dragIdx = useRef<number | null>(null);
  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-400 mb-3">Kéo thả để sắp xếp thứ tự đúng</p>
      {order.map((key, idx) => {
        const opt = options.find((o) => o.key === key);
        const isRight = checked && correctOrder[idx] === key;
        const isWrong = checked && correctOrder[idx] !== key;
        return (
          <div key={key} draggable={!checked}
            onDragStart={() => { dragIdx.current = idx; }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (dragIdx.current === null || dragIdx.current === idx) return;
              const newOrder = [...order];
              const [moved] = newOrder.splice(dragIdx.current, 1);
              newOrder.splice(idx, 0, moved);
              onReorder(newOrder);
              dragIdx.current = null;
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 18px', borderRadius: 16,
              borderWidth: 2, borderStyle: 'solid',
              borderColor: isRight ? '#22c55e' : isWrong ? '#ef4444' : '#e5e7eb',
              background: isRight ? '#f0fdf4' : isWrong ? '#fef2f2' : '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              cursor: checked ? 'default' : 'grab', transition: 'all 0.15s',
            }}
          >
            {!checked && <span style={{ color: '#d1d5db', fontSize: 20, userSelect: 'none', flexShrink: 0 }}>⠿</span>}
            <span style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              background: `${OPTION_COLORS[idx % OPTION_COLORS.length]}22`,
              border: `2px solid ${OPTION_COLORS[idx % OPTION_COLORS.length]}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, fontWeight: 900, color: OPTION_COLORS[idx % OPTION_COLORS.length],
            }}>{idx + 1}</span>
            <span style={{
              flex: 1,
              fontSize: isMathText(opt?.text ?? key) ? 28 : 18,
              fontWeight: 700, color: isRight ? '#15803d' : isWrong ? '#b91c1c' : '#1e293b',
            }}>{formatMath(opt?.text ?? key)}</span>
            {isRight && <span style={{ color: '#22c55e', fontWeight: 900, fontSize: 18, flexShrink: 0 }}>✓</span>}
            {isWrong && <span style={{ fontSize: 12, color: '#ef4444', flexShrink: 0 }}>→ {options.find((o) => o.key === correctOrder[idx])?.text}</span>}
          </div>
        );
      })}
    </div>
  );
}

function ImageChoice({ options, selected, checked, correctKey, onSelect }: {
  options: OptionItem[]; selected: string; checked: boolean; correctKey: string | null; onSelect: (key: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {options.map((opt) => {
        const isSel = selected === opt.key;
        const isRight = checked && opt.key === correctKey;
        const isWrong = checked && isSel && opt.key !== correctKey;
        return (
          <button key={opt.key} onClick={() => !checked && onSelect(opt.key)}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${isRight ? 'border-green-500 bg-green-50' : isWrong ? 'border-red-500 bg-red-50' : isSel ? 'border-amber-400 bg-amber-50' : 'border-gray-200 bg-white hover:border-amber-300'} ${checked ? 'cursor-default' : 'cursor-pointer'}`}
          >
            {opt.imageUrl
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={opt.imageUrl} alt={opt.text} className="w-full h-16 object-contain rounded" />
              : <div className="w-full h-16 rounded bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-600">{opt.key}</div>
            }
            <span className="text-xs font-medium text-gray-700">{formatMath(opt.text)}</span>
            {isRight && <span className="text-green-600 text-xs font-bold">✓ Đúng</span>}
            {isWrong && <span className="text-red-600 text-xs font-bold">✗ Sai</span>}
          </button>
        );
      })}
    </div>
  );
}

type Line = { x1: number; y1: number; x2: number; y2: number; color: string };

function Matching({ options, userMap, checked, correctMap, onChange }: {
  options: OptionItem[]; userMap: Record<string, string>; checked: boolean; correctMap: Record<string, string>; onChange: (map: Record<string, string>) => void;
}) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [svgSize, setSvgSize] = useState({ w: 0, h: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const leftRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const rightRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const rightItems = useState<string[]>(() => {
    const hasPair = options.some((o) => !!o.pair);
    const items = hasPair ? options.map((o) => o.pair ?? '').filter(Boolean) : options.map((o) => correctMap[o.key] ?? '').filter(Boolean);
    // Deduplicate so same-value right items appear only once
    const unique = Array.from(new Set(items));
    for (let i = unique.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [unique[i], unique[j]] = [unique[j], unique[i]]; }
    return unique;
  })[0];

  // Restore posMap from existing userMap answers (when navigating back)
  const [posMap, setPosMap] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    options.forEach((opt) => {
      const matched = userMap[opt.key];
      if (matched) {
        const pos = rightItems.indexOf(matched);
        if (pos >= 0) initial[opt.key] = pos;
      }
    });
    return initial;
  });

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const cRect = container.getBoundingClientRect();
    setSvgSize({ w: cRect.width, h: cRect.height });
    const newLines: Line[] = [];
    options.forEach((opt, leftIdx) => {
      const pos = posMap[opt.key];
      if (pos === undefined) return;
      const leftEl = leftRefs.current[leftIdx];
      const rightEl = rightRefs.current[pos];
      if (!leftEl || !rightEl) return;
      const lRect = leftEl.getBoundingClientRect();
      const rRect = rightEl.getBoundingClientRect();
      const x1 = lRect.right - cRect.left, y1 = lRect.top + lRect.height / 2 - cRect.top;
      const x2 = rRect.left - cRect.left, y2 = rRect.top + rRect.height / 2 - cRect.top;
      let color = '#3b82f6';
      if (checked) color = correctMap[opt.key] === userMap[opt.key] ? '#22c55e' : '#ef4444';
      newLines.push({ x1, y1, x2, y2, color });
    });
    setLines(newLines);
  }, [posMap, checked, options, rightItems, correctMap, userMap]);

  const connectedPositions = new Set(Object.values(posMap));

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-400 mb-1">Chọn vế trái rồi chọn vế phải để nối</p>
      <div ref={containerRef} className="relative flex gap-2">
        <svg className="absolute inset-0 pointer-events-none" width={svgSize.w} height={svgSize.h} style={{ overflow: 'visible' }}>
          {lines.map((ln, i) => {
            const mx = (ln.x1 + ln.x2) / 2;
            return (
              <g key={i}>
                <path d={`M ${ln.x1} ${ln.y1} C ${mx} ${ln.y1} ${mx} ${ln.y2} ${ln.x2} ${ln.y2}`} fill="none" stroke={ln.color} strokeWidth={2.5} strokeLinecap="round" opacity={0.85} />
                <circle cx={ln.x1} cy={ln.y1} r={4} fill={ln.color} opacity={0.9} />
                <circle cx={ln.x2} cy={ln.y2} r={4} fill={ln.color} opacity={0.9} />
              </g>
            );
          })}
        </svg>
        <div className="flex-1 space-y-3 min-w-0">
          {options.map((opt, idx) => {
            const isSelected = selectedLeft === opt.key;
            const matched = userMap[opt.key];
            const isCorrect = checked && !!matched && correctMap[opt.key] === matched;
            const isWrong = checked && !!matched && correctMap[opt.key] !== matched;
            const col = OPTION_COLORS[idx % OPTION_COLORS.length];
            return (
              <button key={opt.key} ref={(el) => { leftRefs.current[idx] = el; }}
                onClick={() => { if (!checked) setSelectedLeft((prev) => prev === opt.key ? null : opt.key); }}
                style={{
                  borderWidth: 3, borderStyle: 'solid',
                  borderColor: isCorrect ? '#22c55e' : isWrong ? '#ef4444' : isSelected ? '#f59e0b' : matched ? '#3b82f6' : '#e5e7eb',
                  borderRadius: 14,
                  background: isCorrect ? '#f0fdf4' : isWrong ? '#fef2f2' : isSelected ? '#fffbeb' : matched ? '#eff6ff' : '#fff',
                  boxShadow: isSelected ? '0 2px 8px rgba(245,158,11,0.3)' : '0 1px 3px rgba(0,0,0,0.06)',
                  cursor: checked ? 'default' : 'pointer',
                }}
                className="w-full flex items-center px-5 py-4 transition-all"
              >
                <span style={{ fontSize: isMathText(opt.text) ? 32 : 17, fontWeight: isMathText(opt.text) ? 900 : 600, color: isCorrect ? '#15803d' : isWrong ? '#b91c1c' : isMathText(opt.text) ? col : '#1e293b', textShadow: (isMathText(opt.text) && !checked && !isSelected && !matched) ? `1px 2px 0 ${col}44` : undefined }} className="flex-1 text-left">{formatMath(opt.text)}</span>
                {isCorrect && <span className="text-green-600 font-black text-lg shrink-0">✓</span>}
                {isWrong && <span className="text-red-500 font-black shrink-0">✗</span>}
              </button>
            );
          })}
        </div>
        <div className="w-8 shrink-0" />
        <div className="flex-1 space-y-3 min-w-0">
          {rightItems.map((text, pos) => {
            const isConnected = connectedPositions.has(pos);
            const ownerKeys = Object.keys(posMap).filter((k) => posMap[k] === pos);
            const ownerKey = ownerKeys[0];
            const ownerIdx = ownerKey ? options.findIndex((o) => o.key === ownerKey) : -1;
            const col = ownerIdx >= 0 ? OPTION_COLORS[ownerIdx % OPTION_COLORS.length] : '#6b7280';
            const allCorrect = checked && ownerKeys.length > 0 && ownerKeys.every((k) => correctMap[k] === text);
            const anyWrong = checked && ownerKeys.some((k) => correctMap[k] !== text);
            const isCorrect = allCorrect;
            const isWrong = anyWrong && !allCorrect;
            const isTarget = !checked && !!selectedLeft;
            return (
              <button key={pos} ref={(el) => { rightRefs.current[pos] = el; }}
                onClick={() => {
                  if (checked || !selectedLeft) return;
                  const newPosMap = { ...posMap };
                  // Only remove the selectedLeft's previous connection (don't evict others)
                  newPosMap[selectedLeft] = pos;
                  setPosMap(newPosMap);
                  const newMap = { ...userMap };
                  newMap[selectedLeft] = text;
                  onChange(newMap);
                  setSelectedLeft(null);
                }}
                disabled={checked}
                style={{
                  borderWidth: 3, borderStyle: 'solid',
                  borderColor: isCorrect ? '#22c55e' : isWrong ? '#ef4444' : isConnected ? '#3b82f6' : isTarget ? '#f59e0b' : '#e5e7eb',
                  borderRadius: 14,
                  background: isCorrect ? '#f0fdf4' : isWrong ? '#fef2f2' : isConnected ? '#eff6ff' : '#fff',
                  cursor: checked ? 'default' : 'pointer',
                }}
                className="w-full px-5 py-4 text-left transition-all"
              >
                <span style={{ fontSize: isMathText(text) ? 32 : 17, fontWeight: isMathText(text) ? 900 : 600, color: isCorrect ? '#15803d' : isWrong ? '#b91c1c' : isConnected ? col : '#374151' }}>{formatMath(text)}</span>
                {isCorrect && <span className="ml-2 text-green-600 font-black">✓</span>}
                {isWrong && ownerKey && <span className="ml-1 text-xs text-red-500">(đúng: {correctMap[ownerKey]})</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── NEW: FillBlank (InputInteraction) ───────────────────────────────────────
// questionText may contain [b1], [b2]... as placeholders for blanks
// optionsJson: [{ key:'b1', text:'' }, ...]
// correctAnswerJson: { b1: '3', b2: '5' }

const NUMBER_COLORS = ['#3b82f6', '#ef4444', '#6366f1', '#ec4899', '#f97316', '#8b5cf6', '#14b8a6', '#b91c1c'];

function FillBlank({ questionText, blanks, answers, checked, correctMap, activeKey, onFocusBlank, onChange }: {
  questionText: string;
  blanks: OptionItem[];
  answers: Record<string, string>;
  checked: boolean;
  correctMap: Record<string, string>;
  activeKey?: string | null;
  onFocusBlank?: (key: string) => void;
  onChange: (key: string, val: string) => void;
}) {
  const [showHint, setShowHint] = useState(false);
  const parts = questionText.split(/(\[b\d+\])/g);

  // Detect if this is a number-sequence style question (tokens are mostly numbers/short)
  const isNumberSeq = parts.every((p) => {
    const m = p.match(/^\[(\w+)\]$/);
    return m || /^[\s\d\W]{0,5}$/.test(p.trim()) || p.trim() === '';
  }) && parts.some((p) => /^\[b\d+\]$/.test(p));

  let numColorIdx = 0;

  return (
    <div className="space-y-4">
      {isNumberSeq ? (
        <div className="flex flex-wrap items-center justify-center gap-4 py-8">
          {parts.map((part, i) => {
            const match = part.match(/^\[(\w+)\]$/);
            if (match) {
              const key = match[1];
              const val = answers[key] ?? '';
              const correct = correctMap[key];
              const isOk = checked ? val.trim() === String(correct) : null;
              const isActive = !checked && activeKey === key;
              return (
                <input key={i} type="text" inputMode="numeric" value={val}
                  onChange={(e) => onChange(key, e.target.value)}
                  onFocus={() => onFocusBlank?.(key)}
                  disabled={checked}
                  readOnly={!!onFocusBlank && !checked}
                  style={{
                    borderColor: checked ? (isOk ? '#22c55e' : '#ef4444') : isActive ? '#3b82f6' : '#ccc',
                    boxShadow: isActive ? '0 0 0 3px rgba(59,130,246,0.2)' : undefined,
                    borderRadius: 12,
                  }}
                  className={`w-20 h-20 text-center font-black text-3xl border-2 outline-none transition-all cursor-pointer ${checked ? (isOk ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600') : 'bg-white text-gray-800'}`}
                />
              );
            }
            const txt = part.trim();
            if (!txt) return null;
            const color = NUMBER_COLORS[numColorIdx++ % NUMBER_COLORS.length];
            return (
              <span key={i} className="text-5xl font-black select-none leading-none" style={{ color, textShadow: `2px 3px 0 ${color}88` }}>
                {txt}
              </span>
            );
          })}
        </div>
      ) : (
        /* Non-sequence: inputs are rendered inline in question text above */
        null
      )}

      {/* If no inline placeholders, render blanks below */}
      {!questionText.includes('[') && blanks.length > 0 && (
        <div className="flex flex-wrap gap-3 pt-2">
          {blanks.map((blank, idx) => {
            const val = answers[blank.key] ?? '';
            const correct = correctMap[blank.key];
            const isOk = checked ? val.trim() === String(correct) : null;
            return (
              <div key={blank.key} className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Ô {idx + 1}:</span>
                <input type="text" inputMode="numeric" value={val}
                  onChange={(e) => onChange(blank.key, e.target.value)}
                  disabled={checked}
                  className={`w-16 h-12 text-center font-bold text-xl rounded-xl border-[3px] outline-none transition-all ${checked ? (isOk ? 'border-green-500 bg-green-50 text-green-700' : 'border-red-400 bg-red-50 text-red-700') : 'border-blue-400 bg-white focus:border-blue-600'}`}
                />
                {checked && !isOk && <span className="text-xs text-green-600">→ {correct}</span>}
              </div>
            );
          })}
        </div>
      )}

      {/* Hint button */}
      {false && !checked && (
        <div className="flex justify-center pt-2">
          <button onClick={() => setShowHint((s) => !s)}
            className="flex items-center gap-2 text-teal-600 font-semibold text-sm hover:text-teal-700 transition-colors">
            <span className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center shadow">
              <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4"><path d="M9 21h6v-2H9v2zm3-19C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17h8v-2.26C17.81 13.47 19 11.38 19 9c0-3.87-3.13-7-7-7zm-1 14v-1.5c-1.86-.68-3-2.47-3-4.5C8 7.01 10.01 5 12 5s4 2.01 4 4.5c0 2.03-1.14 3.82-3 4.5V16h-2z"/></svg>
            </span>
            {showHint ? 'Ẩn gợi ý' : 'Xem gợi ý'}
          </button>
        </div>
      )}
      {showHint && !checked && (
        <div className="flex items-start gap-3 mt-3 px-4 py-4 rounded-2xl" style={{ background: '#fffbe8', border: '1px solid #f0d99a' }}>
          {/* Owl icon */}
          <div className="shrink-0 text-5xl select-none leading-none">🦉</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" fill="white" className="w-3.5 h-3.5"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              </span>
              <span className="text-amber-600 font-bold text-sm">Gợi ý :</span>
            </div>
            <p className="text-gray-700 text-base">
              Hãy đọc kỹ câu hỏi và điền số thích hợp vào ô trống.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── NEW: TableFill (TableInteraction) ───────────────────────────────────────
// optionsJson encodes table: first item key='headers' text='Col1|Col2|Col3'
//   remaining items: key='rN' text='val1|_key1|_key2' (underscore prefix = blank cell, rest = static)
// correctAnswerJson: { key1: 'answer', key2: 'answer' }

function TableFill({ options, answers, checked, correctMap, onChange }: {
  options: OptionItem[];
  answers: Record<string, string>;
  checked: boolean;
  correctMap: Record<string, string>;
  onChange: (key: string, val: string) => void;
}) {
  const headerRow = options.find((o) => o.key === 'headers');
  const headers = headerRow ? headerRow.text.split('|') : [];
  const rows = options.filter((o) => o.key !== 'headers');

  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-sm w-full">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="border-2 border-gray-300 px-3 py-2 bg-amber-50 text-gray-700 font-bold text-center">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const cells = row.text.split('|');
            return (
              <tr key={row.key}>
                {cells.map((cell, ci) => {
                  if (cell.startsWith('_')) {
                    const cellKey = cell.slice(1);
                    const val = answers[cellKey] ?? '';
                    const correct = correctMap[cellKey];
                    const isOk = checked ? val.trim() === String(correct) : null;
                    return (
                      <td key={ci} className="border-2 border-gray-300 p-1 text-center">
                        <input type="text" inputMode="numeric" value={val}
                          onChange={(e) => onChange(cellKey, e.target.value)}
                          disabled={checked}
                          className={`w-12 h-9 text-center font-bold rounded-lg border-2 outline-none text-sm ${checked ? (isOk ? 'border-green-500 bg-green-50 text-green-700' : 'border-red-400 bg-red-50 text-red-700') : 'border-dashed border-amber-400 bg-amber-50 focus:border-amber-600'}`}
                        />
                        {checked && !isOk && <div className="text-xs text-green-600 mt-0.5">→ {correct}</div>}
                      </td>
                    );
                  }
                  return (
                    <td key={ci} className="border-2 border-gray-300 px-3 py-2 text-center font-semibold text-gray-800 bg-blue-50">{cell}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── NEW: NumberLine (NumberLineInteraction) ──────────────────────────────────
// optionsJson: [{ key:'min', text:'0' }, { key:'max', text:'20' }, { key:'step', text:'1' }]
//   optional: { key:'marks', text:'0|5|10|15|20' } for custom marks
//   optional: { key:'hidden', text:'7|12' } for values to mark/find
// correctAnswerJson: '7' or ['7','12']

function NumberLine({ options, selected, checked, correctAnswers, onSelect }: {
  options: OptionItem[];
  selected: string[];
  checked: boolean;
  correctAnswers: string[];
  onSelect: (val: string) => void;
}) {
  const minVal = Number(options.find((o) => o.key === 'min')?.text ?? 0);
  const maxVal = Number(options.find((o) => o.key === 'max')?.text ?? 10);
  const step = Number(options.find((o) => o.key === 'step')?.text ?? 1);
  const marksOpt = options.find((o) => o.key === 'marks');
  const hiddenOpt = options.find((o) => o.key === 'hidden');

  const allNums: number[] = [];
  for (let i = minVal; i <= maxVal; i += step) allNums.push(i);

  const marks = marksOpt ? marksOpt.text.split('|').map(Number) : allNums;
  const hiddenNums = hiddenOpt ? hiddenOpt.text.split('|').map(Number) : [];

  const needsClick = correctAnswers.length > 0;

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-400">
        {needsClick ? `Bấm vào số còn thiếu trên tia số (cần chọn ${correctAnswers.length} số)` : 'Quan sát tia số'}
      </p>
      {/* Number line SVG */}
      <div className="relative py-8 px-4">
        <div className="relative h-1 bg-gray-300 rounded-full mx-2">
          {/* Arrow at end */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2">
            <div className="w-0 h-0 border-l-[8px] border-l-gray-400 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent" />
          </div>
          {/* Tick marks and numbers */}
          {allNums.map((num, idx) => {
            const pct = ((num - minVal) / (maxVal - minVal)) * 100;
            const isHidden = hiddenNums.includes(num);
            const isSel = selected.includes(String(num));
            const isCorrect = checked && correctAnswers.includes(String(num)) && (isSel || !isHidden);
            const isWrong = checked && isSel && !correctAnswers.includes(String(num));
            const showLabel = marks.includes(num);

            return (
              <div key={idx} className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
                style={{ left: `${pct}%`, transform: `translateX(-50%) translateY(-50%)` }}>
                {/* Tick */}
                <div className="w-0.5 h-3 bg-gray-400 mb-1" />
                {/* Number or blank */}
                {isHidden ? (
                  <button
                    onClick={() => !checked && onSelect(String(num))}
                    disabled={checked}
                    className={`w-8 h-8 rounded-full border-2 text-xs font-bold mt-1 transition-all ${
                      isCorrect ? 'border-green-500 bg-green-100 text-green-700' :
                      isWrong ? 'border-red-400 bg-red-50 text-red-600' :
                      isSel ? 'border-amber-500 bg-amber-100 text-amber-700' :
                      'border-dashed border-gray-400 bg-white text-gray-400 hover:border-amber-400'
                    }`}
                  >
                    {isSel || checked ? (isHidden && checked && !isSel ? String(num) : isSel ? String(num) : '?') : '?'}
                  </button>
                ) : showLabel ? (
                  <span className="text-xs font-bold text-gray-700 mt-1">{num}</span>
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1" />
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* Answer tokens if needed */}
      {needsClick && !checked && (
        <div className="flex flex-wrap gap-2 pt-2">
          <span className="text-xs text-gray-500 self-center">Số đã chọn:</span>
          {selected.length > 0
            ? selected.map((s) => (
                <span key={s} onClick={() => onSelect(s)}
                  className="px-3 py-1 rounded-full bg-amber-100 border border-amber-400 text-amber-700 text-sm font-bold cursor-pointer hover:bg-amber-200">
                  {s} ✕
                </span>
              ))
            : <span className="text-xs text-gray-400 italic">Chưa chọn số nào</span>
          }
        </div>
      )}
      {checked && (
        <div className="text-xs text-gray-500">Đáp án đúng: <strong className="text-green-600">{correctAnswers.join(', ')}</strong></div>
      )}
    </div>
  );
}

// ─── NEW: Sorting (SortingInteraction) ────────────────────────────────────────
// Same data format as drag_drop but uses tap-buttons for mobile-friendly sorting

function Sorting({ options, order, checked, correctOrder, onReorder }: {
  options: OptionItem[]; order: string[]; checked: boolean; correctOrder: string[]; onReorder: (newOrder: string[]) => void;
}) {
  const move = (idx: number, dir: -1 | 1) => {
    const newOrder = [...order];
    const target = idx + dir;
    if (target < 0 || target >= newOrder.length) return;
    [newOrder[idx], newOrder[target]] = [newOrder[target], newOrder[idx]];
    onReorder(newOrder);
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-400 mb-1">Nhấn ▲▼ để sắp xếp thứ tự đúng</p>
      {order.map((key, idx) => {
        const opt = options.find((o) => o.key === key);
        const isRight = checked && correctOrder[idx] === key;
        const isWrong = checked && correctOrder[idx] !== key;
        const badgeColor = OPTION_COLORS[idx % OPTION_COLORS.length];
        const text = opt?.text ?? key;
        const isMath = isMathText(text);
        return (
          <div key={key} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 18px', borderRadius: 16,
            borderWidth: 2, borderStyle: 'solid',
            borderColor: isRight ? '#22c55e' : isWrong ? '#ef4444' : '#e5e7eb',
            background: isRight ? '#f0fdf4' : isWrong ? '#fef2f2' : '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            transition: 'all 0.15s',
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
              background: `${badgeColor}22`, border: `2px solid ${badgeColor}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 900, color: badgeColor,
            }}>{idx + 1}</div>
            <span style={{
              flex: 1,
              fontSize: isMath ? 28 : 18,
              fontWeight: 700,
              color: isRight ? '#15803d' : isWrong ? '#b91c1c' : '#1e293b',
            }}>{formatMath(text)}</span>
            {!checked && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
                <button onClick={() => move(idx, -1)} disabled={idx === 0}
                  style={{ width: 36, height: 30, borderRadius: 8, background: idx === 0 ? '#f3f4f6' : '#e5e7eb', border: 'none', cursor: idx === 0 ? 'not-allowed' : 'pointer', opacity: idx === 0 ? 0.3 : 1, fontWeight: 700, fontSize: 13, color: '#374151' }}>▲</button>
                <button onClick={() => move(idx, 1)} disabled={idx === order.length - 1}
                  style={{ width: 36, height: 30, borderRadius: 8, background: idx === order.length - 1 ? '#f3f4f6' : '#e5e7eb', border: 'none', cursor: idx === order.length - 1 ? 'not-allowed' : 'pointer', opacity: idx === order.length - 1 ? 0.3 : 1, fontWeight: 700, fontSize: 13, color: '#374151' }}>▼</button>
              </div>
            )}
            {isRight && <span style={{ color: '#22c55e', fontWeight: 900, fontSize: 18, flexShrink: 0 }}>✓</span>}
            {isWrong && <span style={{ fontSize: 12, color: '#ef4444', flexShrink: 0 }}>→ {options.find((o) => o.key === correctOrder[idx])?.text}</span>}
          </div>
        );
      })}
    </div>
  );
}

// ─── NEW: CrossOut (CrossOutInteraction) ─────────────────────────────────────
// optionsJson: items list
// correctAnswerJson: string[] — keys that should be crossed out (the wrong ones)

function CrossOut({ options, selected, checked, correctKeys, onToggle }: {
  options: OptionItem[]; selected: string[]; checked: boolean; correctKeys: string[]; onToggle: (key: string) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-400">Bấm để gạch bỏ những đáp án sai</p>
      <div className={`grid gap-4 ${options.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'}`}>
        {options.map((opt, idx) => {
          const isCrossed = selected.includes(opt.key);
          const shouldBeCrossed = correctKeys.includes(opt.key);
          const isCorrect = checked && isCrossed === shouldBeCrossed;
          const isWrong = checked && isCrossed !== shouldBeCrossed;
          const col = OPTION_COLORS[idx % OPTION_COLORS.length];
          const isMath = isMathText(opt.text);
          return (
            <button key={opt.key} onClick={() => !checked && onToggle(opt.key)}
              style={{
                borderWidth: 3, borderStyle: 'solid',
                borderColor: isCorrect && isCrossed ? '#22c55e' : isCorrect ? '#22c55e' : isWrong ? '#ef4444' : isCrossed ? '#9ca3af' : '#f0b429',
                borderRadius: 16,
                background: isCorrect && isCrossed ? '#f0fdf4' : isCorrect ? '#f0fdf4' : isWrong ? '#fef2f2' : isCrossed ? '#f3f4f6' : '#ffffff',
                minHeight: 110,
                cursor: checked ? 'default' : 'pointer',
                position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
                boxShadow: !isCrossed && !checked ? '0 1px 4px rgba(0,0,0,0.06)' : undefined,
              }}
            >
              <span style={{
                fontSize: isMath ? 36 : 18,
                fontWeight: 900,
                color: isCrossed ? '#9ca3af' : isCorrect ? '#15803d' : isWrong ? '#b91c1c' : col,
                textDecorationLine: isCrossed ? 'line-through' : 'none',
                textDecorationColor: '#9ca3af',
                textDecorationThickness: '3px',
                textShadow: !isCrossed && !checked ? `1px 2px 0 ${col}44` : undefined,
                opacity: isCrossed ? 0.5 : 1,
              }}>{formatMath(opt.text)}</span>
              {/* Cross lines when crossed */}
              {isCrossed && !checked && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden rounded-2xl">
                  <div style={{ position: 'absolute', width: '110%', height: 3, background: '#ef4444', opacity: 0.6, transform: 'rotate(8deg)' }} />
                  <div style={{ position: 'absolute', width: '110%', height: 3, background: '#ef4444', opacity: 0.6, transform: 'rotate(-8deg)' }} />
                </div>
              )}
              {isCorrect && <span style={{ position: 'absolute', top: 8, right: 10, color: '#22c55e', fontWeight: 900, fontSize: 16 }}>✓</span>}
              {isWrong && <span style={{ position: 'absolute', top: 8, right: 10, color: '#ef4444', fontWeight: 900, fontSize: 16 }}>✗</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── NEW: Coloring (ColoringInteraction) ─────────────────────────────────────
// optionsJson: shapes — { key: 's1', text: 'hình tròn' }
// correctAnswerJson: { s1: 'red', s2: 'blue', s3: 'yellow' }
// A color palette is shown; tap shape to select it, tap color to paint it

const COLORING_PALETTE = [
  { id: 'red', hex: '#ef4444', label: 'Đỏ' },
  { id: 'blue', hex: '#3b82f6', label: 'Xanh dương' },
  { id: 'yellow', hex: '#eab308', label: 'Vàng' },
  { id: 'green', hex: '#22c55e', label: 'Xanh lá' },
  { id: 'orange', hex: '#f97316', label: 'Cam' },
  { id: 'purple', hex: '#a855f7', label: 'Tím' },
  { id: 'pink', hex: '#ec4899', label: 'Hồng' },
  { id: 'brown', hex: '#92400e', label: 'Nâu' },
];

const SHAPE_ICONS: Record<string, (color: string) => React.ReactNode> = {
  circle: (c) => <svg viewBox="0 0 40 40" className="w-10 h-10"><circle cx="20" cy="20" r="17" fill={c} stroke="#374151" strokeWidth="1.5"/></svg>,
  square: (c) => <svg viewBox="0 0 40 40" className="w-10 h-10"><rect x="4" y="4" width="32" height="32" rx="3" fill={c} stroke="#374151" strokeWidth="1.5"/></svg>,
  triangle: (c) => <svg viewBox="0 0 40 40" className="w-10 h-10"><polygon points="20,3 37,36 3,36" fill={c} stroke="#374151" strokeWidth="1.5"/></svg>,
  star: (c) => <svg viewBox="0 0 40 40" className="w-10 h-10"><polygon points="20,3 24,14 36,14 26,21 30,33 20,26 10,33 14,21 4,14 16,14" fill={c} stroke="#374151" strokeWidth="1"/></svg>,
  heart: (c) => <svg viewBox="0 0 40 40" className="w-10 h-10"><path d="M20 34 C20 34 4 24 4 14 C4 8 9 4 14 6 C17 7 19 9 20 11 C21 9 23 7 26 6 C31 4 36 8 36 14 C36 24 20 34 20 34Z" fill={c} stroke="#374151" strokeWidth="1"/></svg>,
  diamond: (c) => <svg viewBox="0 0 40 40" className="w-10 h-10"><polygon points="20,2 38,20 20,38 2,20" fill={c} stroke="#374151" strokeWidth="1.5"/></svg>,
};

function getShapeRenderer(text: string, color: string): React.ReactNode {
  const t = text.toLowerCase();
  if (t.includes('tròn') || t.includes('circle')) return SHAPE_ICONS.circle(color);
  if (t.includes('vuông') || t.includes('square')) return SHAPE_ICONS.square(color);
  if (t.includes('tam giác') || t.includes('triangle')) return SHAPE_ICONS.triangle(color);
  if (t.includes('ngôi sao') || t.includes('star')) return SHAPE_ICONS.star(color);
  if (t.includes('trái tim') || t.includes('heart')) return SHAPE_ICONS.heart(color);
  if (t.includes('thoi') || t.includes('diamond')) return SHAPE_ICONS.diamond(color);
  return SHAPE_ICONS.circle(color);
}

function Coloring({ options, colorMap, checked, correctMap, onChange }: {
  options: OptionItem[];
  colorMap: Record<string, string>;
  checked: boolean;
  correctMap: Record<string, string>;
  onChange: (map: Record<string, string>) => void;
}) {
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [activePaint, setActivePaint] = useState<string>('red');

  const applyColor = (shapeKey: string, colorId: string) => {
    onChange({ ...colorMap, [shapeKey]: colorId });
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-400">Chọn hình, sau đó chọn màu để tô</p>

      {/* Shapes grid */}
      <div className={`grid gap-4 ${options.length <= 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
        {options.map((opt) => {
          const colorId = colorMap[opt.key] ?? 'white';
          const hexColor = COLORING_PALETTE.find((c) => c.id === colorId)?.hex ?? '#ffffff';
          const correctColor = correctMap[opt.key];
          const isCorrect = checked && colorId === correctColor;
          const isWrong = checked && colorId !== correctColor && colorId !== 'white';
          const isSelected = selectedShape === opt.key;
          return (
            <div key={opt.key} className="flex flex-col items-center gap-1">
              <button
                onClick={() => {
                  if (checked) return;
                  applyColor(opt.key, activePaint);
                }}
                className={`w-16 h-16 rounded-2xl border-3 flex items-center justify-center transition-all ${
                  isCorrect ? 'border-green-500 shadow-lg shadow-green-200' :
                  isWrong ? 'border-red-400 shadow-lg shadow-red-100' :
                  isSelected ? 'border-amber-400 shadow-md scale-105' :
                  'border-gray-300 hover:border-amber-300 hover:scale-105'
                }`}
                style={{ border: `3px solid ${isSelected ? '#f59e0b' : '#d1d5db'}` }}
              >
                {getShapeRenderer(opt.text, hexColor)}
              </button>
              <span className="text-xs text-gray-600 text-center leading-tight">{formatMath(opt.text)}</span>
              {checked && !isCorrect && (
                <span className="text-xs text-green-600">→ {COLORING_PALETTE.find((c) => c.id === correctColor)?.label}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Color palette */}
      {!checked && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500 font-medium">Chọn màu để tô:</p>
          <div className="flex flex-wrap gap-2">
            {COLORING_PALETTE.map((c) => (
              <button key={c.id} onClick={() => setActivePaint(c.id)}
                className={`w-9 h-9 rounded-full border-3 transition-all hover:scale-110 ${activePaint === c.id ? 'border-gray-800 scale-110 shadow-md' : 'border-white shadow-sm'}`}
                style={{ backgroundColor: c.hex, border: `3px solid ${activePaint === c.id ? '#1f2937' : '#fff'}`, boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
                title={c.label}
              />
            ))}
          </div>
          <p className="text-xs text-amber-600">Màu đang chọn: <strong>{COLORING_PALETTE.find((c) => c.id === activePaint)?.label}</strong> — Bấm vào hình để tô</p>
        </div>
      )}
    </div>
  );
}

// ─── NEW: Puzzle (PuzzleInteraction) ─────────────────────────────────────────
// Drag number tokens into labeled slots to complete an equation/sequence
// optionsJson: [{ key:'slot_1', text:'_ + 3 = 8' }, { key:'token_5', text:'5' }, ...]
//   slots: key starts with 'slot_', text is the expression label
//   tokens: key starts with 'token_', text is the value
// correctAnswerJson: { slot_1: 'token_5', slot_2: 'token_2' }

function Puzzle({ options, answers, checked, correctMap, onChange }: {
  options: OptionItem[];
  answers: Record<string, string>;
  checked: boolean;
  correctMap: Record<string, string>;
  onChange: (map: Record<string, string>) => void;
}) {
  const slots = options.filter((o) => o.key.startsWith('slot_'));
  const tokens = options.filter((o) => o.key.startsWith('token_'));
  const usedTokens = new Set(Object.values(answers));
  const available = tokens.filter((t) => !usedTokens.has(t.key));
  const [selectedToken, setSelectedToken] = useState<string | null>(null);

  const placeToken = (slotKey: string) => {
    if (checked || !selectedToken) return;
    const newMap = { ...answers };
    // Remove token from any existing slot
    Object.keys(newMap).forEach((k) => { if (newMap[k] === selectedToken) delete newMap[k]; });
    // Remove existing token in this slot
    if (newMap[slotKey]) delete newMap[slotKey];
    newMap[slotKey] = selectedToken;
    onChange(newMap);
    setSelectedToken(null);
  };

  const removeFromSlot = (slotKey: string) => {
    if (checked) return;
    const newMap = { ...answers };
    delete newMap[slotKey];
    onChange(newMap);
  };

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-400">Kéo hoặc bấm chọn số rồi bấm vào ô trống để điền vào chỗ dấu ?</p>

      {/* Slots */}
      <div className="space-y-3 p-4 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50">
        {slots.map((slot) => {
          const placedKey = answers[slot.key];
          const placedToken = tokens.find((t) => t.key === placedKey);
          const placedIdx = placedToken ? tokens.indexOf(placedToken) : -1;
          const pCol = placedIdx >= 0 ? OPTION_COLORS[placedIdx % OPTION_COLORS.length] : '#6b7280';
          const correctKey2 = correctMap[slot.key];
          const correctToken = tokens.find((t) => t.key === correctKey2);
          const isCorrect = checked && placedKey === correctKey2;
          const isWrong = checked && !!placedKey && placedKey !== correctKey2;

          return (
            <div key={slot.key}
              onClick={() => !placedToken ? placeToken(slot.key) : removeFromSlot(slot.key)}
              style={{
                borderWidth: 2, borderStyle: isCorrect || isWrong || placedToken ? 'solid' : 'dashed',
                borderColor: isCorrect ? '#22c55e' : isWrong ? '#ef4444' : placedToken ? pCol : selectedToken ? '#f59e0b' : '#d1d5db',
                borderRadius: 16,
                background: isCorrect ? '#f0fdf4' : isWrong ? '#fef2f2' : placedToken ? `${pCol}12` : '#fff',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
              className="flex items-center gap-4 px-5 py-4"
            >
              {/* Slot placeholder box */}
              <div style={{
                width: 52, height: 52, borderRadius: 12, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 26, fontWeight: 900,
                borderWidth: 2, borderStyle: placedToken ? 'solid' : 'dashed',
                borderColor: isCorrect ? '#22c55e' : isWrong ? '#ef4444' : placedToken ? pCol : '#9ca3af',
                background: isCorrect ? '#dcfce7' : isWrong ? '#fee2e2' : placedToken ? `${pCol}22` : '#f3f4f6',
                color: isCorrect ? '#15803d' : isWrong ? '#b91c1c' : placedToken ? pCol : '#9ca3af',
                textShadow: placedToken && !isCorrect && !isWrong ? `1px 2px 0 ${pCol}44` : undefined,
              }}>
                {placedToken ? placedToken.text : '?'}
              </div>
              {/* Equation text */}
              <span className="text-xl font-bold text-gray-700 flex-1">{slot.text}</span>
              {isCorrect && <span className="text-green-500 font-black text-xl shrink-0">✓</span>}
              {isWrong && <span className="text-sm text-green-600 shrink-0">→ {correctToken?.text}</span>}
              {placedToken && !checked && <span className="text-xs text-gray-400 shrink-0">bấm để gỡ</span>}
            </div>
          );
        })}
      </div>

      {/* Token bank */}
      {!checked && (
        <div className="space-y-2">
          <p className="text-sm text-gray-500 font-semibold">Số chưa dùng:</p>
          <div className="flex flex-wrap gap-3">
            {available.map((t, idx) => {
              const col = OPTION_COLORS[idx % OPTION_COLORS.length];
              const isSel = selectedToken === t.key;
              return (
                <button key={t.key}
                  onClick={() => setSelectedToken(isSel ? null : t.key)}
                  style={{
                    width: 64, height: 64,
                    borderRadius: 14,
                    borderWidth: 3,
                    borderStyle: 'solid',
                    borderColor: isSel ? col : '#e5e7eb',
                    background: isSel ? `${col}15` : '#ffffff',
                    fontSize: 28,
                    fontWeight: 900,
                    color: col,
                    textShadow: !isSel ? `1px 2px 0 ${col}44` : undefined,
                    boxShadow: isSel ? `0 0 0 3px ${col}33` : '0 1px 3px rgba(0,0,0,0.08)',
                    transform: isSel ? 'scale(1.12)' : 'scale(1)',
                    transition: 'all 0.15s',
                    cursor: 'pointer',
                  }}>
                  {t.text}
                </button>
              );
            })}
            {available.length === 0 && <span className="text-sm text-gray-400 italic">Đã điền hết</span>}
          </div>
          {selectedToken && (
            <p className="text-sm text-amber-600 font-medium">Đã chọn <strong>{tokens.find((t) => t.key === selectedToken)?.text}</strong> — bấm vào ô ? để điền</p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── NEW: Game (GameInteraction) — Memory Card Match ─────────────────────────
// Flip cards to find matching pairs
// optionsJson: [{ key:'c1', text:'3', pair:'three' }, { key:'c2', text:'1+2', pair:'three' }, ...]
//   cards with same `pair` value are a match
// correctAnswerJson: {} (empty — just completing the game is success)

function Game({ options, checked, onComplete }: {
  options: OptionItem[];
  checked: boolean;
  onComplete: () => void;
}) {
  const [cards] = useState<OptionItem[]>(() => {
    const arr = [...options];
    for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
    return arr;
  });

  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [lastFlipped, setLastFlipped] = useState<number | null>(null);
  const [canFlip, setCanFlip] = useState(true);

  const handleFlip = (idx: number) => {
    if (!canFlip || flipped.has(idx) || matched.has(cards[idx].pair ?? cards[idx].key)) return;

    const newFlipped = new Set(flipped);
    newFlipped.add(idx);
    setFlipped(newFlipped);

    if (lastFlipped === null) {
      setLastFlipped(idx);
    } else {
      const a = cards[lastFlipped];
      const b = cards[idx];
      setCanFlip(false);
      setTimeout(() => {
        if ((a.pair && a.pair === b.pair) || a.key === b.pair || a.pair === b.key) {
          const pairId = a.pair ?? a.key;
          setMatched((prev) => {
            const next = new Set([...prev, pairId]);
            if (next.size >= totalPairs) setTimeout(() => onComplete(), 300);
            return next;
          });
        } else {
          setFlipped((prev) => {
            const s = new Set(prev);
            s.delete(lastFlipped);
            s.delete(idx);
            return s;
          });
        }
        setLastFlipped(null);
        setCanFlip(true);
      }, 900);
    }
  };

  const totalPairs = new Set(options.map((o) => o.pair ?? o.key)).size;
  const isComplete = matched.size >= totalPairs;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <p className="text-sm text-gray-500 font-medium">Lật thẻ tìm cặp giống nhau</p>
        <span className="text-sm font-black text-amber-600">{matched.size}/{totalPairs} cặp</span>
      </div>
      <div className={`grid gap-3 ${options.length <= 6 ? 'grid-cols-3' : 'grid-cols-4'}`}>
        {cards.map((card, idx) => {
          const pairId = card.pair ?? card.key;
          const isMatched = matched.has(pairId);
          const isFlipped = flipped.has(idx) || isMatched;
          return (
            <button key={idx} onClick={() => !isMatched && !checked && handleFlip(idx)}
              style={{
                aspectRatio: '1',
                borderRadius: 20,
                border: isMatched ? '3px solid #22c55e' : isFlipped ? '3px solid #f59e0b' : '3px solid #e5e7eb',
                background: isMatched
                  ? 'linear-gradient(135deg,#dcfce7,#bbf7d0)'
                  : isFlipped
                  ? '#fff'
                  : 'linear-gradient(135deg,#fbbf24,#f97316)',
                boxShadow: isMatched ? '0 2px 8px rgba(34,197,94,0.25)' : isFlipped ? '0 2px 8px rgba(251,191,36,0.3)' : '0 4px 12px rgba(249,115,22,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.25s',
                cursor: isMatched ? 'default' : 'pointer',
                transform: isFlipped ? 'scale(1)' : 'scale(1)',
                minHeight: 90,
              }}
            >
              {isFlipped ? (
                <span style={{
                  fontSize: isMathText(card.text) ? 40 : 18,
                  fontWeight: 900,
                  color: isMatched ? '#15803d' : '#1e293b',
                  textAlign: 'center',
                  lineHeight: 1.1,
                  padding: '0 6px',
                  textShadow: isMatched ? 'none' : undefined,
                }}>{formatMath(card.text)}</span>
              ) : (
                <span style={{ fontSize: 32 }}>🌟</span>
              )}
            </button>
          );
        })}
      </div>
      {isComplete && (
        <div className="text-center py-3 rounded-2xl" style={{ background: 'linear-gradient(135deg,#dcfce7,#bbf7d0)', border: '2px solid #86efac' }}>
          <p className="text-green-700 font-black text-lg">🎉 Ghép xong tất cả {totalPairs} cặp!</p>
        </div>
      )}
    </div>
  );
}

// ─── NEW: Counting (CountingInteraction) ─────────────────────────────────────
// Hiển thị icon con vật/đồ vật, trẻ bấm từng con để tô sáng rồi điền số đếm
// optionsJson: [{ key:'duck', text:'🦆', pair:'3' }]  ← pair = số lượng hiển thị
//   mỗi item = 1 loại, pair = số lượng icon cần render
// correctAnswerJson: '5' hoặc { duck:'3', cat:'2' } nếu nhiều loại

function Counting({ options, answers, checked, correctMap, correctKey, onChange }: {
  options: OptionItem[];
  answers: Record<string, string>;
  checked: boolean;
  correctMap: Record<string, string>;
  correctKey: string | null;
  onChange: (key: string, val: string) => void;
}) {
  // Single-group mode: all options are individual icons, just count total
  const isMultiGroup = options.some((o) => o.pair && !isNaN(Number(o.pair)));

  if (isMultiGroup) {
    // Each option = a group of animals: key=id, text=emoji, pair=count
    return (
      <div className="space-y-5">
        <p className="text-xs text-gray-400">Đếm từng nhóm rồi điền số vào ô</p>
        {options.map((group) => {
          const count = Number(group.pair ?? 1);
          const val = answers[group.key] ?? '';
          const correct = correctMap[group.key];
          const isOk = checked ? val.trim() === String(correct) : null;
          return (
            <div key={group.key} className="flex items-center gap-4 p-3 rounded-2xl bg-amber-50 border border-amber-200">
              <div className="flex flex-wrap gap-1 flex-1">
                {Array.from({ length: count }).map((_, i) => (
                  <span key={i} className="text-3xl select-none">{group.text}</span>
                ))}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-sm text-gray-500">Có</span>
                <input type="text" inputMode="numeric" value={val}
                  onChange={(e) => onChange(group.key, e.target.value)}
                  disabled={checked}
                  className={`w-12 h-12 text-center font-black text-xl rounded-xl border-2 outline-none transition-all ${
                    checked ? (isOk ? 'border-green-500 bg-green-50 text-green-700' : 'border-red-400 bg-red-50 text-red-700')
                    : 'border-dashed border-amber-400 bg-white focus:border-amber-600'
                  }`}
                />
                <span className="text-sm text-gray-500">con</span>
                {checked && !isOk && <span className="text-xs text-green-600 font-bold">→ {correct}</span>}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Single-group mode: tap each icon to count, then enter total
  const [tapped, setTapped] = useState<Set<number>>(new Set());
  const totalIcons = options.length;
  const inputVal = answers['total'] ?? '';
  const isOk = checked ? inputVal.trim() === String(correctKey) : null;

  const toggleTap = (idx: number) => {
    if (checked) return;
    setTapped((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      // auto-fill count from tapped
      onChange('total', String(next.size));
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-400">Bấm vào từng con để đếm, rồi điền tổng số vào ô</p>
      <div className="flex flex-wrap gap-3 p-4 rounded-2xl bg-blue-50 border border-blue-200 min-h-[80px]">
        {options.map((opt, idx) => {
          const isTapped = tapped.has(idx);
          return (
            <button key={idx} onClick={() => toggleTap(idx)}
              className={`text-4xl select-none transition-all hover:scale-110 ${isTapped ? 'opacity-30 scale-90' : 'opacity-100'}`}
              title={isTapped ? 'Bỏ chọn' : 'Bấm để đếm'}
            >
              {opt.text}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-base font-semibold text-gray-700">Có tất cả</span>
        <input type="text" inputMode="numeric" value={inputVal}
          onChange={(e) => onChange('total', e.target.value)}
          disabled={checked}
          className={`w-14 h-14 text-center font-black text-2xl rounded-xl border-2 outline-none transition-all ${
            checked ? (isOk ? 'border-green-500 bg-green-50 text-green-700' : 'border-red-400 bg-red-50 text-red-700')
            : 'border-dashed border-amber-400 bg-white focus:border-amber-600'
          }`}
        />
        <span className="text-base font-semibold text-gray-700">con</span>
        {!checked && tapped.size > 0 && (
          <span className="text-xs text-amber-600 italic">Đã đếm: {tapped.size}</span>
        )}
        {checked && !isOk && <span className="text-sm text-green-600 font-bold">→ Đáp án: {correctKey}</span>}
      </div>
    </div>
  );
}

// ─── TTS ─────────────────────────────────────────────────────────────────────

const VI_NUMBERS: Record<number, string> = {
  0:'không',1:'một',2:'hai',3:'ba',4:'bốn',5:'năm',
  6:'sáu',7:'bảy',8:'tám',9:'chín',10:'mười',
  11:'mười một',12:'mười hai',13:'mười ba',14:'mười bốn',15:'mười lăm',
  16:'mười sáu',17:'mười bảy',18:'mười tám',19:'mười chín',20:'hai mươi',
};

function numToVi(n: number): string {
  if (VI_NUMBERS[n] !== undefined) return VI_NUMBERS[n];
  if (n < 100) {
    const tens = Math.floor(n / 10);
    const ones = n % 10;
    const tensWord = ['','','hai','ba','bốn','năm','sáu','bảy','tám','chín'][tens];
    const onesWord = ones === 0 ? '' : ones === 5 ? ' lăm' : ones === 1 ? ' mốt' : ' ' + VI_NUMBERS[ones];
    return `${tensWord} mươi${onesWord}`;
  }
  return String(n);
}

function preprocessTTS(text: string): string {
  return text
    .replace(/[\u{1F000}-\u{1FFFF}|\u{2600}-\u{27BF}|\u{1F300}-\u{1F9FF}|\u{FE00}-\u{FE0F}|\u{200D}]/gu, '')
    .replace(/\[b\d+\]/g, 'mấy')
    .replace(/_{2,}/g, 'mấy')
    .replace(/_/g, 'mấy')
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
    .replace(/\d+/g, (m) => numToVi(parseInt(m)))
    .replace(/\s{2,}/g, ' ')
    .trim();
}

let _ttsAudio: HTMLAudioElement | null = null;

function speak(text: string) {
  const cleaned = preprocessTTS(text);
  if (!cleaned) return;
  if (_ttsAudio) { _ttsAudio.pause(); _ttsAudio = null; }
  const url = `/api/tts?q=${encodeURIComponent(cleaned)}`;
  const audio = new Audio(url);
  _ttsAudio = audio;
  audio.play().catch(() => speakWebSpeech(cleaned));
}

function speakWebSpeech(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'vi-VN'; u.rate = 0.85; u.pitch = 1.0;
  const VI_PRIORITY = ['Google tiếng Việt', 'Google Vietnamese', 'vi-VN-Neural2', 'vi-VN-Wavenet', 'Microsoft An Online'];
  const go = () => {
    const vi = window.speechSynthesis.getVoices().filter((v) => v.lang.startsWith('vi'));
    if (vi.length) {
      const match = VI_PRIORITY.map((n) => vi.find((v) => v.name.includes(n))).find(Boolean);
      u.voice = match ?? vi.find((v) => !v.localService) ?? vi[0];
    }
    window.speechSynthesis.speak(u);
  };
  if (window.speechSynthesis.getVoices().length > 0) go();
  else { window.speechSynthesis.onvoiceschanged = () => { window.speechSynthesis.onvoiceschanged = null; go(); }; }
}

const ENCOURAGE_CORRECT = ['Xuất sắc!', 'Tuyệt vời!', 'Giỏi lắm!', 'Chính xác!', 'Bạn thật thông minh!'];
const ENCOURAGE_WRONG = ['Ồ, cố gắng lên!', 'Thử lại nhé!', 'Gần đúng rồi!', 'Đừng nản lòng nhé!'];

// ─── Main component ───────────────────────────────────────────────────────────

type AllExercisesData = {
  total: number;
  exercises: { exerciseNumber: number; difficultyLevel: string; label: string }[];
};

export default function QuizPlayPage({
  lessonId: lessonIdProp,
  lessonSlug: lessonSlugProp,
  exerciseNumber: exerciseNumberProp,
  difficulty: difficultyProp,
}: {
  lessonId?: string;
  lessonSlug?: string;
  exerciseNumber?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const exFromQuery = searchParams ? Number(searchParams.get('ex') || '0') : 0;
  const [exerciseNumber, setExerciseNumber] = useState<number>(
    exerciseNumberProp ?? (exFromQuery > 0 ? exFromQuery : 1),
  );
  const [resolvedLessonId, setResolvedLessonId] = useState<string>(lessonIdProp ?? '');

  const [exercise, setExercise] = useState<ExerciseData | null>(null);
  const [allExercises, setAllExercises] = useState<AllExercisesData['exercises']>([]);
  const [lesson, setLesson] = useState<LessonMeta | null>(null);
  const [loading, setLoading] = useState(true);

  const [current, setCurrent] = useState(0);
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [score, setScore] = useState(0);
  const [soundOn, setSoundOn] = useState(true);

  // ─── Answer state for all types ───────────────────────────────────────────
  const [singleSel, setSingleSel] = useState<Record<number, string>>({});
  const [multiSel, setMultiSel] = useState<Record<number, string[]>>({});
  const [tfSel, setTfSel] = useState<Record<number, string>>({});
  const [dragOrder, setDragOrder] = useState<Record<number, string[]>>({});
  const [matchMap, setMatchMap] = useState<Record<number, Record<string, string>>>({});
  const [fillBlankAns, setFillBlankAns] = useState<Record<number, Record<string, string>>>({});
  const [tableFillAns, setTableFillAns] = useState<Record<number, Record<string, string>>>({});
  const [numberLineSel, setNumberLineSel] = useState<Record<number, string[]>>({});
  const [crossOutSel, setCrossOutSel] = useState<Record<number, string[]>>({});
  const [coloringMap, setColoringMap] = useState<Record<number, Record<string, string>>>({});
  const [puzzleAns, setPuzzleAns] = useState<Record<number, Record<string, string>>>({});
  const [gameComplete, setGameComplete] = useState<Record<number, boolean>>({});
  const [countingAns, setCountingAns] = useState<Record<number, Record<string, string>>>({});

  const [shuffledOpts, setShuffledOpts] = useState<Record<number, OptionItem[]>>({});
  const [celebrate, setCelebrate] = useState<'correct' | 'wrong' | null>(null);
  const [celebrateMsg, setCelebrateMsg] = useState('');
  const [activeBlankKey, setActiveBlankKey] = useState<{ qid: number; bkey: string } | null>(null);

  const correctAudio = useRef<HTMLAudioElement | null>(null);
  const wrongAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!exercise || !soundOn) return;
    const qz = exercise.quizzes[current];
    if (qz?.questionAudioUrl) {
      const a = new Audio(qz.questionAudioUrl);
      a.play().catch(() => {});
      return () => { a.pause(); };
    } else if (qz?.questionText) {
      speak(qz.questionText);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, exercise?.exerciseNumber, soundOn]);

  // Auto-activate first blank when switching to a fill_blank question
  useEffect(() => {
    if (!exercise) return;
    const qz = exercise.quizzes[current];
    if (!qz || qz.questionType !== 'fill_blank') return;
    const blanks = Array.isArray(qz.optionsJson) ? qz.optionsJson as { key: string }[] : [];
    const match = qz.questionText.match(/\[(\w+)\]/);
    const key = match?.[1] ?? blanks[0]?.key;
    if (key) setActiveBlankKey({ qid: qz.id, bkey: key });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, exercise?.exerciseNumber]);

  useEffect(() => {
    setLoading(true);
    setCurrent(0);
    setChecked({});
    setScore(0);
    setShuffledOpts({});

    const fetchLesson = lessonIdProp
      ? apiFetch<LessonMeta>(`/lessons/${lessonIdProp}`)
      : apiFetch<LessonMeta>(`/lessons/slug/${lessonSlugProp}`);

    fetchLesson
      .then((lessonData) => {
        const lid = String(lessonData.id);
        setResolvedLessonId(lid);
        setLesson(lessonData);
        return Promise.all([
          apiFetch<ExerciseData>(`/quizzes/exercises/${lid}/${exerciseNumber}`),
          apiFetch<AllExercisesData>(`/quizzes/exercises/${lid}`),
        ]);
      })
      .then(([exData, allData]) => {
        setExercise(exData);
        setAllExercises(allData.exercises);
        const initDrag: Record<number, string[]> = {};
        const initShuffle: Record<number, OptionItem[]> = {};
        exData.quizzes.forEach((q) => {
          if ((q.questionType === 'drag_drop' || q.questionType === 'sorting') && Array.isArray(q.optionsJson)) {
            initDrag[q.id] = q.optionsJson.map((o) => o.key);
          }
          if (['single_choice', 'multiple_choice', 'image_choice', 'cross_out'].includes(q.questionType) && Array.isArray(q.optionsJson)) {
            const arr = [...q.optionsJson];
            for (let i = arr.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            initShuffle[q.id] = arr;
          }
        });
        setShuffledOpts(initShuffle);
        setDragOrder(initDrag);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [lessonIdProp, lessonSlugProp, exerciseNumber]);

  const navigateToExercise = (num: number) => {
    const target = allExercises.find((e) => e.exerciseNumber === num);
    if (!target) return;
    if (lesson?.slug) {
      router.push(
        buildExerciseUrl(lesson.slug, resolvedLessonId, target.difficultyLevel as 'easy' | 'medium' | 'hard') + `?ex=${num}`,
      );
    } else {
      setExerciseNumber(num);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #2d5a1b 0%, #4a8c2a 50%, #3d7a22 100%)' }}>
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-amber-400 border-t-transparent" />
      </div>
    );
  }

  if (!exercise || exercise.quizzes.length === 0) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4"
        style={{ background: 'linear-gradient(135deg, #2d5a1b 0%, #4a8c2a 50%, #3d7a22 100%)' }}>
        <p className="text-white text-xl font-bold">Không có câu hỏi</p>
        <Link href={lesson?.slug ? `/${lesson.slug}` : `/lessons/${resolvedLessonId}`}
          className="rounded-full bg-amber-400 px-6 py-2 font-bold text-white">
          ← Quay lại
        </Link>
      </div>
    );
  }

  const q = exercise.quizzes[current];
  const options: OptionItem[] = shuffledOpts[q.id] ?? (Array.isArray(q.optionsJson) ? q.optionsJson : []);
  const isChecked = !!checked[q.id];
  const diffColor = DIFF_COLOR[exercise.difficultyLevel] || '#E8871A';
  const totalPoints = exercise.quizzes.reduce((s, qz) => s + (qz.points || 10), 0);

  const correctKey = typeof q.correctAnswerJson === 'string' ? q.correctAnswerJson : null;
  const correctKeys = Array.isArray(q.correctAnswerJson) ? (q.correctAnswerJson as string[]) : [];
  const correctBool = typeof q.correctAnswerJson === 'boolean' ? q.correctAnswerJson : null;
  const correctDragOrder = Array.isArray(q.correctAnswerJson) ? (q.correctAnswerJson as string[]) : [];
  const correctMatchMap = (typeof q.correctAnswerJson === 'object' && q.correctAnswerJson !== null && !Array.isArray(q.correctAnswerJson))
    ? q.correctAnswerJson as Record<string, string> : {};

  // ─── isAnswerCorrect ───────────────────────────────────────────────────────

  const isAnswerCorrect = () => {
    switch (q.questionType) {
      case 'single_choice':
      case 'image_choice':
        return singleSel[q.id] === correctKey;
      case 'multiple_choice': {
        const sel = multiSel[q.id] ?? [];
        return new Set(sel).size === new Set(correctKeys).size && correctKeys.every((k) => sel.includes(k));
      }
      case 'true_false':
        return (tfSel[q.id] === 'true') === correctBool;
      case 'drag_drop':
      case 'sorting':
        return JSON.stringify(dragOrder[q.id] ?? []) === JSON.stringify(correctDragOrder);
      case 'matching':
        return options.every((o) => (matchMap[q.id] ?? {})[o.key] === correctMatchMap[o.key]);
      case 'fill_blank': {
        const ans = fillBlankAns[q.id] ?? {};
        return Object.entries(correctMatchMap).every(([k, v]) => ans[k]?.trim() === String(v));
      }
      case 'table_fill': {
        const ans = tableFillAns[q.id] ?? {};
        return Object.entries(correctMatchMap).every(([k, v]) => ans[k]?.trim() === String(v));
      }
      case 'number_line': {
        const sel = numberLineSel[q.id] ?? [];
        const expected = Array.isArray(q.correctAnswerJson) ? correctKeys : (correctKey ? [correctKey] : []);
        return new Set(sel).size === new Set(expected).size && expected.every((v) => sel.includes(v));
      }
      case 'cross_out': {
        const sel = crossOutSel[q.id] ?? [];
        return new Set(sel).size === new Set(correctKeys).size && correctKeys.every((k) => sel.includes(k));
      }
      case 'coloring': {
        const map = coloringMap[q.id] ?? {};
        return Object.entries(correctMatchMap).every(([k, v]) => map[k] === v);
      }
      case 'puzzle': {
        const ans = puzzleAns[q.id] ?? {};
        return Object.entries(correctMatchMap).every(([k, v]) => ans[k] === v);
      }
      case 'game':
        return gameComplete[q.id] ?? false;
      case 'counting': {
        const ans = countingAns[q.id] ?? {};
        if (correctKey !== null) return ans['total']?.trim() === correctKey;
        return Object.entries(correctMatchMap).every(([k, v]) => ans[k]?.trim() === String(v));
      }
      default:
        return false;
    }
  };

  // ─── hasAnswer ────────────────────────────────────────────────────────────

  const hasAnswer = () => {
    switch (q.questionType) {
      case 'single_choice':
      case 'image_choice': return !!singleSel[q.id];
      case 'multiple_choice': return (multiSel[q.id]?.length ?? 0) > 0;
      case 'true_false': return !!tfSel[q.id];
      case 'drag_drop':
      case 'sorting': return true;
      case 'matching': return Object.keys(matchMap[q.id] ?? {}).length === options.length;
      case 'fill_blank': {
        const blanks = Array.isArray(q.optionsJson) ? q.optionsJson : [];
        const ans = fillBlankAns[q.id] ?? {};
        return blanks.every((b) => !!ans[b.key]?.trim()) || Object.keys(correctMatchMap).every((k) => !!ans[k]?.trim());
      }
      case 'table_fill': {
        const ans = tableFillAns[q.id] ?? {};
        return Object.keys(correctMatchMap).every((k) => !!ans[k]?.trim());
      }
      case 'number_line': {
        const expected = Array.isArray(q.correctAnswerJson) ? correctKeys : (correctKey ? [correctKey] : []);
        return (numberLineSel[q.id] ?? []).length === expected.length;
      }
      case 'cross_out': return (crossOutSel[q.id]?.length ?? 0) > 0;
      case 'coloring': {
        const map = coloringMap[q.id] ?? {};
        return Object.keys(correctMatchMap).every((k) => !!map[k]);
      }
      case 'puzzle': {
        const slots = options.filter((o) => o.key.startsWith('slot_'));
        const ans = puzzleAns[q.id] ?? {};
        return slots.every((s) => !!ans[s.key]);
      }
      case 'game': return gameComplete[q.id] ?? false;
      case 'counting': {
        const ans = countingAns[q.id] ?? {};
        if (correctKey !== null) return !!(ans['total']?.trim());
        return Object.keys(correctMatchMap).every((k) => !!(ans[k]?.trim()));
      }
      default: return false;
    }
  };

  const handleCheck = () => {
    if (isChecked || !hasAnswer()) return;
    const correct = isAnswerCorrect();
    setChecked((prev) => ({ ...prev, [q.id]: true }));
    if (correct) {
      setScore((s) => s + (q.points || 10));
      const msg = ENCOURAGE_CORRECT[Math.floor(Math.random() * ENCOURAGE_CORRECT.length)];
      setCelebrateMsg(msg);
      setCelebrate('correct');
      setTimeout(() => setCelebrate(null), 1800);
      if (soundOn) { correctAudio.current?.play().catch(() => {}); setTimeout(() => speak(msg), 600); }
    } else {
      const msg = ENCOURAGE_WRONG[Math.floor(Math.random() * ENCOURAGE_WRONG.length)];
      setCelebrateMsg(msg);
      setCelebrate('wrong');
      setTimeout(() => setCelebrate(null), 1800);
      if (soundOn) { wrongAudio.current?.play().catch(() => {}); setTimeout(() => speak(msg), 600); }
    }
  };

  const handleNext = () => {
    if (current < exercise.quizzes.length - 1) setCurrent((c) => c + 1);
  };

  const isCurrentCorrect = isChecked && isAnswerCorrect();

  // ─── Question type label ──────────────────────────────────────────────────
  const typeLabel: Record<string, string> = {
    true_false: 'Chọn Đúng hoặc Sai',
    drag_drop: 'Kéo thả sắp xếp',
    sorting: 'Sắp xếp thứ tự',
    multiple_choice: 'Chọn tất cả đáp án đúng',
    matching: 'Nối các cặp tương ứng',
    fill_blank: 'Điền số vào chỗ trống',
    table_fill: 'Điền vào bảng',
    number_line: 'Tìm số trên tia số',
    cross_out: 'Gạch bỏ đáp án sai',
    coloring: 'Tô màu theo yêu cầu',
    puzzle: 'Điền vào ô trống',
    game: 'Lật thẻ tìm cặp đôi',
    counting: 'Đếm và điền số',
  };

  // ─── Sidebar correctness check ────────────────────────────────────────────
  const checkCorrectForNav = (qz: QuizItem): boolean => {
    const ck = typeof qz.correctAnswerJson === 'string' ? qz.correctAnswerJson : null;
    const cks = Array.isArray(qz.correctAnswerJson) ? qz.correctAnswerJson as string[] : [];
    const cm = (typeof qz.correctAnswerJson === 'object' && qz.correctAnswerJson !== null && !Array.isArray(qz.correctAnswerJson))
      ? qz.correctAnswerJson as Record<string, string> : {};
    const opts2 = Array.isArray(qz.optionsJson) ? qz.optionsJson as OptionItem[] : [];

    switch (qz.questionType) {
      case 'single_choice': case 'image_choice': return singleSel[qz.id] === ck;
      case 'true_false': return (tfSel[qz.id] === 'true') === (qz.correctAnswerJson === true);
      case 'multiple_choice': {
        const sel = multiSel[qz.id] ?? [];
        return sel.length === cks.length && cks.every((k) => sel.includes(k));
      }
      case 'drag_drop': case 'sorting': {
        const co = cks;
        return JSON.stringify(dragOrder[qz.id] ?? []) === JSON.stringify(co);
      }
      case 'matching': return opts2.every((o) => (matchMap[qz.id] ?? {})[o.key] === cm[o.key]);
      case 'fill_blank': case 'table_fill': case 'coloring': {
        const ans = qz.questionType === 'fill_blank' ? (fillBlankAns[qz.id] ?? {}) : qz.questionType === 'table_fill' ? (tableFillAns[qz.id] ?? {}) : (coloringMap[qz.id] ?? {});
        return Object.entries(cm).every(([k, v]) => ans[k]?.trim() === String(v));
      }
      case 'number_line': {
        const sel = numberLineSel[qz.id] ?? [];
        return sel.length === cks.length && cks.every((v) => sel.includes(v));
      }
      case 'cross_out': {
        const sel = crossOutSel[qz.id] ?? [];
        return sel.length === cks.length && cks.every((k) => sel.includes(k));
      }
      case 'puzzle': {
        const ans = puzzleAns[qz.id] ?? {};
        return Object.entries(cm).every(([k, v]) => ans[k] === v);
      }
      case 'game': return gameComplete[qz.id] ?? false;
      case 'counting': {
        const ans = countingAns[qz.id] ?? {};
        const ck = typeof qz.correctAnswerJson === 'string' ? qz.correctAnswerJson : null;
        if (ck !== null) return ans['total']?.trim() === ck;
        return Object.entries(cm).every(([k, v]) => ans[k]?.trim() === String(v));
      }
      default: return false;
    }
  };


  const handleVirtualKey = (char: string) => {
    if (isChecked) return;
    // If no active blank, auto-pick first blank of current question
    let target = activeBlankKey;
    if (!target && q.questionType === 'fill_blank') {
      const match = q.questionText.match(/\[(\w+)\]/);
      const key = match?.[1] ?? (Array.isArray(q.optionsJson) ? q.optionsJson[0]?.key : null);
      if (key) { target = { qid: q.id, bkey: key }; setActiveBlankKey(target); }
    }
    if (!target) return;
    const { qid, bkey } = target;
    const cur = fillBlankAns[qid]?.[bkey] ?? '';
    const next = char === 'del' ? cur.slice(0, -1) : cur + char;
    setFillBlankAns((p) => ({ ...p, [qid]: { ...(p[qid] ?? {}), [bkey]: next } }));
  };

  const showVirtualKeyboard = !isChecked && (q.questionType === 'fill_blank' || q.questionType === 'table_fill' || q.questionType === 'counting');

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #4db8b8 0%, #6ec6c6 50%, #5bbaba 100%)' }}>

      <audio ref={correctAudio} src="/sounds/correct.mp3" preload="auto" />
      <audio ref={wrongAudio} src="/sounds/wrong.mp3" preload="auto" />

      {/* Top bar */}
      <div className="w-full px-4 sm:px-6 py-3" style={{ background: 'rgba(0,0,0,0.15)', backdropFilter: 'blur(4px)' }}>
        <div className="max-w-6xl mx-auto flex items-center gap-3 flex-wrap">
          <nav className="flex items-center gap-1.5 text-sm text-white/85 flex-wrap flex-1 min-w-0">
            <Link href="/" className="hover:text-white transition-colors shrink-0 font-medium">Trang chủ</Link>
            {lesson?.course && (
              <>
                <span className="text-white/40 text-xs">›</span>
                <Link href={`/khoa-hoc/${lesson.course.slug}`} className="hover:text-white transition-colors truncate max-w-[120px] font-medium">{lesson.course.title}</Link>
              </>
            )}
            {lesson && (
              <>
                <span className="text-white/40 text-xs">›</span>
                <Link href={lesson.slug ? `/${lesson.slug}` : `/lessons/${resolvedLessonId}`} className="hover:text-white transition-colors truncate max-w-[180px] font-medium">{lesson.title}</Link>
              </>
            )}
            <span className="text-white/40 text-xs">›</span>
            <span className="font-bold text-white shrink-0">{DIFF_LABEL[exercise.difficultyLevel]}</span>
          </nav>
          {allExercises.length > 0 && (
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-white/70 text-xs font-semibold">Bài:</span>
              <div className="flex gap-1">
                {allExercises.map((ex) => {
                  const colors: Record<string, string> = { easy: '#0e7490', medium: '#c0392b', hard: '#b45309' };
                  const isActive = ex.exerciseNumber === exerciseNumber;
                  return (
                    <button key={ex.exerciseNumber} onClick={() => navigateToExercise(ex.exerciseNumber)}
                      className="w-8 h-8 rounded-xl text-xs font-bold transition-all shadow-sm hover:scale-110"
                      style={{ background: isActive ? colors[ex.difficultyLevel] : 'rgba(255,255,255,0.2)', color: 'white', outline: isActive ? '2px solid white' : '2px solid transparent', outlineOffset: '2px' }}>
                      {ex.exerciseNumber}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Layout */}
      <div className="flex flex-1 items-start justify-center gap-3 px-3 sm:px-4 py-4 max-w-6xl mx-auto w-full">

        {/* Left sidebar — question list */}
        <div className="hidden md:flex flex-col w-12 bg-white rounded-xl overflow-hidden shadow-md shrink-0 border border-gray-200">
          <div className="text-center text-xs font-bold py-2 text-white" style={{ background: '#555' }}>KQ</div>
          {exercise.quizzes.map((qz, idx) => {
            const done = !!checked[qz.id];
            const ok = done && checkCorrectForNav(qz);
            const canNavigate = idx <= current || done;
            return (
              <button key={qz.id} onClick={() => canNavigate && setCurrent(idx)} disabled={!canNavigate}
                className={`text-sm font-bold py-2 border-b border-gray-100 transition-colors last:border-0 ${idx === current ? 'text-white' : done ? 'text-white' : 'text-gray-400 cursor-not-allowed'}`}
                style={{ background: idx === current ? diffColor : done ? (ok ? '#22c55e' : '#ef4444') : 'transparent' }}>
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Main card */}
        <div className="flex-1 max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
          {/* Card header with arrow badge */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white">
            {/* Arrow-shaped badge */}
            <div className="relative flex items-center shrink-0">
              <span className="pl-4 pr-6 py-1.5 text-white text-base font-black shadow-sm"
                style={{ background: diffColor, clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%)', borderRadius: '4px 0 0 4px' }}>
                Câu {current + 1}
              </span>
            </div>
            <span className="text-blue-600 font-semibold text-sm flex-1">
              {typeLabel[q.questionType] ?? 'Chọn đáp án đúng nhất'}
            </span>
          </div>

          <div className="px-6 py-5">
            {/* Question text */}
            <div className="flex items-start gap-3 mb-5">
              <button
                onClick={() => { if (q.questionAudioUrl) playAudio(q.questionAudioUrl); else speak(q.questionText); }}
                className="shrink-0 w-11 h-11 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600 shadow transition-colors"
                title="Nghe câu hỏi"
              >
                <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5 ml-0.5"><path d="M8 5v14l11-7z"/></svg>
              </button>
              {q.questionType === 'fill_blank' && (() => {
                const parts2 = q.questionText.split(/(\[b\d+\])/g);
                const isSeq = parts2.every((p2) => {
                  const m2 = p2.match(/^\[(\w+)\]$/);
                  return m2 || /^[\s\d\W]{0,5}$/.test(p2.trim()) || p2.trim() === '';
                }) && parts2.some((p2) => /^\[b\d+\]$/.test(p2));
                if (isSeq) return null; // FillBlank renders the full number sequence
                return (
                  <p className="pt-1 leading-relaxed" style={{ fontSize: q.questionText.replace(/\[b\d+\]/g,'').trim().length > 30 ? 20 : 26, fontWeight: 700, color: '#1e293b' }}>
                    {parts2.map((part2, pi) => {
                      const bm = part2.match(/^\[(\w+)\]$/);
                      if (bm) {
                        const bk = bm[1];
                        const bval = (fillBlankAns[q.id] ?? {})[bk] ?? '';
                        const correct2 = correctMatchMap[bk];
                        const isOk2 = isChecked ? bval.trim() === String(correct2) : null;
                        const isActive2 = !isChecked && activeBlankKey?.qid === q.id && activeBlankKey.bkey === bk;
                        return (
                          <span key={pi} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, verticalAlign: 'middle', margin: '0 6px' }}>
                            <input
                              type="text" inputMode="numeric" value={bval}
                              readOnly={!isChecked}
                              disabled={isChecked}
                              onClick={() => setActiveBlankKey({ qid: q.id, bkey: bk })}
                              onChange={(e) => setFillBlankAns((p) => ({ ...p, [q.id]: { ...(p[q.id] ?? {}), [bk]: e.target.value } }))}
                              style={{
                                width: 80, height: 56, textAlign: 'center',
                                fontSize: 32, fontWeight: 900,
                                borderWidth: 3, borderStyle: 'solid',
                                borderRadius: 14,
                                borderColor: isChecked ? (isOk2 ? '#22c55e' : '#ef4444') : isActive2 ? '#1d4ed8' : '#3b82f6',
                                background: isChecked ? (isOk2 ? '#f0fdf4' : '#fef2f2') : '#f8faff',
                                color: isChecked ? (isOk2 ? '#15803d' : '#b91c1c') : '#1e40af',
                                outline: 'none', cursor: 'pointer',
                                boxShadow: isActive2 ? '0 0 0 4px rgba(29,78,216,0.2)' : '0 2px 8px rgba(59,130,246,0.15)',
                                transition: 'all 0.15s',
                              }}
                            />
                            {isChecked && !isOk2 && <span style={{ fontSize: 13, color: '#16a34a', fontWeight: 700 }}>→{correct2}</span>}
                          </span>
                        );
                      }
                      if (!part2) return null;
                      return <span key={pi}>{part2}</span>;
                    })}
                  </p>
                );
              })()}
              {q.questionType !== 'fill_blank' && (
                <p className="text-xl font-bold text-gray-800 leading-snug pt-1">{q.questionText.replace(/\[b\d+\]/g, '____')}</p>
              )}
            </div>

            {q.questionImageUrl && (
              <div className="flex justify-center mb-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={q.questionImageUrl} alt="question" className="max-h-52 rounded-xl object-contain border border-gray-100 shadow-sm" />
              </div>
            )}

            {/* Answer area */}
            <div key={`${q.id}-answer`} className="mb-5">
              {q.questionType === 'single_choice' && (
                <SingleChoice options={options} selected={singleSel[q.id] ?? ''} checked={isChecked} correctKey={correctKey}
                  onSelect={(k) => setSingleSel((p) => ({ ...p, [q.id]: k }))} />
              )}
              {q.questionType === 'image_choice' && (
                <ImageChoice options={options} selected={singleSel[q.id] ?? ''} checked={isChecked} correctKey={correctKey}
                  onSelect={(k) => setSingleSel((p) => ({ ...p, [q.id]: k }))} />
              )}
              {q.questionType === 'multiple_choice' && (
                <MultipleChoice options={options} selected={multiSel[q.id] ?? []} checked={isChecked} correctKeys={correctKeys}
                  onToggle={(k) => {
                    const cur2 = multiSel[q.id] ?? [];
                    setMultiSel((p) => ({ ...p, [q.id]: cur2.includes(k) ? cur2.filter((x) => x !== k) : [...cur2, k] }));
                  }} />
              )}
              {q.questionType === 'true_false' && (
                <TrueFalse selected={tfSel[q.id] ?? ''} checked={isChecked} correctAnswer={correctBool}
                  onSelect={(v) => setTfSel((p) => ({ ...p, [q.id]: v }))} />
              )}
              {q.questionType === 'drag_drop' && (
                <DragDrop options={options} order={dragOrder[q.id] ?? options.map((o) => o.key)} checked={isChecked} correctOrder={correctDragOrder}
                  onReorder={(newOrder) => setDragOrder((p) => ({ ...p, [q.id]: newOrder }))} />
              )}
              {q.questionType === 'matching' && (
                <Matching key={q.id} options={options} userMap={matchMap[q.id] ?? {}} checked={isChecked} correctMap={correctMatchMap}
                  onChange={(map) => setMatchMap((p) => ({ ...p, [q.id]: map }))} />
              )}
              {q.questionType === 'fill_blank' && (
                <FillBlank key={q.id}
                  questionText={q.questionText}
                  blanks={Array.isArray(q.optionsJson) ? q.optionsJson : []}
                  answers={fillBlankAns[q.id] ?? {}}
                  checked={isChecked}
                  correctMap={correctMatchMap}
                  activeKey={activeBlankKey?.qid === q.id ? activeBlankKey.bkey : null}
                  onFocusBlank={(bkey) => setActiveBlankKey({ qid: q.id, bkey })}
                  onChange={(key, val) => setFillBlankAns((p) => ({ ...p, [q.id]: { ...(p[q.id] ?? {}), [key]: val } }))}
                />
              )}
              {q.questionType === 'table_fill' && (
                <TableFill
                  options={Array.isArray(q.optionsJson) ? q.optionsJson : []}
                  answers={tableFillAns[q.id] ?? {}}
                  checked={isChecked}
                  correctMap={correctMatchMap}
                  onChange={(key, val) => setTableFillAns((p) => ({ ...p, [q.id]: { ...(p[q.id] ?? {}), [key]: val } }))}
                />
              )}
              {q.questionType === 'number_line' && (
                <NumberLine
                  options={Array.isArray(q.optionsJson) ? q.optionsJson : []}
                  selected={numberLineSel[q.id] ?? []}
                  checked={isChecked}
                  correctAnswers={Array.isArray(q.correctAnswerJson) ? correctKeys : (correctKey ? [correctKey] : [])}
                  onSelect={(val) => {
                    setNumberLineSel((p) => {
                      const cur2 = p[q.id] ?? [];
                      const next = cur2.includes(val) ? cur2.filter((x) => x !== val) : [...cur2, val];
                      return { ...p, [q.id]: next };
                    });
                  }}
                />
              )}
              {q.questionType === 'sorting' && (
                <Sorting options={options} order={dragOrder[q.id] ?? options.map((o) => o.key)} checked={isChecked} correctOrder={correctDragOrder}
                  onReorder={(newOrder) => setDragOrder((p) => ({ ...p, [q.id]: newOrder }))} />
              )}
              {q.questionType === 'cross_out' && (
                <CrossOut
                  options={options}
                  selected={crossOutSel[q.id] ?? []}
                  checked={isChecked}
                  correctKeys={correctKeys}
                  onToggle={(key) => {
                    setCrossOutSel((p) => {
                      const cur2 = p[q.id] ?? [];
                      return { ...p, [q.id]: cur2.includes(key) ? cur2.filter((x) => x !== key) : [...cur2, key] };
                    });
                  }}
                />
              )}
              {q.questionType === 'coloring' && (
                <Coloring key={q.id}
                  options={Array.isArray(q.optionsJson) ? q.optionsJson : []}
                  colorMap={coloringMap[q.id] ?? {}}
                  checked={isChecked}
                  correctMap={correctMatchMap}
                  onChange={(map) => setColoringMap((p) => ({ ...p, [q.id]: map }))}
                />
              )}
              {q.questionType === 'puzzle' && (
                <Puzzle key={q.id}
                  options={Array.isArray(q.optionsJson) ? q.optionsJson : []}
                  answers={puzzleAns[q.id] ?? {}}
                  checked={isChecked}
                  correctMap={correctMatchMap}
                  onChange={(map) => setPuzzleAns((p) => ({ ...p, [q.id]: map }))}
                />
              )}
              {q.questionType === 'game' && (
                <Game key={q.id}
                  options={Array.isArray(q.optionsJson) ? q.optionsJson : []}
                  checked={isChecked}
                  onComplete={() => setGameComplete((p) => ({ ...p, [q.id]: true }))}
                />
              )}
              {q.questionType === 'counting' && (
                <Counting key={q.id}
                  options={Array.isArray(q.optionsJson) ? q.optionsJson : []}
                  answers={countingAns[q.id] ?? {}}
                  checked={isChecked}
                  correctMap={correctMatchMap}
                  correctKey={correctKey}
                  onChange={(key, val) => setCountingAns((p) => ({ ...p, [q.id]: { ...(p[q.id] ?? {}), [key]: val } }))}
                />
              )}
            </div>

            {/* Explanation */}
            {isChecked && (
              <div className={`mb-4 px-4 py-3 rounded-xl text-sm flex items-start gap-3 border-l-4 ${isCurrentCorrect ? 'bg-green-50 border-green-400 text-green-800' : 'bg-red-50 border-red-400 text-red-800'}`}>
                <span className="text-xl shrink-0 mt-0.5">{isCurrentCorrect ? '✅' : '❌'}</span>
                <div>
                  <p className="font-bold text-base mb-0.5">{isCurrentCorrect ? 'Chính xác!' : 'Chưa đúng!'}</p>
                  {q.explanation && <p className="opacity-80 leading-snug">{q.explanation}</p>}
                  {q.explanationAudioUrl && (
                    <button onClick={() => playAudio(q.explanationAudioUrl)} className="mt-1.5 inline-flex items-center gap-1 text-xs underline opacity-70 hover:opacity-100">
                      🔊 Nghe giải thích
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-center gap-3 pt-1">
              {!isChecked ? (
                <button onClick={handleCheck} disabled={!hasAnswer()}
                  className="px-10 py-3 rounded-full font-black text-white text-lg shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:brightness-105 hover:-translate-y-0.5 active:scale-95"
                  style={{ background: hasAnswer() ? 'linear-gradient(135deg, #f59e0b, #e67e00)' : '#d1d5db', boxShadow: hasAnswer() ? '0 4px 0 #b45309, 0 6px 12px rgba(245,158,11,0.4)' : 'none' }}>
                  Kiểm tra »
                </button>
              ) : current < exercise.quizzes.length - 1 ? (
                <button onClick={handleNext}
                  className="px-10 py-3 rounded-full font-black text-white text-lg shadow-lg hover:-translate-y-0.5 transition-all active:scale-95"
                  style={{ background: `linear-gradient(135deg, ${diffColor}, ${diffColor}cc)`, boxShadow: `0 4px 0 ${diffColor}99` }}>
                  Câu tiếp theo »
                </button>
              ) : (
                <Link href={lesson?.slug ? `/${lesson.slug}` : `/lessons/${resolvedLessonId}`}
                  className="px-10 py-3 rounded-full font-black text-white text-lg shadow-lg text-center inline-block transition-all hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', boxShadow: '0 4px 0 #15803d' }}>
                  🎉 Hoàn thành! Quay lại
                </Link>
              )}
            </div>

            {/* Virtual keyboard */}
            {showVirtualKeyboard && (
              <div className="mt-4 -mx-6 -mb-5 border-t-2 border-gray-200 bg-gray-100 px-2 py-2">
                <div className="flex items-center gap-1 flex-wrap justify-center">
                  {['1','2','3','4','5','6','7','8','9','0'].map((k) => (
                    <button key={k} onClick={() => handleVirtualKey(k)}
                      className="w-11 h-11 bg-white rounded-lg border border-gray-300 text-gray-800 font-black text-lg shadow-sm hover:bg-gray-50 active:scale-95 transition-all">
                      {k}
                    </button>
                  ))}
                  {['+','-','×',':','>','<','=',','].map((k) => (
                    <button key={k} onClick={() => handleVirtualKey(k === '×' ? '*' : k === ':' ? '/' : k)}
                      className="w-11 h-11 bg-sky-400 rounded-lg border border-sky-500 text-white font-black text-base shadow-sm hover:bg-sky-500 active:scale-95 transition-all">
                      {k}
                    </button>
                  ))}
                  <button onClick={() => handleVirtualKey('del')}
                    className="px-3 h-11 bg-red-500 rounded-lg border border-red-600 text-white font-black text-sm shadow-sm hover:bg-red-600 active:scale-95 transition-all">
                    Xóa
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="hidden md:flex flex-col w-36 gap-0 shrink-0 bg-white rounded-xl overflow-hidden shadow-md border border-gray-200">
          {/* Question number */}
          <div className="bg-sky-500 text-white text-center text-xs font-bold py-2">Câu hỏi số</div>
          <div className="text-center py-3 border-b border-gray-200">
            <span className="text-3xl font-black text-gray-800">{current + 1}</span>
            <span className="text-base text-gray-500">/{exercise.quizzes.length}</span>
          </div>
          {/* Score */}
          <div className="bg-red-500 text-white text-center text-xs font-bold py-2">Điểm:</div>
          <div className="text-center py-3 border-b border-gray-200">
            <div className="text-4xl font-black" style={{ color: '#e53935' }}>{score}</div>
            <div className="text-xs text-gray-500 mt-0.5">trên tổng số</div>
            <div className="text-xs font-bold text-gray-600">{totalPoints}</div>
          </div>
          {/* Report */}
          <div className="text-center py-2 border-b border-gray-200">
            <div className="text-xs text-amber-500 font-semibold">Góp ý - Báo lỗi</div>
            <div className="flex justify-center mt-1">
              <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              </div>
            </div>
          </div>
          {/* Sound */}
          <div className="text-center py-3">
            <button onClick={() => setSoundOn((s) => !s)}
              className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-1 transition-colors ${soundOn ? 'bg-teal-400 text-white' : 'bg-gray-200 text-gray-400'}`}>
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d={soundOn
                  ? 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z'
                  : 'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z'}
                />
              </svg>
            </button>
            <div className="text-xs text-gray-500 leading-tight px-1">Bật/Tắt âm thanh báo đúng/sai</div>
          </div>
        </div>

      </div>

      {/* Celebration overlay — keep original, skip rest of old sidebar */}
      {celebrate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none" style={{ animation: 'celebFade 1.8s ease forwards' }}>
          <style>{`
            @keyframes celebFade { 0%{opacity:0;transform:scale(0.7)} 15%{opacity:1;transform:scale(1.08)} 30%{transform:scale(1)} 70%{opacity:1} 100%{opacity:0;transform:scale(1.1)} }
            @keyframes starPulse { 0%,100%{transform:scale(1) rotate(0deg)} 50%{transform:scale(1.04) rotate(3deg)} }
            @keyframes bounceIn { 0%{transform:translateY(-20px) scale(0.8);opacity:0} 60%{transform:translateY(4px) scale(1.05);opacity:1} 100%{transform:translateY(0) scale(1);opacity:1} }
          `}</style>
          <div className="relative flex flex-col items-center justify-center">
            <div className="absolute" style={{ width:340,height:340,background:'#fffde7',clipPath:'polygon(50% 0%,55% 18%,61% 5%,63% 24%,72% 13%,71% 32%,83% 23%,79% 41%,93% 36%,86% 52%,100% 51%,91% 64%,100% 68%,88% 77%,95% 84%,80% 88%,84% 97%,69% 97%,70% 100%,57% 96%,55% 100%,45% 96%,43% 100%,30% 97%,31% 97%,16% 97%,20% 88%,5% 84%,12% 77%,0% 68%,9% 64%,0% 51%,14% 52%,7% 36%,21% 41%,17% 23%,29% 32%,28% 13%,37% 24%,39% 5%,45% 18%)',animation:'starPulse 0.7s ease infinite' }} />
            <div className="relative flex flex-col items-center gap-1 px-6 pt-2">
              <div className="text-5xl select-none mb-1" style={{ animation:'bounceIn 0.4s ease forwards',filter:'drop-shadow(2px 4px 6px rgba(0,0,0,0.2))' }}>
                {celebrate === 'correct' ? '🌟🎉🌟' : '🌶️🫑🌶️'}
              </div>
              <p className="text-4xl font-black text-center leading-tight px-4" style={celebrate === 'correct'
                ? { color:'#4caf50',WebkitTextStroke:'2px #1b5e20',textShadow:'3px 3px 0 #1b5e20',fontFamily:'sans-serif' }
                : { color:'#e53935',WebkitTextStroke:'2px #7f0000',textShadow:'3px 3px 0 #b71c1c',fontFamily:'sans-serif' }}>
                {celebrateMsg}
              </p>
              <span className="text-7xl select-none mt-1" style={{ filter:'drop-shadow(2px 4px 8px rgba(0,0,0,0.25))' }}>
                {celebrate === 'correct' ? '😉👌' : '🤦'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

