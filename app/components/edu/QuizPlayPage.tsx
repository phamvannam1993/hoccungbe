'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiFetch } from '../../lib/api';
import { buildExerciseUrl, DIFF_TO_SLUG } from '../../lib/quiz-slug';

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
    <div className={`grid gap-3 ${options.length === 2 ? 'grid-cols-2' : options.length === 3 ? 'grid-cols-3' : options.length === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2'}`}>
      {options.map((opt) => {
        const isSel = selected === opt.key;
        const isRight = checked && opt.key === correctKey;
        const isWrong = checked && isSel && opt.key !== correctKey;
        return (
          <button key={opt.key}
            onClick={() => { if (!checked) { onSelect(opt.key); if (opt.audioUrl) playAudio(opt.audioUrl); else speak(opt.text); } }}
            className={`relative flex flex-col items-center justify-center gap-1 min-h-[72px] px-3 py-2 rounded-xl border-2 text-base font-bold transition-all ${isRight ? 'border-green-500 bg-green-50 text-green-700' : isWrong ? 'border-red-500 bg-red-50 text-red-700' : isSel ? 'border-amber-400 bg-amber-50 text-amber-700' : 'border-amber-300 bg-white text-gray-800 hover:border-amber-400 hover:bg-amber-50'} ${checked ? 'cursor-default' : 'cursor-pointer'}`}
          >
            <div className="flex items-center gap-1.5">
              {opt.audioUrl && <AudioBtn url={opt.audioUrl} small />}
              <span>{opt.text || opt.key}</span>
            </div>
            {isRight && <span className="text-xs">✓</span>}
            {isWrong && <span className="text-xs">✗</span>}
          </button>
        );
      })}
    </div>
  );
}

