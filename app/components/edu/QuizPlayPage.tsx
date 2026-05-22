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
  questionType: 'single_choice' | 'multiple_choice' | 'true_false' | 'drag_drop' | 'image_choice' | 'matching';
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

// ─── Question type renderers ──────────────────────────────────────────────────

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

function SingleChoice({
  options, selected, checked, correctKey, onSelect,
}: {
  options: OptionItem[];
  selected: string;
  checked: boolean;
  correctKey: string | null;
  onSelect: (key: string) => void;
}) {
  return (
    <div className={`grid gap-3 ${
      options.length === 2 ? 'grid-cols-2' :
      options.length === 3 ? 'grid-cols-3' :
      options.length === 4 ? 'grid-cols-2 sm:grid-cols-4' :
      'grid-cols-2'
    }`}>
      {options.map((opt) => {
        const isSel = selected === opt.key;
        const isRight = checked && opt.key === correctKey;
        const isWrong = checked && isSel && opt.key !== correctKey;
        return (
          <button
            key={opt.key}
            onClick={() => { if (!checked) { onSelect(opt.key); if (opt.audioUrl) playAudio(opt.audioUrl); else speak(opt.text); } }}
            className={`relative flex flex-col items-center justify-center gap-1 min-h-[72px] px-3 py-2 rounded-xl border-2 text-base font-bold transition-all ${
              isRight ? 'border-green-500 bg-green-50 text-green-700'
              : isWrong ? 'border-red-500 bg-red-50 text-red-700'
              : isSel ? 'border-amber-400 bg-amber-50 text-amber-700'
              : 'border-amber-300 bg-white text-gray-800 hover:border-amber-400 hover:bg-amber-50'
            } ${checked ? 'cursor-default' : 'cursor-pointer'}`}
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

function MultipleChoice({
  options, selected, checked, correctKeys, onToggle,
}: {
  options: OptionItem[];
  selected: string[];
  checked: boolean;
  correctKeys: string[];
  onToggle: (key: string) => void;
}) {
  return (
    <div className={`grid gap-3 ${
      options.length === 2 ? 'grid-cols-2' :
      options.length === 3 ? 'grid-cols-3' :
      'grid-cols-2'
    }`}>
      {options.map((opt) => {
        const isSel = selected.includes(opt.key);
        const isRight = checked && correctKeys.includes(opt.key);
        const isWrong = checked && isSel && !correctKeys.includes(opt.key);
        return (
          <button
            key={opt.key}
            onClick={() => { if (!checked) { onToggle(opt.key); if (opt.audioUrl) playAudio(opt.audioUrl); else speak(opt.text); } }}
            className={`relative flex flex-col items-center justify-center gap-1 min-h-[72px] px-3 py-3 rounded-xl border-2 text-base font-bold transition-all ${
              isRight ? 'border-green-500 bg-green-50 text-green-700'
              : isWrong ? 'border-red-500 bg-red-50 text-red-700'
              : isSel ? 'border-amber-400 bg-amber-50 text-amber-700'
              : 'border-amber-300 bg-white text-gray-800 hover:border-amber-400 hover:bg-amber-50'
            } ${checked ? 'cursor-default' : 'cursor-pointer'}`}
          >
            {/* Check indicator top-right */}
            <span className={`absolute top-2 right-2 w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-black transition-all ${
              isSel ? 'border-amber-500 bg-amber-500 text-white' : 'border-gray-300 bg-white'
            }`}>
              {isSel && '✓'}
            </span>
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

function TrueFalse({
  selected, checked, correctAnswer, onSelect,
}: {
  selected: string;
  checked: boolean;
  correctAnswer: boolean | null;
  onSelect: (val: string) => void;
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
          <button
            key={opt.key}
            onClick={() => !checked && onSelect(opt.key)}
            className={`flex-1 py-5 rounded-2xl border-2 text-lg font-bold transition-all ${
              isRight ? 'border-green-500 bg-green-50 text-green-700'
              : isWrong ? 'border-red-500 bg-red-50 text-red-700'
              : isSel ? 'border-amber-400 bg-amber-50 text-amber-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-amber-300'
            } ${checked ? 'cursor-default' : 'cursor-pointer'}`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function DragDrop({
  options, order, checked, correctOrder, onReorder,
}: {
  options: OptionItem[];
  order: string[];
  checked: boolean;
  correctOrder: string[];
  onReorder: (newOrder: string[]) => void;
}) {
  const dragIdx = useRef<number | null>(null);

  const handleDragStart = (idx: number) => { dragIdx.current = idx; };
  const handleDrop = (idx: number) => {
    if (dragIdx.current === null || dragIdx.current === idx) return;
    const newOrder = [...order];
    const [moved] = newOrder.splice(dragIdx.current, 1);
    newOrder.splice(idx, 0, moved);
    onReorder(newOrder);
    dragIdx.current = null;
  };

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-400 mb-3">Kéo thả để sắp xếp thứ tự đúng</p>
      {order.map((key, idx) => {
        const opt = options.find((o) => o.key === key);
        const isRight = checked && correctOrder[idx] === key;
        const isWrong = checked && correctOrder[idx] !== key;
        return (
          <div
            key={key}
            draggable={!checked}
            onDragStart={() => handleDragStart(idx)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(idx)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
              isRight ? 'border-green-400 bg-green-50'
              : isWrong ? 'border-red-400 bg-red-50'
              : 'border-gray-200 bg-white hover:border-amber-300'
            } ${!checked ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
          >
            {!checked && (
              <span className="text-gray-300 text-lg select-none">⠿</span>
            )}
            <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center shrink-0">
              {idx + 1}
            </span>
            <span className="text-sm font-medium text-gray-800">{opt?.text ?? key}</span>
            {isRight && <span className="ml-auto text-green-500 font-bold">✓</span>}
            {isWrong && (
              <span className="ml-auto text-xs text-red-500">
                → {options.find((o) => o.key === correctOrder[idx])?.text}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ImageChoice({
  options, selected, checked, correctKey, onSelect,
}: {
  options: OptionItem[];
  selected: string;
  checked: boolean;
  correctKey: string | null;
  onSelect: (key: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {options.map((opt) => {
        const isSel = selected === opt.key;
        const isRight = checked && opt.key === correctKey;
        const isWrong = checked && isSel && opt.key !== correctKey;
        return (
          <button
            key={opt.key}
            onClick={() => !checked && onSelect(opt.key)}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
              isRight ? 'border-green-500 bg-green-50'
              : isWrong ? 'border-red-500 bg-red-50'
              : isSel ? 'border-amber-400 bg-amber-50'
              : 'border-gray-200 bg-white hover:border-amber-300'
            } ${checked ? 'cursor-default' : 'cursor-pointer'}`}
          >
            {opt.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={opt.imageUrl} alt={opt.text} className="w-full h-16 object-contain rounded" />
            ) : (
              <div className="w-full h-16 rounded bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-600">
                {opt.key}
              </div>
            )}
            <span className="text-xs font-medium text-gray-700">{opt.text}</span>
            {isRight && <span className="text-green-600 text-xs font-bold">✓ Đúng</span>}
            {isWrong && <span className="text-red-600 text-xs font-bold">✗ Sai</span>}
          </button>
        );
      })}
    </div>
  );
}

type Line = { x1: number; y1: number; x2: number; y2: number; color: string; dash?: boolean };

function Matching({
  options,
  userMap,
  checked,
  correctMap,
  onChange,
}: {
  options: OptionItem[];
  userMap: Record<string, string>;
  checked: boolean;
  correctMap: Record<string, string>;
  onChange: (map: Record<string, string>) => void;
}) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [svgSize, setSvgSize] = useState({ w: 0, h: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const leftRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const rightRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const rightItems = useState<string[]>(() => {
    // prefer pair field on option, fall back to correctMap values
    const hasPair = options.some((o) => !!o.pair);
    const items = hasPair
      ? options.map((o) => o.pair ?? '').filter(Boolean)
      : options.map((o) => correctMap[o.key] ?? '').filter(Boolean);
    // deduplicate while preserving order
    const unique = [...new Set(items)];
    for (let i = unique.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [unique[i], unique[j]] = [unique[j], unique[i]];
    }
    return unique;
  })[0];

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const cRect = container.getBoundingClientRect();
    setSvgSize({ w: cRect.width, h: cRect.height });

    const newLines: Line[] = [];
    options.forEach((opt, leftIdx) => {
      const matched = userMap[opt.key];
      if (!matched) return;
      const rightIdx = rightItems.indexOf(matched);
      const leftEl = leftRefs.current[leftIdx];
      const rightEl = rightRefs.current[rightIdx];
      if (!leftEl || !rightEl) return;
      const lRect = leftEl.getBoundingClientRect();
      const rRect = rightEl.getBoundingClientRect();
      const x1 = lRect.right - cRect.left;
      const y1 = lRect.top + lRect.height / 2 - cRect.top;
      const x2 = rRect.left - cRect.left;
      const y2 = rRect.top + rRect.height / 2 - cRect.top;
      let color = '#3b82f6';
      if (checked) color = correctMap[opt.key] === matched ? '#22c55e' : '#ef4444';
      newLines.push({ x1, y1, x2, y2, color });
    });
    setLines(newLines);
  }, [userMap, checked, options, rightItems]);

  const handleLeftClick = (key: string) => {
    if (checked) return;
    setSelectedLeft((prev) => (prev === key ? null : key));
  };

  const handleRightClick = (rightText: string) => {
    if (checked || !selectedLeft) return;
    // if right already connected, swap: remove old connection
    const newMap = { ...userMap };
    // remove any left that already points to this right
    Object.keys(newMap).forEach((k) => { if (newMap[k] === rightText) delete newMap[k]; });
    newMap[selectedLeft] = rightText;
    onChange(newMap);
    setSelectedLeft(null);
  };

  const connectedRights = Object.values(userMap);

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-400 mb-1">Chọn vế trái rồi chọn vế phải để nối</p>
      <div ref={containerRef} className="relative flex gap-2">
        {/* SVG overlay for lines */}
        <svg
          className="absolute inset-0 pointer-events-none"
          width={svgSize.w}
          height={svgSize.h}
          style={{ overflow: 'visible' }}
        >
          {lines.map((ln, i) => {
            const mx = (ln.x1 + ln.x2) / 2;
            return (
              <g key={i}>
                <path
                  d={`M ${ln.x1} ${ln.y1} C ${mx} ${ln.y1} ${mx} ${ln.y2} ${ln.x2} ${ln.y2}`}
                  fill="none"
                  stroke={ln.color}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  opacity={0.85}
                />
                <circle cx={ln.x1} cy={ln.y1} r={4} fill={ln.color} opacity={0.9} />
                <circle cx={ln.x2} cy={ln.y2} r={4} fill={ln.color} opacity={0.9} />
              </g>
            );
          })}
        </svg>

        {/* Left column */}
        <div className="flex-1 space-y-2">
          {options.map((opt, idx) => {
            const isSelected = selectedLeft === opt.key;
            const matched = userMap[opt.key];
            const isCorrect = checked && correctMap[opt.key] === matched;
            const isWrong = checked && !!matched && correctMap[opt.key] !== matched;
            return (
              <button
                key={opt.key}
                ref={(el) => { leftRefs.current[idx] = el; }}
                onClick={() => handleLeftClick(opt.key)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-medium text-left transition-all ${
                  isCorrect ? 'border-green-500 bg-green-50 text-green-800'
                  : isWrong ? 'border-red-400 bg-red-50 text-red-800'
                  : isSelected ? 'border-amber-400 bg-amber-50 text-amber-800 shadow-md'
                  : matched ? 'border-blue-400 bg-blue-50 text-blue-800'
                  : 'border-gray-200 bg-white text-gray-800 hover:border-amber-300'
                } ${checked ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <span className="flex-1">{opt.text}</span>
                {isCorrect && <span className="text-green-600 shrink-0 text-base">✓</span>}
                {isWrong && <span className="text-red-500 shrink-0 text-base">✗</span>}
              </button>
            );
          })}
        </div>

        {/* Spacer for lines */}
        <div className="w-12 shrink-0" />

        {/* Right column */}
        <div className="flex-1 space-y-2">
          {rightItems.map((rightText, idx) => {
            const isConnected = connectedRights.includes(rightText);
            const ownerKey = Object.keys(userMap).find((k) => userMap[k] === rightText);
            const isCorrect = checked && !!ownerKey && correctMap[ownerKey] === rightText;
            const isWrong = checked && !!ownerKey && correctMap[ownerKey] !== rightText;
            const isTarget = !checked && !!selectedLeft && !isConnected;
            return (
              <button
                key={rightText}
                ref={(el) => { rightRefs.current[idx] = el; }}
                onClick={() => handleRightClick(rightText)}
                disabled={checked}
                className={`w-full px-3 py-2.5 rounded-xl border-2 text-sm font-medium text-left transition-all ${
                  isCorrect ? 'border-green-500 bg-green-50 text-green-800'
                  : isWrong ? 'border-red-400 bg-red-50 text-red-800'
                  : isConnected ? 'border-blue-400 bg-blue-50 text-blue-800'
                  : isTarget ? 'border-amber-300 bg-amber-50 text-gray-700 hover:border-amber-400'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                } ${checked ? 'cursor-default' : 'cursor-pointer'}`}
              >
                {rightText}
                {isCorrect && <span className="ml-1 text-green-600">✓</span>}
                {isWrong && ownerKey && (
                  <span className="ml-1 text-xs text-red-500">(đúng: {correctMap[ownerKey]})</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── TTS ─────────────────────────────────────────────────────────────────────

function preprocessTTS(text: string): string {
  return text
    .replace(/_{2,}/g, 'mấy')          // ___ → mấy
    .replace(/\?/g, '')                 // bỏ dấu ?
    .replace(/[+＋]/g, ' cộng ')
    .replace(/[-−–]/g, ' trừ ')
    .replace(/[×✕*＊·]/g, ' nhân ')
    .replace(/[÷]/g, ' chia ')
    .replace(/=/g, ' bằng ')
    .replace(/</g, ' nhỏ hơn ')
    .replace(/>/g, ' lớn hơn ')
    .replace(/≤/g, ' nhỏ hơn hoặc bằng ')
    .replace(/≥/g, ' lớn hơn hoặc bằng ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function speak(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(preprocessTTS(text));
  u.rate = 0.85;

  const trySpeak = () => {
    const voices = window.speechSynthesis.getVoices();
    const vi = voices.find((v) => v.lang.startsWith('vi'));
    if (vi) u.voice = vi;
    u.lang = vi ? vi.lang : 'vi-VN';
    window.speechSynthesis.speak(u);
  };

  // voices may not be loaded yet on first call
  if (window.speechSynthesis.getVoices().length > 0) {
    trySpeak();
  } else {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.onvoiceschanged = null;
      trySpeak();
    };
  }
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
  // resolved numeric lessonId (fetched from slug if needed)
  const [resolvedLessonId, setResolvedLessonId] = useState<string>(lessonIdProp ?? '');

  const [exercise, setExercise] = useState<ExerciseData | null>(null);
  const [allExercises, setAllExercises] = useState<AllExercisesData['exercises']>([]);
  const [lesson, setLesson] = useState<LessonMeta | null>(null);
  const [loading, setLoading] = useState(true);

  const [current, setCurrent] = useState(0);
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [score, setScore] = useState(0);
  const [soundOn, setSoundOn] = useState(true);

  // per-question answer state
  const [singleSel, setSingleSel] = useState<Record<number, string>>({});
  const [multiSel, setMultiSel] = useState<Record<number, string[]>>({});
  const [tfSel, setTfSel] = useState<Record<number, string>>({});
  const [dragOrder, setDragOrder] = useState<Record<number, string[]>>({});
  const [matchMap, setMatchMap] = useState<Record<number, Record<string, string>>>({});
  const [celebrate, setCelebrate] = useState<'correct' | 'wrong' | null>(null);
  const [celebrateMsg, setCelebrateMsg] = useState('');

  const correctAudio = useRef<HTMLAudioElement | null>(null);
  const wrongAudio = useRef<HTMLAudioElement | null>(null);

  // Auto-play question audio (or TTS) when navigating to a new question
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
        exData.quizzes.forEach((q) => {
          if (q.questionType === 'drag_drop' && Array.isArray(q.optionsJson)) {
            initDrag[q.id] = q.optionsJson.map((o) => o.key);
          }
        });
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
        buildExerciseUrl(lesson.slug, resolvedLessonId, target.difficultyLevel as 'easy' | 'medium' | 'hard') +
          `?ex=${num}`,
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
  const options: OptionItem[] = Array.isArray(q.optionsJson) ? q.optionsJson : [];
  const isChecked = !!checked[q.id];
  const diffColor = DIFF_COLOR[exercise.difficultyLevel] || '#E8871A';
  const totalPoints = exercise.quizzes.reduce((s, qz) => s + (qz.points || 10), 0);

  // Derive correct answer
  const correctKey = typeof q.correctAnswerJson === 'string' ? q.correctAnswerJson : null;
  const correctKeys = Array.isArray(q.correctAnswerJson) ? (q.correctAnswerJson as string[]) : [];
  const correctBool = typeof q.correctAnswerJson === 'boolean' ? q.correctAnswerJson : null;
  const correctDragOrder = Array.isArray(q.correctAnswerJson) ? (q.correctAnswerJson as string[]) : [];

  // Check if current answer is correct
  const correctMatchMap = (typeof q.correctAnswerJson === 'object' && q.correctAnswerJson !== null && !Array.isArray(q.correctAnswerJson))
    ? q.correctAnswerJson as Record<string, string>
    : {};

  const isAnswerCorrect = () => {
    switch (q.questionType) {
      case 'single_choice':
      case 'image_choice':
        return singleSel[q.id] === correctKey;
      case 'multiple_choice': {
        const sel = multiSel[q.id] ?? [];
        const correctSet = new Set(correctKeys);
        const selSet = new Set(sel);
        return selSet.size === correctSet.size && [...correctSet].every((k) => selSet.has(k));
      }
      case 'true_false':
        return (tfSel[q.id] === 'true') === correctBool;
      case 'drag_drop': {
        const order = dragOrder[q.id] ?? [];
        return JSON.stringify(order) === JSON.stringify(correctDragOrder);
      }
      case 'matching': {
        const map = matchMap[q.id] ?? {};
        return options.every((o) => map[o.key] === correctMatchMap[o.key]);
      }
      default:
        return false;
    }
  };

  const hasAnswer = () => {
    switch (q.questionType) {
      case 'single_choice':
      case 'image_choice': return !!singleSel[q.id];
      case 'multiple_choice': return (multiSel[q.id]?.length ?? 0) > 0;
      case 'true_false': return !!tfSel[q.id];
      case 'drag_drop': return true;
      case 'matching': return Object.keys(matchMap[q.id] ?? {}).length === options.length;
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
      if (soundOn) {
        correctAudio.current?.play().catch(() => {});
        setTimeout(() => speak(msg), 600);
      }
    } else {
      const msg = ENCOURAGE_WRONG[Math.floor(Math.random() * ENCOURAGE_WRONG.length)];
      setCelebrateMsg(msg);
      setCelebrate('wrong');
      setTimeout(() => setCelebrate(null), 1800);
      if (soundOn) {
        wrongAudio.current?.play().catch(() => {});
        setTimeout(() => speak(msg), 600);
      }
    }
  };

  const handleNext = () => {
    if (current < exercise.quizzes.length - 1) {
      setCurrent((c) => c + 1);
    }
  };

  const isCurrentCorrect = isChecked && isAnswerCorrect();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #4db8b8 0%, #6ec6c6 50%, #5bbaba 100%)' }}>

      <audio ref={correctAudio} src="/sounds/correct.mp3" preload="auto" />
      <audio ref={wrongAudio} src="/sounds/wrong.mp3" preload="auto" />

      {/* Top bar: Breadcrumb + Exercise selector */}
      <div className="w-full px-4 sm:px-6 py-3" style={{ background: 'rgba(0,0,0,0.08)', backdropFilter: 'blur(4px)' }}>
        <div className="max-w-6xl mx-auto flex items-center gap-3 flex-wrap">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-white/85 flex-wrap flex-1 min-w-0">
            <Link href="/" className="hover:text-white transition-colors shrink-0 font-medium">Trang chủ</Link>
            {lesson?.course && (
              <>
                <span className="text-white/40 text-xs">›</span>
                <Link href={`/khoa-hoc/${lesson.course.slug}`} className="hover:text-white transition-colors truncate max-w-[120px] font-medium">
                  {lesson.course.title}
                </Link>
              </>
            )}
            {lesson && (
              <>
                <span className="text-white/40 text-xs">›</span>
                <Link href={lesson.slug ? `/${lesson.slug}` : `/lessons/${resolvedLessonId}`} className="hover:text-white transition-colors truncate max-w-[180px] font-medium">
                  {lesson.title}
                </Link>
              </>
            )}
            <span className="text-white/40 text-xs">›</span>
            <span className="font-bold text-white shrink-0">{DIFF_LABEL[exercise.difficultyLevel]}</span>
          </nav>

          {/* Exercise selector */}
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
                      style={{
                        background: isActive ? colors[ex.difficultyLevel] : 'rgba(255,255,255,0.2)',
                        color: 'white',
                        outline: isActive ? `2px solid white` : '2px solid transparent',
                        outlineOffset: '2px',
                      }}>
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

        {/* Left sidebar — question navigator */}
        <div className="hidden md:flex flex-col w-12 bg-white rounded-2xl overflow-hidden shadow-md shrink-0">
          <div className="text-center text-xs font-bold py-2 text-white rounded-t-2xl" style={{ background: diffColor }}>KQ</div>
          {exercise.quizzes.map((qz, idx) => {
            const done = !!checked[qz.id];
            const ok = done && (() => {
              const ck = typeof qz.correctAnswerJson === 'string' ? qz.correctAnswerJson : null;
              if (qz.questionType === 'single_choice' || qz.questionType === 'image_choice')
                return singleSel[qz.id] === ck;
              if (qz.questionType === 'true_false')
                return (tfSel[qz.id] === 'true') === (qz.correctAnswerJson === true);
              if (qz.questionType === 'multiple_choice') {
                const cks = Array.isArray(qz.correctAnswerJson) ? qz.correctAnswerJson as string[] : [];
                const sel = multiSel[qz.id] ?? [];
                return sel.length === cks.length && cks.every((k) => sel.includes(k));
              }
              if (qz.questionType === 'drag_drop') {
                const co = Array.isArray(qz.correctAnswerJson) ? qz.correctAnswerJson as string[] : [];
                return JSON.stringify(dragOrder[qz.id] ?? []) === JSON.stringify(co);
              }
              if (qz.questionType === 'matching') {
                const cm = (typeof qz.correctAnswerJson === 'object' && qz.correctAnswerJson && !Array.isArray(qz.correctAnswerJson))
                  ? qz.correctAnswerJson as Record<string, string> : {};
                const um = matchMap[qz.id] ?? {};
                const opts2 = Array.isArray(qz.optionsJson) ? qz.optionsJson as OptionItem[] : [];
                return opts2.every((o) => um[o.key] === cm[o.key]);
              }
              return false;
            })();
            const canNavigate = idx <= current || done;
            return (
              <button key={qz.id} onClick={() => canNavigate && setCurrent(idx)} disabled={!canNavigate}
                className={`text-sm font-bold py-2.5 border-b border-gray-100 transition-colors last:border-0 ${
                  idx === current ? 'text-white' : done ? 'text-white' : 'text-gray-300 cursor-not-allowed'
                }`}
                style={{
                  background: idx === current ? diffColor : done ? (ok ? '#22c55e' : '#ef4444') : 'transparent',
                }}>
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Main card */}
        <div className="flex-1 max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Card header */}
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100" style={{ background: `${diffColor}15` }}>
            <span className="px-3 py-1 rounded-lg text-white text-sm font-bold" style={{ background: diffColor }}>
              Câu {current + 1}/{exercise.quizzes.length}
            </span>
            <span className="text-gray-600 font-medium text-sm">
              {q.questionType === 'true_false' ? 'Chọn Đúng hoặc Sai'
               : q.questionType === 'drag_drop' ? 'Kéo thả sắp xếp thứ tự đúng'
               : q.questionType === 'multiple_choice' ? 'Chọn tất cả đáp án đúng'
               : q.questionType === 'matching' ? 'Nối các cặp tương ứng'
               : 'Chọn đáp án đúng nhất'}
            </span>
            {/* Progress bar */}
            <div className="ml-auto w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${((current + 1) / exercise.quizzes.length) * 100}%`, background: diffColor }} />
            </div>
          </div>

          <div className="px-5 py-5">
            {/* Question */}
            <div className="flex items-start gap-3 mb-5">
              <button
                onClick={() => { if (q.questionAudioUrl) playAudio(q.questionAudioUrl); else speak(q.questionText); }}
                className="shrink-0 w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center hover:bg-teal-600 shadow-md transition-colors"
                title="Nghe câu hỏi"
              >
                <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5 ml-0.5"><path d="M8 5v14l11-7z"/></svg>
              </button>
              <p className="text-lg font-semibold text-gray-800 leading-snug">{q.questionText}</p>
            </div>

            {q.questionImageUrl && (
              <div className="flex justify-center mb-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={q.questionImageUrl} alt="question" className="max-h-52 rounded-xl object-contain border border-gray-100 shadow-sm" />
              </div>
            )}

            {/* Answer area */}
            <div className="mb-5">
              {(q.questionType === 'single_choice') && (
                <SingleChoice options={options} selected={singleSel[q.id] ?? ''}
                  checked={isChecked} correctKey={correctKey}
                  onSelect={(k) => setSingleSel((p) => ({ ...p, [q.id]: k }))} />
              )}
              {q.questionType === 'image_choice' && (
                <ImageChoice options={options} selected={singleSel[q.id] ?? ''}
                  checked={isChecked} correctKey={correctKey}
                  onSelect={(k) => setSingleSel((p) => ({ ...p, [q.id]: k }))} />
              )}
              {q.questionType === 'multiple_choice' && (
                <MultipleChoice options={options} selected={multiSel[q.id] ?? []}
                  checked={isChecked} correctKeys={correctKeys}
                  onToggle={(k) => {
                    const cur = multiSel[q.id] ?? [];
                    setMultiSel((p) => ({ ...p, [q.id]: cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k] }));
                  }} />
              )}
              {q.questionType === 'true_false' && (
                <TrueFalse selected={tfSel[q.id] ?? ''} checked={isChecked}
                  correctAnswer={correctBool}
                  onSelect={(v) => setTfSel((p) => ({ ...p, [q.id]: v }))} />
              )}
              {q.questionType === 'drag_drop' && (
                <DragDrop options={options} order={dragOrder[q.id] ?? options.map((o) => o.key)}
                  checked={isChecked} correctOrder={correctDragOrder}
                  onReorder={(newOrder) => setDragOrder((p) => ({ ...p, [q.id]: newOrder }))} />
              )}
              {q.questionType === 'matching' && (
                <Matching options={options} userMap={matchMap[q.id] ?? {}}
                  checked={isChecked} correctMap={correctMatchMap}
                  onChange={(map) => setMatchMap((p) => ({ ...p, [q.id]: map }))} />
              )}
            </div>

            {/* Explanation */}
            {isChecked && (
              <div className={`mb-4 px-4 py-3 rounded-2xl text-sm flex items-start gap-3 border-l-4 ${
                isCurrentCorrect
                  ? 'bg-green-50 border-green-400 text-green-800'
                  : 'bg-red-50 border-red-400 text-red-800'
              }`}>
                <span className="text-xl shrink-0 mt-0.5">{isCurrentCorrect ? '✅' : '❌'}</span>
                <div>
                  <p className="font-bold text-base mb-0.5">{isCurrentCorrect ? 'Chính xác!' : 'Chưa đúng!'}</p>
                  {q.explanation && <p className="opacity-80 leading-snug">{q.explanation}</p>}
                  {q.explanationAudioUrl && (
                    <button onClick={() => playAudio(q.explanationAudioUrl)}
                      className="mt-1.5 inline-flex items-center gap-1 text-xs underline opacity-70 hover:opacity-100">
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
          {/* Score */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-md">
            <div className="text-white text-center text-xs font-bold py-2 rounded-t-2xl" style={{ background: diffColor }}>Điểm</div>
            <div className="text-center py-3">
              <div className="text-3xl font-black text-amber-500">{score}</div>
              <div className="text-xs text-gray-400">/ {totalPoints}</div>
            </div>
          </div>

          {/* Progress */}
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

          {/* Sound toggle */}
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          style={{ animation: 'celebFade 1.8s ease forwards' }}
        >
          <style>{`
            @keyframes celebFade {
              0% { opacity: 0; transform: scale(0.7); }
              15% { opacity: 1; transform: scale(1.08); }
              30% { transform: scale(1); }
              70% { opacity: 1; }
              100% { opacity: 0; transform: scale(1.1); }
            }
            @keyframes starPulse {
              0%, 100% { transform: scale(1) rotate(0deg); }
              50% { transform: scale(1.04) rotate(3deg); }
            }
            @keyframes bounceIn {
              0% { transform: translateY(-20px) scale(0.8); opacity: 0; }
              60% { transform: translateY(4px) scale(1.05); opacity: 1; }
              100% { transform: translateY(0) scale(1); opacity: 1; }
            }
          `}</style>
          <div className="relative flex flex-col items-center justify-center">
            {/* Starburst */}
            <div
              className="absolute"
              style={{
                width: 340, height: 340,
                background: '#fffde7',
                clipPath: 'polygon(50% 0%,55% 18%,61% 5%,63% 24%,72% 13%,71% 32%,83% 23%,79% 41%,93% 36%,86% 52%,100% 51%,91% 64%,100% 68%,88% 77%,95% 84%,80% 88%,84% 97%,69% 97%,70% 100%,57% 96%,55% 100%,45% 96%,43% 100%,30% 97%,31% 97%,16% 97%,20% 88%,5% 84%,12% 77%,0% 68%,9% 64%,0% 51%,14% 52%,7% 36%,21% 41%,17% 23%,29% 32%,28% 13%,37% 24%,39% 5%,45% 18%)',
                animation: 'starPulse 0.7s ease infinite',
              }}
            />
            <div
              className="absolute"
              style={{
                width: 340, height: 340,
                background: 'rgba(255,253,210,0.6)',
                clipPath: 'polygon(50% 0%,55% 18%,61% 5%,63% 24%,72% 13%,71% 32%,83% 23%,79% 41%,93% 36%,86% 52%,100% 51%,91% 64%,100% 68%,88% 77%,95% 84%,80% 88%,84% 97%,69% 97%,70% 100%,57% 96%,55% 100%,45% 96%,43% 100%,30% 97%,31% 97%,16% 97%,20% 88%,5% 84%,12% 77%,0% 68%,9% 64%,0% 51%,14% 52%,7% 36%,21% 41%,17% 23%,29% 32%,28% 13%,37% 24%,39% 5%,45% 18%)',
                transform: 'rotate(20deg)',
              }}
            />

            {/* Content */}
            <div className="relative flex flex-col items-center gap-1 px-6 pt-2">
              {/* Decorative image at top */}
              <div
                className="text-5xl select-none mb-1"
                style={{ animation: 'bounceIn 0.4s ease forwards', filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.2))' }}
              >
                {celebrate === 'correct' ? '🌟🎉🌟' : '🌶️🫑🌶️'}
              </div>

              <p
                className="text-4xl font-black text-center leading-tight px-4"
                style={celebrate === 'correct' ? {
                  color: '#4caf50',
                  WebkitTextStroke: '2px #1b5e20',
                  textShadow: '3px 3px 0 #1b5e20',
                  fontFamily: 'sans-serif',
                } : {
                  color: '#e53935',
                  WebkitTextStroke: '2px #7f0000',
                  textShadow: '3px 3px 0 #b71c1c',
                  fontFamily: 'sans-serif',
                }}
              >
                {celebrateMsg}
              </p>

              <span
                className="text-7xl select-none mt-1"
                style={{ filter: 'drop-shadow(2px 4px 8px rgba(0,0,0,0.25))' }}
              >
                {celebrate === 'correct' ? '😉👌' : '🤦'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