function MultipleChoice({ options, selected, checked, correctKeys, onToggle }: {
  options: OptionItem[]; selected: string[]; checked: boolean; correctKeys: string[]; onToggle: (key: string) => void;
}) {
  return (
    <div className={`grid gap-3 ${options.length === 2 ? 'grid-cols-2' : options.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
      {options.map((opt) => {
        const isSel = selected.includes(opt.key);
        const isRight = checked && correctKeys.includes(opt.key);
        const isWrong = checked && isSel && !correctKeys.includes(opt.key);
        return (
          <button key={opt.key}
            onClick={() => { if (!checked) { onToggle(opt.key); if (opt.audioUrl) playAudio(opt.audioUrl); else speak(opt.text); } }}
            className={`relative flex flex-col items-center justify-center gap-1 min-h-[72px] px-3 py-3 rounded-xl border-2 text-base font-bold transition-all ${isRight ? 'border-green-500 bg-green-50 text-green-700' : isWrong ? 'border-red-500 bg-red-50 text-red-700' : isSel ? 'border-amber-400 bg-amber-50 text-amber-700' : 'border-amber-300 bg-white text-gray-800 hover:border-amber-400 hover:bg-amber-50'} ${checked ? 'cursor-default' : 'cursor-pointer'}`}
          >
            <span className={`absolute top-2 right-2 w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-black transition-all ${isSel ? 'border-amber-500 bg-amber-500 text-white' : 'border-gray-300 bg-white'}`}>{isSel && '✓'}</span>
            {opt.audioUrl && <AudioBtn url={opt.audioUrl} small />}
            <span>{opt.text}</span>
            {isRight && <span className="text-xs">✓</span>}
            {isWrong && <span className="text-xs">✗</span>}
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
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${isRight ? 'border-green-400 bg-green-50' : isWrong ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white hover:border-amber-300'} ${!checked ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
          >
            {!checked && <span className="text-gray-300 text-lg select-none">⠿</span>}
            <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center shrink-0">{idx + 1}</span>
            <span className="text-sm font-medium text-gray-800">{opt?.text ?? key}</span>
            {isRight && <span className="ml-auto text-green-500 font-bold">✓</span>}
            {isWrong && <span className="ml-auto text-xs text-red-500">→ {options.find((o) => o.key === correctOrder[idx])?.text}</span>}
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
            <span className="text-xs font-medium text-gray-700">{opt.text}</span>
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
  const [posMap, setPosMap] = useState<Record<string, number>>({});
  const [lines, setLines] = useState<Line[]>([]);
  const [svgSize, setSvgSize] = useState({ w: 0, h: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const leftRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const rightRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const rightItems = useState<string[]>(() => {
    const hasPair = options.some((o) => !!o.pair);
    const items = hasPair ? options.map((o) => o.pair ?? '').filter(Boolean) : options.map((o) => correctMap[o.key] ?? '').filter(Boolean);
    for (let i = items.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [items[i], items[j]] = [items[j], items[i]]; }
    return items;
  })[0];

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
        <div className="flex-1 space-y-2">
          {options.map((opt, idx) => {
            const isSelected = selectedLeft === opt.key;
            const matched = userMap[opt.key];
            const isCorrect = checked && !!matched && correctMap[opt.key] === matched;
            const isWrong = checked && !!matched && correctMap[opt.key] !== matched;
            return (
              <button key={opt.key} ref={(el) => { leftRefs.current[idx] = el; }} onClick={() => { if (!checked) setSelectedLeft((prev) => prev === opt.key ? null : opt.key); }}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-medium text-left transition-all ${isCorrect ? 'border-green-500 bg-green-50 text-green-800' : isWrong ? 'border-red-400 bg-red-50 text-red-800' : isSelected ? 'border-amber-400 bg-amber-50 text-amber-800 shadow-md' : matched ? 'border-blue-400 bg-blue-50 text-blue-800' : 'border-gray-200 bg-white text-gray-800 hover:border-amber-300'} ${checked ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <span className="flex-1">{opt.text}</span>
                {isCorrect && <span className="text-green-600 shrink-0">✓</span>}
                {isWrong && <span className="text-red-500 shrink-0">✗</span>}
              </button>
            );
          })}
        </div>
        <div className="w-12 shrink-0" />
        <div className="flex-1 space-y-2">
          {rightItems.map((text, pos) => {
            const isConnected = connectedPositions.has(pos);
            const ownerKey = Object.keys(posMap).find((k) => posMap[k] === pos);
            const isCorrect = checked && !!ownerKey && correctMap[ownerKey] === text;
            const isWrong = checked && !!ownerKey && correctMap[ownerKey] !== text;
            const isTarget = !checked && !!selectedLeft && !isConnected;
            return (
              <button key={pos} ref={(el) => { rightRefs.current[pos] = el; }}
                onClick={() => {
                  if (checked || !selectedLeft) return;
                  const newPosMap = { ...posMap };
                  Object.keys(newPosMap).forEach((k) => { if (newPosMap[k] === pos) delete newPosMap[k]; });
                  newPosMap[selectedLeft] = pos;
                  setPosMap(newPosMap);
                  const newMap = { ...userMap };
                  delete newMap[selectedLeft];
                  const prevOwner = Object.keys(posMap).find((k) => posMap[k] === pos);
                  if (prevOwner) delete newMap[prevOwner];
                  newMap[selectedLeft] = text;
                  onChange(newMap);
                  setSelectedLeft(null);
                }}
                disabled={checked}
                className={`w-full px-3 py-2.5 rounded-xl border-2 text-sm font-medium text-left transition-all ${isCorrect ? 'border-green-500 bg-green-50 text-green-800' : isWrong ? 'border-red-400 bg-red-50 text-red-800' : isConnected ? 'border-blue-400 bg-blue-50 text-blue-800' : isTarget ? 'border-amber-300 bg-amber-50 text-gray-700 hover:border-amber-400' : 'border-gray-200 bg-white text-gray-700'} ${checked ? 'cursor-default' : 'cursor-pointer'}`}
              >
                {text}
                {isCorrect && <span className="ml-1 text-green-600">✓</span>}
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

function FillBlank({ questionText, blanks, answers, checked, correctMap, onChange }: {
  questionText: string;
  blanks: OptionItem[];
  answers: Record<string, string>;
  checked: boolean;
  correctMap: Record<string, string>;
  onChange: (key: string, val: string) => void;
}) {
  // Split questionText by [bN] placeholders to render inline inputs
  const parts = questionText.split(/(\[b\d+\])/g);
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-1 text-lg font-semibold text-gray-800 leading-loose">
        {parts.map((part, i) => {
          const match = part.match(/^\[(\w+)\]$/);
          if (match) {
            const key = match[1];
            const val = answers[key] ?? '';
            const correct = correctMap[key];
            const isOk = checked ? val.trim() === String(correct) : null;
            return (
              <input key={i} type="text" inputMode="numeric" value={val}
                onChange={(e) => onChange(key, e.target.value)}
                disabled={checked}
                className={`w-14 h-10 text-center font-bold text-base rounded-xl border-2 outline-none transition-all ${checked ? (isOk ? 'border-green-500 bg-green-50 text-green-700' : 'border-red-400 bg-red-50 text-red-700') : 'border-dashed border-amber-400 bg-amber-50 focus:border-amber-600 focus:bg-white'}`}
              />
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </div>
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
                  className={`w-16 h-10 text-center font-bold text-base rounded-xl border-2 outline-none ${checked ? (isOk ? 'border-green-500 bg-green-50 text-green-700' : 'border-red-400 bg-red-50 text-red-700') : 'border-dashed border-amber-400 bg-amber-50 focus:border-amber-600'}`}
                />
                {checked && !isOk && <span className="text-xs text-green-600">→ {correct}</span>}
              </div>
            );
          })}
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
    <div className="space-y-2">
      <p className="text-xs text-gray-400 mb-3">Nhấn ▲▼ để sắp xếp thứ tự đúng</p>
      {order.map((key, idx) => {
        const opt = options.find((o) => o.key === key);
        const isRight = checked && correctOrder[idx] === key;
        const isWrong = checked && correctOrder[idx] !== key;
        return (
          <div key={key}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 transition-all ${isRight ? 'border-green-400 bg-green-50' : isWrong ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'}`}
          >
            <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center shrink-0">{idx + 1}</span>
            <span className="flex-1 text-sm font-medium text-gray-800">{opt?.text ?? key}</span>
            {!checked && (
              <div className="flex flex-col gap-0.5">
                <button onClick={() => move(idx, -1)} disabled={idx === 0}
                  className="w-7 h-6 rounded bg-gray-100 hover:bg-amber-100 text-gray-600 text-xs font-bold disabled:opacity-30 transition-colors">▲</button>
                <button onClick={() => move(idx, 1)} disabled={idx === order.length - 1}
                  className="w-7 h-6 rounded bg-gray-100 hover:bg-amber-100 text-gray-600 text-xs font-bold disabled:opacity-30 transition-colors">▼</button>
              </div>
            )}
            {isRight && <span className="text-green-500 font-bold">✓</span>}
            {isWrong && <span className="text-xs text-red-500">→ {options.find((o) => o.key === correctOrder[idx])?.text}</span>}
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
    <div className="space-y-2">
      <p className="text-xs text-gray-400 mb-3">Bấm để gạch bỏ những đáp án sai</p>
      <div className={`grid gap-3 ${options.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'}`}>
        {options.map((opt) => {
          const isCrossed = selected.includes(opt.key);
          const shouldBeCrossed = correctKeys.includes(opt.key);
          const isCorrect = checked && isCrossed === shouldBeCrossed;
          const isWrong = checked && isCrossed !== shouldBeCrossed;
          return (
            <button key={opt.key} onClick={() => !checked && onToggle(opt.key)}
              className={`relative min-h-[60px] px-3 py-3 rounded-xl border-2 text-base font-bold transition-all select-none ${
                isCorrect && isCrossed ? 'border-green-500 bg-green-50 text-green-600' :
                isCorrect && !isCrossed ? 'border-green-400 bg-white text-gray-800' :
                isWrong ? 'border-red-400 bg-red-50 text-red-700' :
                isCrossed ? 'border-gray-400 bg-gray-100 text-gray-400' :
                'border-amber-300 bg-white text-gray-800 hover:border-amber-400'
              } ${checked ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <span className={isCrossed ? 'line-through opacity-50' : ''}>{opt.text}</span>
              {isCrossed && !checked && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="absolute w-full h-0.5 bg-red-400 rotate-12 opacity-70" />
                  <div className="absolute w-full h-0.5 bg-red-400 -rotate-12 opacity-70" />
                </div>
              )}
              {isCorrect && <span className="absolute top-1 right-1.5 text-xs text-green-500">✓</span>}
              {isWrong && <span className="absolute top-1 right-1.5 text-xs text-red-500">✗</span>}
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
              <span className="text-xs text-gray-600 text-center leading-tight">{opt.text}</span>
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
      <p className="text-xs text-gray-400">Kéo hoặc bấm chọn số rồi bấm vào ô trống để điền vào chỗ dấu ?</p>

      {/* Slots */}
      <div className="space-y-3">
        {slots.map((slot) => {
          const placedKey = answers[slot.key];
          const placedToken = tokens.find((t) => t.key === placedKey);
          const correctKey = correctMap[slot.key];
          const correctToken = tokens.find((t) => t.key === correctKey);
          const isCorrect = checked && placedKey === correctKey;
          const isWrong = checked && placedKey && placedKey !== correctKey;

          // Replace ? in slot text with the placed value
          const displayText = slot.text.replace('?', placedToken ? placedToken.text : '?');

          return (
            <div key={slot.key}
              onClick={() => !placedToken ? placeToken(slot.key) : removeFromSlot(slot.key)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                isCorrect ? 'border-green-500 bg-green-50' :
                isWrong ? 'border-red-400 bg-red-50' :
                placedToken ? 'border-blue-400 bg-blue-50' :
                selectedToken ? 'border-dashed border-amber-400 bg-amber-50 hover:bg-amber-100' :
                'border-dashed border-gray-300 bg-gray-50'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg border-2 ${
                isCorrect ? 'border-green-500 bg-green-100 text-green-700' :
                isWrong ? 'border-red-400 bg-red-100 text-red-700' :
                placedToken ? 'border-blue-400 bg-blue-100 text-blue-700' :
                'border-dashed border-gray-300 bg-white text-gray-300'
              }`}>
                {placedToken ? placedToken.text : '?'}
              </div>
              <span className="text-base font-semibold text-gray-800">{displayText}</span>
              {isCorrect && <span className="ml-auto text-green-500 font-bold text-lg">✓</span>}
              {isWrong && <span className="ml-auto text-xs text-green-600">→ {correctToken?.text}</span>}
              {placedToken && !checked && <span className="ml-auto text-xs text-gray-400">bấm để gỡ</span>}
            </div>
          );
        })}
      </div>

      {/* Token bank */}
      {!checked && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500 font-medium">Số chưa dùng:</p>
          <div className="flex flex-wrap gap-2">
            {available.map((t) => (
              <button key={t.key} onClick={() => setSelectedToken(selectedToken === t.key ? null : t.key)}
                className={`w-12 h-12 rounded-xl border-2 font-black text-lg transition-all ${
                  selectedToken === t.key ? 'border-amber-500 bg-amber-100 text-amber-700 scale-110 shadow-md' : 'border-gray-300 bg-white text-gray-700 hover:border-amber-400 hover:bg-amber-50'
                }`}>
                {t.text}
              </button>
            ))}
            {available.length === 0 && <span className="text-xs text-gray-400 italic">Đã điền hết</span>}
          </div>
          {selectedToken && (
            <p className="text-xs text-amber-600">Đã chọn <strong>{tokens.find((t) => t.key === selectedToken)?.text}</strong> — bấm vào ô ? để điền</p>
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
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">Lật thẻ tìm cặp giống nhau</p>
        <span className="text-xs font-bold text-amber-600">{matched.size}/{totalPairs} cặp</span>
      </div>
      <div className={`grid gap-3 ${options.length <= 6 ? 'grid-cols-3' : 'grid-cols-4'}`}>
        {cards.map((card, idx) => {
          const pairId = card.pair ?? card.key;
          const isMatched = matched.has(pairId);
          const isFlipped = flipped.has(idx) || isMatched;
          return (
            <button key={idx} onClick={() => !isMatched && !checked && handleFlip(idx)}
              className={`aspect-square min-h-[60px] rounded-2xl border-2 flex items-center justify-center font-bold text-sm transition-all ${
                isMatched ? 'border-green-500 bg-green-50 text-green-700' :
                isFlipped ? 'border-amber-400 bg-amber-50 text-gray-800' :
                'border-gray-300 bg-gradient-to-br from-amber-400 to-orange-500 text-white hover:scale-105'
              }`}
            >
              {isFlipped ? (
                <span className="px-1 text-center leading-tight">{card.text}</span>
              ) : (
                <span className="text-2xl">🌟</span>
              )}
            </button>
          );
        })}
      </div>
      {isComplete && (
        <div className="text-center py-3 rounded-xl bg-green-50 border border-green-300">
          <p className="text-green-700 font-bold text-lg">🎉 Ghép xong tất cả {totalPairs} cặp!</p>
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

function preprocessTTS(text: string): string {
  return text
    .replace(/[\u{1F000}-\u{1FFFF}|\u{2600}-\u{27BF}|\u{1F300}-\u{1F9FF}|\u{FE00}-\u{FE0F}|\u{200D}]/gu, '')
    .replace(/\[b\d+\]/g, 'mấy')
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

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #4db8b8 0%, #6ec6c6 50%, #5bbaba 100%)' }}>

      <audio ref={correctAudio} src="/sounds/correct.mp3" preload="auto" />
      <audio ref={wrongAudio} src="/sounds/wrong.mp3" preload="auto" />

      {/* Top bar */}
      <div className="w-full px-4 sm:px-6 py-3" style={{ background: 'rgba(0,0,0,0.08)', backdropFilter: 'blur(4px)' }}>
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

        {/* Left sidebar */}
        <div className="hidden md:flex flex-col w-12 bg-white rounded-2xl overflow-hidden shadow-md shrink-0">
          <div className="text-center text-xs font-bold py-2 text-white rounded-t-2xl" style={{ background: diffColor }}>KQ</div>
          {exercise.quizzes.map((qz, idx) => {
            const done = !!checked[qz.id];
            const ok = done && checkCorrectForNav(qz);
            const canNavigate = idx <= current || done;
            return (
              <button key={qz.id} onClick={() => canNavigate && setCurrent(idx)} disabled={!canNavigate}
                className={`text-sm font-bold py-2.5 border-b border-gray-100 transition-colors last:border-0 ${idx === current ? 'text-white' : done ? 'text-white' : 'text-gray-300 cursor-not-allowed'}`}
                style={{ background: idx === current ? diffColor : done ? (ok ? '#22c55e' : '#ef4444') : 'transparent' }}>
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Main card */}
        <div className="flex-1 max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100" style={{ background: `${diffColor}15` }}>
            <span className="px-3 py-1 rounded-lg text-white text-sm font-bold" style={{ background: diffColor }}>
              Câu {current + 1}/{exercise.quizzes.length}
            </span>
            <span className="text-gray-600 font-medium text-sm">
              {typeLabel[q.questionType] ?? 'Chọn đáp án đúng nhất'}
            </span>
            <div className="ml-auto w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${((current + 1) / exercise.quizzes.length) * 100}%`, background: diffColor }} />
            </div>
          </div>

          <div className="px-5 py-5">
            {/* Question text */}
            <div className="flex items-start gap-3 mb-5">
              <button
                onClick={() => { if (q.questionAudioUrl) playAudio(q.questionAudioUrl); else speak(q.questionText); }}
                className="shrink-0 w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center hover:bg-teal-600 shadow-md transition-colors"
                title="Nghe câu hỏi"
              >
                <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5 ml-0.5"><path d="M8 5v14l11-7z"/></svg>
              </button>
              {/* FillBlank renders question inline, others show it as plain text */}
              {q.questionType !== 'fill_blank' && (
                <p className="text-lg font-semibold text-gray-800 leading-snug">{q.questionText}</p>
              )}
            </div>

            {q.questionImageUrl && (
              <div className="flex justify-center mb-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={q.questionImageUrl} alt="question" className="max-h-52 rounded-xl object-contain border border-gray-100 shadow-sm" />
              </div>
            )}

            {/* Answer area */}
            <div className="mb-5">
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
                <Matching options={options} userMap={matchMap[q.id] ?? {}} checked={isChecked} correctMap={correctMatchMap}
                  onChange={(map) => setMatchMap((p) => ({ ...p, [q.id]: map }))} />
              )}
              {q.questionType === 'fill_blank' && (
                <FillBlank
                  questionText={q.questionText}
                  blanks={Array.isArray(q.optionsJson) ? q.optionsJson : []}
                  answers={fillBlankAns[q.id] ?? {}}
                  checked={isChecked}
                  correctMap={correctMatchMap}
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
                <Coloring
                  options={Array.isArray(q.optionsJson) ? q.optionsJson : []}
                  colorMap={coloringMap[q.id] ?? {}}
                  checked={isChecked}
                  correctMap={correctMatchMap}
                  onChange={(map) => setColoringMap((p) => ({ ...p, [q.id]: map }))}
                />
              )}
              {q.questionType === 'puzzle' && (
                <Puzzle
                  options={Array.isArray(q.optionsJson) ? q.optionsJson : []}
                  answers={puzzleAns[q.id] ?? {}}
                  checked={isChecked}
                  correctMap={correctMatchMap}
                  onChange={(map) => setPuzzleAns((p) => ({ ...p, [q.id]: map }))}
                />
              )}
              {q.questionType === 'game' && (
                <Game
                  options={Array.isArray(q.optionsJson) ? q.optionsJson : []}
                  checked={isChecked}
                  onComplete={() => setGameComplete((p) => ({ ...p, [q.id]: true }))}
                />
              )}
              {q.questionType === 'counting' && (
                <Counting
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
              <div className={`mb-4 px-4 py-3 rounded-2xl text-sm flex items-start gap-3 border-l-4 ${isCurrentCorrect ? 'bg-green-50 border-green-400 text-green-800' : 'bg-red-50 border-red-400 text-red-800'}`}>
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
                  className="px-8 py-3 rounded-full font-bold text-white text-base shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:shadow-xl hover:-translate-y-0.5"
                  style={{ background: hasAnswer() ? diffColor : '#ccc' }}>
                  Kiểm tra »
                </button>
              ) : current < exercise.quizzes.length - 1 ? (
                <button onClick={handleNext}
                  className="px-8 py-3 rounded-full font-bold text-white text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                  style={{ background: diffColor }}>
                  Câu tiếp theo »
                </button>
              ) : (
                <Link href={lesson?.slug ? `/${lesson.slug}` : `/lessons/${resolvedLessonId}`}
                  className="px-8 py-3 rounded-full font-bold text-white text-base shadow-lg text-center inline-block bg-green-500 hover:bg-green-600 transition-colors">
                  🎉 Hoàn thành! Quay lại
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="hidden md:flex flex-col w-32 gap-3 shrink-0">
          <div className="bg-white rounded-2xl overflow-hidden shadow-md">
            <div className="text-white text-center text-xs font-bold py-2 rounded-t-2xl" style={{ background: diffColor }}>Điểm</div>
            <div className="text-center py-3">
              <div className="text-3xl font-black text-amber-500">{score}</div>
              <div className="text-xs text-gray-400">/ {totalPoints}</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl overflow-hidden shadow-md">
            <div className="bg-teal-500 text-white text-center text-xs font-bold py-2 rounded-t-2xl">Tiến độ</div>
            <div className="text-center py-3">
              <span className="text-2xl font-black text-gray-800">{current + 1}</span>
              <span className="text-sm text-gray-400">/{exercise.quizzes.length}</span>
            </div>
            <div className="px-3 pb-3">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full transition-all" style={{ width: `${((current + 1) / exercise.quizzes.length) * 100}%` }} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-3 shadow-md text-center">
            <button onClick={() => setSoundOn((s) => !s)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-1.5 transition-colors ${soundOn ? 'bg-teal-100 text-teal-600' : 'bg-gray-100 text-gray-400'}`}>
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d={soundOn
                  ? 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z'
                  : 'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z'}
                />
              </svg>
            </button>
            <div className="text-xs text-gray-400 leading-tight">{soundOn ? 'Âm thanh bật' : 'Âm thanh tắt'}</div>
          </div>
        </div>

      </div>

      {/* Celebration overlay */}
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
