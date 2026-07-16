'use client';

import { createContext, memo, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { apiFetch } from '../../lib/api';
import { recordAttempt, getCurrentChildId, wrongQuizIdsFor } from '../../lib/childData';
import { buildExerciseUrl, DIFF_TO_SLUG } from '../../lib/quiz-slug';
import NumberTrace from './NumberTrace';
import LetterTracingGame, { type LetterTracingGameRef } from '../../games/letter-tracing/LetterTracingGame';
import QuestionLetterTracing, { type QuestionLetterTracingRef } from './QuestionLetterTracing';
import QuestionTraceSentence, { type QuestionTraceSentenceRef } from './QuestionTraceSentence';
import confetti from 'canvas-confetti';

const KidsCtx = createContext(false);
const useKids = () => useContext(KidsCtx);

// Returns true if text looks like a number or math expression (not plain words)
const MATH_CHARS_RE = /^[\d\s+*/:=<>≤≥≠.,()%^√π×÷-]+$/;
// Định dạng giây → MM:SS.
function fmtClock(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function isMathText(text: string | undefined | null): boolean {
  if (!text) return false;
  return MATH_CHARS_RE.test(text.trim());
}

function formatMath(text: string | undefined | null): string {
  if (!text) return '';
  if (!isMathText(text)) return text;
  return text
    .replace(/\s*([+\-×÷*/:=<>≤≥≠])\s*/g, ' $1 ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

// ─── Hình học: tự VẼ hình khi đáp án là TÊN hình (bài nhận dạng hình không có ảnh) ──
type ShapeKind = 'circle' | 'square' | 'triangle' | 'rectangle' | 'oval' | 'star' | 'heart' | 'diamond';
function shapeOf(text: string | undefined | null): ShapeKind | null {
  const t = String(text || '').toLowerCase().trim().replace(/\s+/g, ' ').replace(/[.!?]+$/, '');
  const MAP: Record<string, ShapeKind> = {
    'hình tròn': 'circle', 'tròn': 'circle',
    'hình vuông': 'square', 'vuông': 'square',
    'tam giác': 'triangle', 'hình tam giác': 'triangle',
    'hình chữ nhật': 'rectangle', 'chữ nhật': 'rectangle',
    'hình bầu dục': 'oval', 'bầu dục': 'oval', 'e-líp': 'oval', 'elip': 'oval',
    'hình thoi': 'diamond', 'thoi': 'diamond',
    'ngôi sao': 'star', 'hình ngôi sao': 'star', 'sao': 'star',
    'trái tim': 'heart', 'hình trái tim': 'heart', 'tim': 'heart',
  };
  return MAP[t] ?? null;
}

// Token đếm có thể là ký hiệu hình unicode (△, ○, □…) nhạt/khó nhìn → nhận diện để vẽ SVG rõ.
function tokenShape(text: string | undefined | null): ShapeKind | null {
  const t = String(text || '').trim();
  const UNI: Record<string, ShapeKind> = {
    '△': 'triangle', '▲': 'triangle', '▽': 'triangle', '▼': 'triangle', '◺': 'triangle', '🔺': 'triangle', '🔻': 'triangle',
    '○': 'circle', '◯': 'circle', '●': 'circle', '⚪': 'circle', '⭕': 'circle', '🔴': 'circle', '🔵': 'circle', '🟢': 'circle',
    '□': 'square', '■': 'square', '◻': 'square', '◼': 'square', '🟦': 'square', '🟥': 'square', '🟩': 'square', '⬜': 'square', '⬛': 'square',
    '▭': 'rectangle', '▬': 'rectangle',
    '◇': 'diamond', '◆': 'diamond', '🔶': 'diamond', '🔷': 'diamond',
    '★': 'star', '☆': 'star', '⭐': 'star', '🌟': 'star',
    '♥': 'heart', '❤': 'heart', '❤️': 'heart', '♡': 'heart', '💛': 'heart', '💙': 'heart',
  };
  return UNI[t] ?? shapeOf(t);
}

// Lấy giá trị số trong ngoặc cuối của đáp án: "Tam giác (3)" → 3, "Hình chữ nhật 4×3 (12cm²)" → 12.
function parenValue(text: string | undefined): number | null {
  const m = String(text || '').match(/\(([^)]*)\)\s*$/);
  if (!m) return null;
  const num = m[1].match(/-?[\d]+(?:[.,]\d+)?/);
  return num ? parseFloat(num[0].replace(',', '.')) : null;
}

/**
 * Chấm câu sắp xếp/kéo thả. Nếu MỌI đáp án đều có giá trị số (vd "(3)", "(4)"),
 * chấm theo DÃY GIÁ TRỊ → chấp nhận hoán vị các đáp án bằng nhau (vuông 4 ↔ chữ nhật 4).
 * Ngược lại (sắp xếp câu, từ…) so khớp thứ tự chính xác như cũ.
 */
function sortingMatches(userOrder: string[], correctOrder: string[], options?: OptionItem[]): boolean {
  const u = userOrder ?? [];
  const c = correctOrder ?? [];
  if (u.length !== c.length || c.length === 0) return JSON.stringify(u) === JSON.stringify(c);
  if (Array.isArray(options) && options.length) {
    const valOf = (k: string) => parenValue(options.find((o) => o.key === k)?.text);
    const uv = u.map(valOf);
    const cv = c.map(valOf);
    if (uv.every((v) => v !== null) && cv.every((v) => v !== null)) {
      return JSON.stringify(uv) === JSON.stringify(cv);
    }
  }
  return JSON.stringify(u) === JSON.stringify(c);
}

// Quét tên hình xuất hiện trong ĐỀ BÀI để vẽ minh họa (câu Đúng/Sai, câu hỏi về 1 hình…).
function shapesInText(text: string | undefined | null): ShapeKind[] {
  const t = String(text || '').toLowerCase();
  const PHRASES: [RegExp, ShapeKind][] = [
    [/hình\s*chữ\s*nhật|chữ\s*nhật/, 'rectangle'],
    [/tam\s*giác/, 'triangle'],
    [/hình\s*vuông/, 'square'],
    [/hình\s*tròn/, 'circle'],
    [/hình\s*thoi/, 'diamond'],
    [/hình\s*bầu\s*dục|e-?líp|elip/, 'oval'],
    [/ngôi\s*sao/, 'star'],
    [/trái\s*tim/, 'heart'],
  ];
  const found: ShapeKind[] = [];
  for (const [re, sh] of PHRASES) if (re.test(t) && !found.includes(sh)) found.push(sh);
  return found;
}

const SHAPE_COLOR: Record<ShapeKind, string> = {
  circle: '#3b82f6', square: '#a855f7', triangle: '#ef4444', rectangle: '#f97316',
  oval: '#06b6d4', diamond: '#e11d48', star: '#f59e0b', heart: '#ec4899',
};

// ─── Emoji thay ảnh: câu nhắc con vật/đồ vật/quả mà chưa có ảnh → hiện emoji minh họa ──
// Cụm nhiều từ để TRƯỚC (khớp dài nhất) để "cá heo" không bị "cá" nuốt mất.
const NOUN_EMOJI: [string, string][] = [
  // con vật
  ['cá heo','🐬'],['cá mập','🦈'],['bạch tuộc','🐙'],['gà con','🐤'],['gà gô','🐔'],['gà giò','🐔'],['sơn ca','🐦'],['chào mào','🐦'],['chim sâu','🐦'],['chim sẻ','🐦'],['bồ câu','🕊️'],['cào cào','🦗'],['châu chấu','🦗'],['dế mèn','🦗'],
  ['con gà','🐔'],['con vịt','🦆'],['con chó','🐕'],['con mèo','🐈'],['con voi','🐘'],['con hươu','🦒'],['con ngựa','🐴'],['con trâu','🐃'],['con bò','🐄'],['con lợn','🐷'],['con heo','🐷'],['con thỏ','🐰'],['con gấu','🐻'],['con khỉ','🐒'],['con hổ','🐯'],['con cọp','🐯'],['sư tử','🦁'],['con cá','🐟'],['con cua','🦀'],['con tôm','🦐'],['con rùa','🐢'],['con ếch','🐸'],['con rắn','🐍'],['con chim','🐦'],['con ong','🐝'],['con bướm','🦋'],['con kiến','🐜'],['con nhện','🕷️'],['con chuột','🐭'],['con sóc','🐿️'],['con sói','🐺'],['con dê','🐐'],['con cừu','🐑'],['con nhím','🦔'],['con chồn','🦡'],['con quạ','🐦‍⬛'],['con vẹt','🦜'],['con công','🦚'],['con én','🐦'],['nòng nọc','🐸'],
  ['gà','🐔'],['vịt','🦆'],['chó','🐕'],['mèo','🐈'],['voi','🐘'],['hươu','🦒'],['ngựa','🐴'],['trâu','🐃'],['thỏ','🐰'],['gấu','🐻'],['khỉ','🐒'],['hổ','🐯'],['cọp','🐯'],['rùa','🐢'],['ếch','🐸'],['rắn','🐍'],['ong','🐝'],['bướm','🦋'],['kiến','🐜'],['nhện','🕷️'],['chuột','🐭'],['sóc','🐿️'],['nhím','🦔'],['chồn','🦡'],['quạ','🐦‍⬛'],['vẹt','🦜'],['nhái','🐸'],
  // quả / cây / hoa
  ['quả cam','🍊'],['quả táo','🍎'],['quả chuối','🍌'],['quả nho','🍇'],['dưa hấu','🍉'],['quả dâu','🍓'],['quả xoài','🥭'],['quả dứa','🍍'],['quả đào','🍑'],['quả lê','🍐'],['quả chanh','🍋'],['quả dừa','🥥'],['cà chua','🍅'],['cà rốt','🥕'],['quả ớt','🌶️'],['quả bí','🎃'],['quả cà','🍆'],['củ khoai','🍠'],['cây nấm','🍄'],['bắp ngô','🌽'],
  ['hoa hồng','🌹'],['hoa mai','🌼'],['hoa đào','🌸'],['hoa sen','🪷'],['hoa cúc','🌼'],['dã quỳ','🌻'],['bông hoa','🌸'],
  ['cam','🍊'],['táo','🍎'],['chuối','🍌'],['nho','🍇'],['dâu','🍓'],['xoài','🥭'],['dứa','🍍'],['đào','🍑'],['lê','🍐'],['chanh','🍋'],['dừa','🥥'],['ngô','🌽'],['khoai','🍠'],['nấm','🍄'],['ớt','🌶️'],['sen','🪷'],['hoa','🌸'],['lá','🍃'],['cây','🌳'],
  // đồ vật / thiên nhiên
  ['bút chì','✏️'],['sách vở','📚'],['đèn pin','🔦'],['kính râm','🕶️'],['mặt trời','☀️'],['mặt trăng','🌙'],['ngôi sao','⭐'],['cầu vồng','🌈'],['quả bóng','⚽'],['bánh mì','🍞'],['mâm cơm','🍽️'],['đồng hồ','⏰'],['ô tô','🚗'],['xe đạp','🚲'],['xe máy','🏍️'],['xe buýt','🚌'],['máy bay','✈️'],['máy cày','🚜'],['tem thư','✉️'],['đầu bếp','👨‍🍳'],['bác sĩ','🧑‍⚕️'],['y tá','🧑‍⚕️'],['cô giáo','🧑‍🏫'],
  ['bút','✏️'],['sách','📚'],['vở','📓'],['cặp','🎒'],['thước','📏'],['đèn','💡'],['kính','👓'],['mũ','🧢'],['nón','👒'],['ô','☂️'],['dù','☂️'],['dép','🩴'],['giày','👟'],['áo','👕'],['quần','👖'],['khăn','🧣'],['tivi','📺'],['tàu','🚢'],['thuyền','⛵'],['nhà','🏠'],['trường','🏫'],['cầu','🌉'],['núi','⛰️'],['sông','🏞️'],['biển','🌊'],['mây','☁️'],['mưa','🌧️'],['sao','⭐'],['trăng','🌙'],['nắng','☀️'],['bóng','⚽'],['trống','🥁'],['đàn','🎸'],['chuông','🔔'],['kẹo','🍬'],['bánh','🍰'],['cơm','🍚'],['kem','🍦'],['trứng','🥚'],['sữa','🥛'],['cốc','🥤'],['nồi','🍲'],['tre','🎋'],['nến','🕯️'],
];

// Trả về emoji phù hợp nhất tìm thấy trong đoạn text (ưu tiên cụm dài).
function emojiForText(text: string | undefined | null): string | null {
  const t = String(text || '').toLowerCase();
  for (const [k, e] of NOUN_EMOJI) {
    // khớp theo biên từ để "lá" không dính trong "là", "cả"…
    if (new RegExp(`(^|[^a-zà-ỹ])${k}([^a-zà-ỹ]|$)`, 'i').test(t)) return e;
  }
  return null;
}

// Emoji minh họa cho ĐỀ BÀI: chỉ khi câu có ý "xem hình/tranh".
// Lấy danh từ trong đề; nếu đề không có (vd "Đây là con gì?") thì lấy theo ĐÁP ÁN ĐÚNG.
function questionEmoji(text: string | undefined | null, correctText?: string | null): string | null {
  const t = String(text || '');
  if (!/hình|tranh|quan sát|nhìn|con gì|quả gì|cái gì|con vật|đây là|chọn tên|chọn từ đúng|tô màu chữ/i.test(t)) return null;
  return emojiForText(t) || (correctText ? emojiForText(correctText) : null);
}

function ShapeSVG({ shape, color, size = 44 }: { shape: ShapeKind; color: string; size?: number }) {
  const fill = `${color}33`;
  const common = { fill, stroke: color, strokeWidth: 3, strokeLinejoin: 'round' as const };
  return (
    <svg width={size} height={size} viewBox="0 0 50 50" aria-hidden="true" className="shrink-0">
      {shape === 'circle' && <circle cx="25" cy="25" r="19" {...common} />}
      {shape === 'oval' && <ellipse cx="25" cy="25" rx="21" ry="14" {...common} />}
      {shape === 'square' && <rect x="7" y="7" width="36" height="36" rx="3" {...common} />}
      {shape === 'rectangle' && <rect x="4" y="13" width="42" height="24" rx="3" {...common} />}
      {shape === 'triangle' && <polygon points="25,6 45,44 5,44" {...common} />}
      {shape === 'diamond' && <polygon points="25,5 45,25 25,45 5,25" {...common} />}
      {shape === 'star' && <polygon points="25,4 31,18 46,19 34,29 38,44 25,36 12,44 16,29 4,19 19,18" {...common} />}
      {shape === 'heart' && <path d="M25 43C10 32 6 22 12 15c4-5 11-4 13 2 2-6 9-7 13-2 6 7 2 17-13 28z" {...common} />}
    </svg>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

type OptionItem = { key: string; text: string; audioUrl?: string; imageUrl?: string; pair?: string; pairImageUrl?: string };

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
    | 'puzzle' | 'game' | 'counting' | 'find_errors' | 'trace_number' | 'letter_tracing' | 'trace_sentence';
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

const SingleChoice = memo(function SingleChoice({ options, selected, checked, correctKey, onSelect, compact }: {
  options: OptionItem[]; selected: string; checked: boolean; correctKey: string | null; onSelect: (key: string) => void; compact?: boolean;
}) {
  // Tính font size CHUNG cho mọi đáp án dựa trên đáp án dài nhất → tất cả thẻ cùng size
  const maxLen = Math.max(...options.map((o) => {
    const t = typeof o === 'string' || typeof o === 'number' ? String(o) : String(o?.text ?? o?.key ?? '');
    return formatMath(t).length;
  }), 1);
  // Có đáp án là TÊN HÌNH → vẽ hình, hiển thị dạng lưới (hình trên, chữ dưới).
  const hasShape = options.some((o) => !o.imageUrl && shapeOf(o.text));
  // Đáp án chữ dài hoặc có ảnh → xếp thành HÀNG đầy đủ (dễ đọc trên mobile).
  // Đáp án ngắn/số (8, 9, 10…) → giữ lưới để chữ số hiển thị to.
  const allShortOrMath = options.every((o) => {
    const t = String(o?.text ?? o?.key ?? '');
    return !o.imageUrl && (isMathText(t) || t.trim().length <= 4);
  });
  const useRows = !allShortOrMath && !hasShape;
  const basis = useRows
    ? '100%'
    : options.length <= 2 ? 'calc(50% - 6px)' : options.length === 3 ? 'calc(33.333% - 8px)' : 'calc(50% - 6px)';
  const sharedBaseSize = compact
    ? (maxLen > 10 ? 16 : maxLen > 7 ? 22 : maxLen > 4 ? 28 : 34)
    : (maxLen > 14 ? 18 : maxLen > 10 ? 24 : maxLen > 7 ? 30 : maxLen > 4 ? 36 : 44);
  return (
    <div className={`flex ${useRows ? 'flex-col' : 'flex-wrap justify-center'} ${compact ? 'gap-2' : 'gap-3'}`}>
      {options.map((opt, idx) => {
        const isSel = selected === opt.key;
        const isRight = checked && opt.key === correctKey;
        const isWrong = checked && isSel && opt.key !== correctKey;
        const baseColor = OPTION_COLORS[idx % OPTION_COLORS.length];
        const animClass = isRight ? 'kid-bounce' : isWrong ? 'kid-shake' : '';
        return (
          <button key={opt.key ?? `opt-${idx}`}
            onClick={() => { if (!checked) { onSelect(opt.key); if (opt.audioUrl) playAudio(opt.audioUrl); else speak(opt.text); } }}
            style={{
              flexBasis: basis,
              maxWidth: basis,
              borderWidth: 3,
              borderStyle: 'solid',
              borderColor: isRight ? '#22c55e' : isWrong ? '#ef4444' : isSel ? baseColor : baseColor,
              borderRadius: 20,
              background: isRight ? '#f0fdf4' : isWrong ? '#fef2f2' : isSel ? `${baseColor}15` : '#ffffff',
              boxShadow: isSel && !checked ? `0 6px 0 ${baseColor}, 0 8px 16px ${baseColor}40` : `0 4px 0 ${baseColor}aa`,
              transform: isSel && !checked ? 'translateY(-2px)' : 'translateY(0)',
              transition: 'all 0.15s',
              cursor: checked ? 'default' : 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: useRows ? 'flex-start' : 'center',
              justifyContent: 'center',
              textAlign: useRows ? 'left' : 'center',
              overflow: 'hidden',  // chống số dài tràn ra ngoài card
            }}
            className={`relative hover:-translate-y-1 ${animClass} ${
              useRows
                ? 'min-h-[56px] px-4 py-3'          // hàng gọn cho đáp án chữ
                : compact ? 'min-h-[60px] px-2 py-2' : 'min-h-[84px] px-2 py-2'
            }`}
          >
            {(() => {
              const idx2 = options.indexOf(opt);
              const optColor = isRight ? '#15803d' : isWrong ? '#b91c1c' : OPTION_COLORS[idx2 % OPTION_COLORS.length];
              const rawTxt = typeof opt === 'string' || typeof opt === 'number'
                ? String(opt)
                : (opt?.text ?? opt?.key ?? '');
              const txt = String(rawTxt) || String.fromCharCode(65 + idx2);
              const isMath = isMathText(txt);
              // Short text (≤4 chars, no image) → render BIG like math
              const isShort = !opt.imageUrl && txt.trim().length <= 4;
              const isBig = isMath || isShort;
              // Dùng sharedBaseSize → tất cả đáp án cùng font size
              // Font scale theo độ rộng card (vw) ÷ số ký tự để không tràn
              // 3 cột: card ≈ 28vw, 2 cột: card ≈ 42vw (sau gap)
              const cardVw = options.length === 3 ? 28 : 42;
              const fitVw = Math.max(4, Math.min(15, cardVw / Math.max(maxLen, 1)));
              const fontSizeCss = isBig
                ? `clamp(${Math.round(sharedBaseSize * 0.5)}px, ${fitVw.toFixed(1)}vw, ${sharedBaseSize}px)`
                : (compact ? '14px' : '18px');
              const shape = !opt.imageUrl ? shapeOf(txt) : null;
              return (
                <div className={`flex w-full min-w-0 gap-2 ${useRows ? 'flex-row items-center' : 'flex-col items-center justify-center gap-1'}`}>
                  {opt.imageUrl && (
                    <img
                      src={opt.imageUrl}
                      alt={txt}
                      className={useRows
                        ? 'h-11 w-11 shrink-0 rounded-lg object-contain'
                        : `w-full object-contain rounded-lg mb-1 ${compact ? 'max-h-14' : 'max-h-24 mb-2'}`}
                    />
                  )}
                  {shape && <ShapeSVG shape={shape} color={optColor} size={compact ? 40 : 56} />}
                  <div className={`flex min-w-0 max-w-full items-center gap-2 ${useRows ? 'flex-1' : 'w-full justify-center'}`}>
                    {opt.audioUrl && <AudioBtn url={opt.audioUrl} small />}
                    <span style={{
                      fontSize: useRows ? '17px' : fontSizeCss,
                      fontWeight: useRows ? 800 : (isBig ? 900 : 700),
                      color: isBig && !useRows ? optColor : (isRight ? '#15803d' : isWrong ? '#b91c1c' : '#1e293b'),
                      textShadow: isBig && !useRows && !checked && !isSel ? `1px 2px 0 ${optColor}55` : undefined,
                      letterSpacing: '-0.3px',
                      textAlign: useRows ? 'left' : 'center',
                      whiteSpace: isBig && !useRows ? 'nowrap' : 'pre-wrap',
                      wordBreak: isBig && !useRows ? 'keep-all' : 'break-word',
                      lineHeight: useRows ? 1.25 : 1,
                      maxWidth: '100%',
                      display: 'inline-block',
                    }}>{formatMath(txt)}</span>
                  </div>
                </div>
              );
            })()}
            {isRight && <span className="absolute top-1.5 right-2 text-green-500 font-black text-base">✓</span>}
            {isWrong && <span className="absolute top-1.5 right-2 text-red-500 font-black text-base">✗</span>}
          </button>
        );
      })}
    </div>
  );
});

const OPTION_COLORS = ['#3b82f6','#e53935','#9c27b0','#f97316','#0d9488','#7c3aed'];

const MultipleChoice = memo(function MultipleChoice({ options, selected, checked, correctKeys, onToggle, compact }: {
  options: OptionItem[]; selected: string[]; checked: boolean; correctKeys: string[]; onToggle: (key: string) => void; compact?: boolean;
}) {
  // Font size chung cho tất cả đáp án dựa trên option dài nhất
  const maxLen = Math.max(...options.map((o) => formatMath(String(o?.text ?? o?.key ?? '')).length), 1);
  const sharedBaseSize = compact
    ? (maxLen > 10 ? 16 : maxLen > 7 ? 22 : maxLen > 4 ? 28 : 34)
    : (maxLen > 14 ? 18 : maxLen > 10 ? 24 : maxLen > 7 ? 30 : maxLen > 4 ? 36 : 44);
  // Đáp án là tên hình → vẽ hình (lưới, hình trên chữ dưới).
  const hasShape = options.some((o) => !o.imageUrl && shapeOf(o.text));
  // Có ảnh hoặc chữ dài → xếp HÀNG (thẻ hẹp làm chữ tràn ra ngoài).
  const allShortOrMath = options.every((o) => {
    const t = String(o?.text ?? o?.key ?? '');
    return !o.imageUrl && (isMathText(t) || t.trim().length <= 4);
  });
  const useRows = !allShortOrMath && !hasShape;
  return (
    <div className={
      useRows
        ? `flex flex-col ${compact ? 'gap-2' : 'gap-2.5'}`
        : `grid ${compact ? 'gap-2' : 'gap-4'} ${options.length === 2 ? 'grid-cols-2' : options.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`
    }>
      {options.map((opt, idx) => {
        const isSel = selected.includes(opt.key);
        const isRight = checked && correctKeys.includes(opt.key);
        const isWrong = checked && isSel && !correctKeys.includes(opt.key);
        const baseColor = OPTION_COLORS[idx % OPTION_COLORS.length];
        const optColor = isRight ? '#15803d' : isWrong ? '#b91c1c' : baseColor;
        const animClass = isRight ? 'kid-bounce' : isWrong ? 'kid-shake' : '';
        return (
          <button key={opt.key ?? `opt-${idx}`}
            onClick={() => { if (!checked) { onToggle(opt.key); if (opt.audioUrl) playAudio(opt.audioUrl); else speak(opt.text); } }}
            style={{
              borderWidth: 3,
              borderStyle: 'solid',
              borderColor: isRight ? '#22c55e' : isWrong ? '#ef4444' : baseColor,
              borderRadius: 20,
              background: isRight ? '#f0fdf4' : isWrong ? '#fef2f2' : isSel ? `${baseColor}15` : '#ffffff',
              boxShadow: isSel && !checked ? `0 6px 0 ${baseColor}, 0 8px 16px ${baseColor}40` : `0 4px 0 ${baseColor}aa`,
              transform: isSel && !checked ? 'translateY(-2px)' : 'translateY(0)',
              transition: 'all 0.15s',
              cursor: checked ? 'default' : 'pointer',
            }}
            className={`relative flex hover:-translate-y-1 ${animClass} ${
              useRows
                ? 'flex-row items-center gap-3 overflow-hidden min-h-[56px] pl-4 pr-10 py-3 text-left'
                : `flex-col items-center justify-center overflow-hidden ${compact ? 'min-h-[60px] pl-2 pr-8 py-3' : 'min-h-[84px] pl-3 pr-10 py-6'}`
            }`}
          >
            {/* Checkbox indicator */}
            <span className={`absolute top-2 right-2 w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-black transition-all ${isSel ? 'border-amber-500 bg-amber-500 text-white' : 'border-gray-300 bg-white'}`}>
              {isSel && '✓'}
            </span>
            {!opt.imageUrl && shapeOf(opt.text) && (
              <ShapeSVG shape={shapeOf(opt.text)!} color={optColor} size={compact ? 40 : 56} />
            )}
            {opt.imageUrl && (
              <img
                src={opt.imageUrl}
                alt={opt.text}
                className={useRows
                  ? 'h-11 w-11 shrink-0 rounded-lg object-contain'
                  : `w-full object-contain rounded-lg ${compact ? 'max-h-14 mb-1' : 'max-h-24 mb-2'}`}
              />
            )}
            {opt.audioUrl && <AudioBtn url={opt.audioUrl} small />}
            {(() => {
              const txt = String(opt.text ?? opt.key ?? '');
              const isMath = isMathText(txt);
              const isShort = !opt.imageUrl && txt.trim().length <= 4;
              const isBig = isMath || isShort;
              // Font scale theo độ rộng card (vw) ÷ số ký tự để không tràn
              // 3 cột: card ≈ 28vw, 2 cột: card ≈ 42vw (sau gap)
              const cardVw = options.length === 3 ? 28 : 42;
              const fitVw = Math.max(4, Math.min(15, cardVw / Math.max(maxLen, 1)));
              const fontSizeCss = isBig
                ? `clamp(${Math.round(sharedBaseSize * 0.5)}px, ${fitVw.toFixed(1)}vw, ${sharedBaseSize}px)`
                : (compact ? '14px' : '18px');
              return (
                <span style={{
                  fontSize: useRows ? '17px' : fontSizeCss,
                  fontWeight: useRows ? 800 : (isBig ? 900 : 700),
                  color: isBig && !useRows ? optColor : (isRight ? '#15803d' : isWrong ? '#b91c1c' : '#1e293b'),
                  textShadow: isBig && !useRows && !checked && !isSel ? `2px 3px 0 ${optColor}55` : undefined,
                  letterSpacing: '-0.3px',
                  textAlign: useRows ? 'left' : 'center',
                  // nowrap ở thẻ hẹp làm chữ dài tràn ra ngoài → cho xuống dòng khi xếp hàng
                  whiteSpace: useRows ? 'normal' : 'nowrap',
                  wordBreak: useRows ? 'break-word' : undefined,
                  lineHeight: useRows ? 1.25 : 1.1,
                  display: 'block',
                  width: '100%',
                  minWidth: 0,
                }}>{formatMath(txt)}</span>
              );
            })()}
            {isRight && !isSel && <span className="absolute top-3 right-3 text-green-500 font-black text-base">✓</span>}
            {isWrong && <span className="absolute bottom-2 right-3 text-xs text-red-500 font-bold">✗ Sai</span>}
          </button>
        );
      })}
    </div>
  );
});

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
          <div key={`${idx}-${key}`} draggable={!checked}
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
            {opt?.imageUrl && <img src={opt.imageUrl} alt={opt.text} className="h-10 w-10 object-contain rounded shrink-0" />}
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

  const rightItems = useState<{ text: string; imageUrl?: string }[]>(() => {
    const hasPair = options.some((o) => !!o.pair || !!o.pairImageUrl);
    const rawItems = hasPair
      ? options.map((o) => ({ text: o.pair ?? '', imageUrl: o.pairImageUrl })).filter((i) => !!i.text || !!i.imageUrl)
      : options.map((o) => ({ text: correctMap[o.key] ?? '', imageUrl: undefined })).filter((i) => !!i.text);
    // Deduplicate by text (or imageUrl if no text) so same-value right items appear only once
    const seen = new Set<string>();
    const unique = rawItems.filter((i) => {
      const key = i.text || i.imageUrl || '';
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    for (let i = unique.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [unique[i], unique[j]] = [unique[j], unique[i]]; }
    return unique;
  })[0];

  // Restore posMap from existing userMap answers (when navigating back)
  const [posMap, setPosMap] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    options.forEach((opt) => {
      const matched = userMap[opt.key];
      if (matched) {
        // Try to match by text first, then by imageUrl
        const pos = rightItems.findIndex((item) => item.text === matched || item.imageUrl === matched);
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
      <div ref={containerRef} className="relative flex gap-5 sm:gap-8 items-stretch">
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
        <div className="flex-1 space-y-2 min-w-0 flex flex-col">
          {options.map((opt, idx) => {
            const isSelected = selectedLeft === opt.key;
            const matched = userMap[opt.key];
            const isCorrect = checked && !!matched && correctMap[opt.key] === matched;
            const isWrong = checked && !!matched && correctMap[opt.key] !== matched;
            const col = OPTION_COLORS[idx % OPTION_COLORS.length];
            return (
              <button key={opt.key ?? `opt-${idx}`} ref={(el) => { leftRefs.current[idx] = el; }}
                onClick={() => { if (!checked) setSelectedLeft((prev) => prev === opt.key ? null : opt.key); }}
                style={{
                  borderWidth: 3, borderStyle: 'solid',
                  borderColor: isCorrect ? '#22c55e' : isWrong ? '#ef4444' : isSelected ? '#f59e0b' : matched ? '#3b82f6' : '#e5e7eb',
                  borderRadius: 14,
                  background: isCorrect ? '#f0fdf4' : isWrong ? '#fef2f2' : isSelected ? '#fffbeb' : matched ? '#eff6ff' : '#fff',
                  boxShadow: isSelected ? '0 2px 8px rgba(245,158,11,0.3)' : '0 1px 3px rgba(0,0,0,0.06)',
                  cursor: checked ? 'default' : 'pointer',
                }}
                className={`w-full flex items-center justify-center px-3 py-2.5 transition-all flex-1 ${opt.imageUrl ? 'min-h-[96px]' : 'min-h-[52px]'}`}
              >
                {opt.imageUrl
                  ? <div className="flex flex-col items-center justify-center gap-1 flex-1"><img src={opt.imageUrl} alt={opt.text} style={{ width: 56, height: 56, objectFit: 'contain' }} /><span style={{ fontSize: 13, fontWeight: 600, color: isCorrect ? '#15803d' : isWrong ? '#b91c1c' : '#1e293b', textAlign: 'center' }}>{opt.text}</span></div>
                  : <span style={{ fontSize: isMathText(opt.text) ? 32 : 17, fontWeight: isMathText(opt.text) ? 900 : 600, color: isCorrect ? '#15803d' : isWrong ? '#b91c1c' : isMathText(opt.text) ? col : '#1e293b', textShadow: (isMathText(opt.text) && !checked && !isSelected && !matched) ? `1px 2px 0 ${col}44` : undefined }} className="text-center">{formatMath(opt.text)}</span>
                }
                {isCorrect && <span className="text-green-600 font-black text-lg shrink-0">✓</span>}
                {isWrong && <span className="text-red-500 font-black shrink-0">✗</span>}
              </button>
            );
          })}
        </div>
        <div className="flex-1 space-y-2 min-w-0 flex flex-col">
          {rightItems.map((item, pos) => {
            const text = item.text;
            const isConnected = connectedPositions.has(pos);
            const ownerKeys = Object.keys(posMap).filter((k) => posMap[k] === pos);
            const ownerKey = ownerKeys[0];
            const ownerIdx = ownerKey ? options.findIndex((o) => o.key === ownerKey) : -1;
            const col = ownerIdx >= 0 ? OPTION_COLORS[ownerIdx % OPTION_COLORS.length] : '#6b7280';
            // For image-only items, check both text and imageUrl
            const allCorrect = checked && ownerKeys.length > 0 && ownerKeys.every((k) => {
              const correct = correctMap[k];
              return correct === text || (item.imageUrl && correct === item.imageUrl) || (!text && correct === item.imageUrl);
            });
            const anyWrong = checked && ownerKeys.some((k) => {
              const correct = correctMap[k];
              return correct !== text && !(item.imageUrl && correct === item.imageUrl) && !(correct === item.imageUrl);
            });
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
                  // Use text as key, fallback to imageUrl if no text
                  newMap[selectedLeft] = text || item.imageUrl || '';
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
                className={`w-full px-3 py-2.5 text-center transition-all flex-1 flex flex-col items-center justify-center ${item.imageUrl ? 'min-h-[96px]' : 'min-h-[52px]'}`}
              >
                {item.imageUrl
                  ? <div className="flex flex-col items-center justify-center gap-1"><img src={item.imageUrl} alt={text} style={{ width: 56, height: 56, objectFit: 'contain' }} />{text && !text.includes('http') && <span style={{ fontSize: 13, fontWeight: 600, color: isCorrect ? '#15803d' : isWrong ? '#b91c1c' : isConnected ? col : '#374151', textAlign: 'center' }}>{text}</span>}</div>
                  : <span style={{ fontSize: isMathText(text) ? 32 : 17, fontWeight: isMathText(text) ? 900 : 600, color: isCorrect ? '#15803d' : isWrong ? '#b91c1c' : isConnected ? col : '#374151' }}>{formatMath(text)}</span>
                }
                {isCorrect && <span className="ml-2 text-green-600 font-black">✓</span>}
                {isWrong && ownerKey && correctMap[ownerKey] && !correctMap[ownerKey].includes('http') && <span className="ml-1 text-xs text-red-500">(đúng: {correctMap[ownerKey]})</span>}
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

const FillBlank = memo(function FillBlank({ questionText, blanks, answers, checked, correctMap, activeKey, onFocusBlank, onChange }: {
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
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  // Auto-focus hidden input when activeKey changes (for direct keyboard typing)
  useEffect(() => {
    if (activeKey && hiddenInputRef.current) hiddenInputRef.current.focus();
  }, [activeKey]);
  // Support "label\nsequence" — use only the sequence part for train detection
  const newlineIdx = questionText.indexOf('\n');
  const seqText = newlineIdx >= 0 ? questionText.slice(newlineIdx + 1) : questionText;
  const parts = seqText.split(/(\[b\d+\])/g);

  // Detect if this is a number-sequence style question (tokens are mostly numbers/short)
  const isNumberSeq = parts.every((p) => {
    const m = p.match(/^\[(\w+)\]$/);
    return m || /^[\s\d\W]{0,5}$/.test(p.trim()) || p.trim() === '';
  }) && parts.some((p) => /^\[b\d+\]$/.test(p));

  const numColorIdx = 0;

  // Split into rows of max 6 tokens for train display
  const trainTokens = parts.filter((p) => p.trim() !== '' || /^\[b\d+\]$/.test(p));
  const TRAIN_ROW_MAX = 6;
  const trainRows: string[][] = [];
  for (let i = 0; i < trainTokens.length; i += TRAIN_ROW_MAX) {
    trainRows.push(trainTokens.slice(i, i + TRAIN_ROW_MAX));
  }

  return (
    <div className="space-y-4">
      {isNumberSeq ? (
        <div className="flex flex-col gap-4 py-2 items-center w-full overflow-x-auto" style={{ position: 'relative' }}>
          {trainRows.map((rowTokens, rowIdx) => {
            const isReverse = rowIdx % 2 === 1;
            const displayTokens = isReverse ? [...rowTokens].reverse() : rowTokens;
            // W=76 per car, engine=72
            const W = 76, EW = 72;
            const totalW = EW + displayTokens.length * W;
            const H = 88;
            return (
              <svg key={rowIdx} viewBox={`0 0 ${totalW} ${H}`} width={totalW} height={H}
                style={{ maxWidth: '100%', display: 'block' }}>
                {/* Red rail line */}
                <rect x="0" y={H - 28} width={totalW} height="5" rx="2" fill="#e53935"/>

                {/* Engine */}
                {(() => {
                  const ex = isReverse ? totalW - EW : 0;
                  return (
                    <g transform={`translate(${ex},0)${isReverse ? ` scale(-1,1) translate(-${EW},0)` : ''}`}>
                      {/* Chimney */}
                      <rect x="8" y="4" width="10" height="14" rx="3" fill="#b71c1c"/>
                      <rect x="4" y="2" width="18" height="6" rx="3" fill="#b71c1c"/>
                      {/* Smoke puff */}
                      <circle cx="13" cy="1" r="3" fill="#bbb" opacity="0.5"/>
                      {/* Body */}
                      <rect x="0" y="14" width={EW} height="40" rx="8" fill="#e53935"/>
                      {/* Green bottom panel */}
                      <rect x="2" y="38" width={EW-4} height="14" rx="4" fill="#388e3c"/>
                      {/* Cab window */}
                      <rect x={EW-26} y="18" width="22" height="16" rx="5" fill="white" stroke="#ef9a9a" strokeWidth="1.5"/>
                      {/* Yellow roof strip */}
                      <rect x="2" y="12" width={EW-4} height="6" rx="3" fill="#f9a825"/>
                      {/* Front headlight */}
                      <circle cx={isReverse ? EW-6 : 6} cy="32" r="4" fill="#fdd835" stroke="#f57f17" strokeWidth="1"/>
                      {/* Wheels */}
                      <circle cx="14" cy={H-18} r="13" fill="#1565c0" stroke="#e65100" strokeWidth="3"/>
                      <circle cx="14" cy={H-18} r="7" fill="#42a5f5" stroke="#e65100" strokeWidth="2"/>
                      <circle cx="14" cy={H-18} r="3" fill="#1565c0"/>
                      <circle cx={EW-14} cy={H-18} r="13" fill="#1565c0" stroke="#e65100" strokeWidth="3"/>
                      <circle cx={EW-14} cy={H-18} r="7" fill="#42a5f5" stroke="#e65100" strokeWidth="2"/>
                      <circle cx={EW-14} cy={H-18} r="3" fill="#1565c0"/>
                    </g>
                  );
                })()}

                {/* Cars */}
                {displayTokens.map((part, i) => {
                  const match = part.match(/^\[(\w+)\]$/);
                  const isBlank = !!match;
                  const key = match ? match[1] : null;
                  const val = key ? (answers[key] ?? '') : '';
                  const correct = key ? correctMap[key] : '';
                  const isOk = checked && key ? val.trim() === String(correct) : null;
                  const isActive = !checked && key && activeKey === key;
                  const txt = part.trim();
                  const cx = isReverse ? (totalW - EW - (i + 1) * W) : (EW + i * W);

                  const bodyFill = isBlank
                    ? (checked ? (isOk ? '#c8e6c9' : '#ffcdd2') : (isActive ? '#bbdefb' : '#e3f2fd'))
                    : '#e8f5e9';
                  const bodyStroke = isBlank
                    ? (checked ? (isOk ? '#43a047' : '#e53935') : (isActive ? '#1976d2' : '#64b5f6'))
                    : '#66bb6a';

                  return (
                    <g key={i} transform={`translate(${cx},0)`}>
                      {/* Yellow roof */}
                      <rect x="3" y="10" width={W-6} height="8" rx="4" fill="#f9a825"/>
                      {/* Blue main body */}
                      <rect x="1" y="14" width={W-2} height="36" rx="7" fill="#1e88e5" stroke="#1565c0" strokeWidth="1.5"/>
                      {/* Green side panels */}
                      <rect x="1" y="38" width={W-2} height="12" rx="5" fill="#388e3c"/>
                      {/* White number window */}
                      <rect x="8" y="17" width={W-16} height="26" rx="6"
                        fill={bodyFill} stroke={bodyStroke} strokeWidth={isActive ? 3 : 2}/>
                      {/* Active glow */}
                      {isActive && <rect x="8" y="17" width={W-16} height="26" rx="6" fill="none" stroke="#1976d2" strokeWidth="5" opacity="0.2"/>}
                      {/* Wheels */}
                      <circle cx="14" cy={H-18} r="12" fill="#1565c0" stroke="#e65100" strokeWidth="3"/>
                      <circle cx="14" cy={H-18} r="6" fill="#42a5f5" stroke="#e65100" strokeWidth="2"/>
                      <circle cx="14" cy={H-18} r="2.5" fill="#1565c0"/>
                      <circle cx={W-14} cy={H-18} r="12" fill="#1565c0" stroke="#e65100" strokeWidth="3"/>
                      <circle cx={W-14} cy={H-18} r="6" fill="#42a5f5" stroke="#e65100" strokeWidth="2"/>
                      <circle cx={W-14} cy={H-18} r="2.5" fill="#1565c0"/>
                      {/* Checkmark / X after check */}
                      {checked && isOk && <text x={W/2} y="34" textAnchor="middle" fontSize="10" fill="#2e7d32" fontWeight="bold">✓</text>}
                      {checked && isOk === false && <text x={W/2} y="34" textAnchor="middle" fontSize="10" fill="#c62828" fontWeight="bold">✗</text>}

                      {/* Overlay: number text or foreignObject input */}
                      {!isBlank && (
                        <text x={W/2} y="35" textAnchor="middle" dominantBaseline="middle"
                          fontSize={txt.length > 2 ? 18 : 22} fontWeight="900" fill="#1b5e20">{txt}</text>
                      )}
                      {isBlank && val && (
                        <text x={W/2} y="35" textAnchor="middle" dominantBaseline="middle"
                          fontSize={val.length > 2 ? 18 : 22} fontWeight="900"
                          fill={checked ? (isOk ? '#1b5e20' : '#b71c1c') : '#1565c0'}>{val}</text>
                      )}
                      {isBlank && !val && !checked && (
                        <text x={W/2} y="35" textAnchor="middle" dominantBaseline="middle"
                          fontSize="22" fontWeight="900" fill={isActive ? '#1565c0' : '#90caf9'}>?</text>
                      )}
                      {/* Invisible click target */}
                      {isBlank && !checked && (
                        <rect x="8" y="17" width={W-16} height="26" rx="6" fill="transparent" style={{ cursor: 'pointer' }}
                          onClick={() => onFocusBlank?.(key!)}/>
                      )}
                    </g>
                  );
                })}
              </svg>
            );
          })}
          {/* Hidden input to capture keyboard when a train car is selected */}
          {!checked && activeKey && (
            <input ref={hiddenInputRef} type="text" inputMode="numeric"
              value={answers[activeKey] ?? ''}
              onChange={(e) => onChange(activeKey, e.target.value)}
              style={{ position: 'absolute', opacity: 0, width: 1, height: 1, pointerEvents: 'none' }}
            />
          )}
          {/* Show correct answers below wrong blanks */}
          {checked && (() => {
            const wrongs = trainTokens.filter((p) => {
              const m = p.match(/^\[(\w+)\]$/);
              if (!m) return false;
              const k = m[1];
              return (answers[k] ?? '').trim() !== String(correctMap[k]);
            });
            if (wrongs.length === 0) return null;
            return (
              <div className="flex flex-wrap gap-2 justify-center mt-1">
                {wrongs.map((p) => {
                  const k = p.match(/^\[(\w+)\]$/)![1];
                  return <span key={k} className="text-xs text-green-700 font-bold bg-green-50 px-2 py-1 rounded-lg border border-green-200">→ {correctMap[k]}</span>;
                })}
              </div>
            );
          })()}
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
                  onFocus={() => onFocusBlank?.(blank.key)}
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
});

// ─── NEW: TableFill (TableInteraction) ───────────────────────────────────────
// optionsJson encodes table: first item key='headers' text='Col1|Col2|Col3'
//   remaining items: key='rN' text='val1|_key1|_key2' (underscore prefix = blank cell, rest = static)
// correctAnswerJson: { key1: 'answer', key2: 'answer' }

const TableFill = memo(function TableFill({ options, answers, checked, correctMap, activeKey, onFocus, onChange }: {
  options: OptionItem[];
  answers: Record<string, string>;
  checked: boolean;
  correctMap: Record<string, string>;
  activeKey?: string | null;
  onFocus?: (key: string) => void;
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
                    const isActive = !checked && activeKey === cellKey;
                    return (
                      <td key={ci} className="border-2 border-gray-300 p-1 text-center">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={val}
                          disabled={checked}
                          onChange={(e) => onChange(cellKey, e.target.value)}
                          onFocus={() => onFocus?.(cellKey)}
                          className={`w-12 h-9 text-center font-bold rounded-lg border-2 outline-none text-sm transition-all
                            ${checked
                              ? (isOk ? 'border-green-500 bg-green-50 text-green-700' : 'border-red-400 bg-red-50 text-red-700')
                              : isActive
                                ? 'border-amber-600 bg-amber-100 ring-2 ring-amber-400'
                                : 'border-dashed border-amber-400 bg-amber-50 focus:border-amber-600 focus:bg-amber-100'
                            }`}
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
});

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
          <div key={`${idx}-${key}`} style={{
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

// ─── FindErrors ───────────────────────────────────────────────────────────────
// optionsJson: words of the sentence in order [{ key:'w0', text:'Noáng' }, ...]
// correctAnswerJson: string[] — keys of the misspelled words

function FindErrors({ options, selected, checked, correctKeys, onToggle }: {
  options: OptionItem[]; selected: string[]; checked: boolean; correctKeys: string[]; onToggle: (key: string) => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-400 text-center">Bấm vào từ viết <strong className="text-red-500">sai chính tả</strong> trong câu dưới đây</p>
      <div className="bg-gray-50 rounded-2xl p-5 flex flex-wrap gap-x-2 gap-y-2 justify-center leading-loose">
        {options.map((opt) => {
          const isSel = selected.includes(opt.key);
          const shouldBeSel = correctKeys.includes(opt.key);
          const isRight = checked && isSel && shouldBeSel;
          const isWrong = checked && isSel && !shouldBeSel;
          const isMissed = checked && !isSel && shouldBeSel;
          return (
            <button key={opt.key} onClick={() => !checked && onToggle(opt.key)}
              className="transition-all duration-150 rounded-lg px-1 py-0.5"
              style={{
                cursor: checked ? 'default' : 'pointer',
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: '0.01em',
                lineHeight: 1.5,
                background: isRight ? '#dcfce7' : isWrong ? '#fef2f2' : isMissed ? '#fef9c3' : isSel ? '#fee2e2' : 'transparent',
                color: isRight ? '#15803d' : isWrong ? '#b91c1c' : isMissed ? '#92400e' : isSel ? '#ef4444' : '#1f2937',
                textDecorationLine: isSel ? 'underline' : isMissed ? 'underline' : 'none',
                textDecorationColor: isSel ? '#ef4444' : '#f59e0b',
                textDecorationStyle: isSel ? 'wavy' : 'wavy',
                textDecorationThickness: '2px',
                outline: isSel && !checked ? '2px solid #fca5a5' : 'none',
              }}
            >
              {opt.text}
              {isRight && <span style={{ fontSize: 14, marginLeft: 2 }}>✓</span>}
              {isMissed && <span style={{ fontSize: 14, marginLeft: 2 }}>→</span>}
            </button>
          );
        })}
      </div>
      {checked && correctKeys.length > 0 && (
        <div className="text-sm text-center text-amber-700 bg-amber-50 rounded-xl px-4 py-2">
          Từ sai: <strong>{correctKeys.map((k) => options.find((o) => o.key === k)?.text).filter(Boolean).join(', ')}</strong>
        </div>
      )}
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
            <button key={opt.key ?? `opt-${idx}`} onClick={() => !checked && onToggle(opt.key)}
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
                fontSize: isMath ? 'clamp(20px, 6vw, 36px)' : 18,
                fontWeight: 900,
                color: isCrossed ? '#9ca3af' : isCorrect ? '#15803d' : isWrong ? '#b91c1c' : col,
                textDecorationLine: isCrossed ? 'line-through' : 'none',
                textDecorationColor: '#9ca3af',
                textDecorationThickness: '3px',
                textShadow: !isCrossed && !checked ? `1px 2px 0 ${col}44` : undefined,
                opacity: isCrossed ? 0.5 : 1,
                whiteSpace: 'nowrap',
                lineHeight: 1,
                display: 'inline-block',
                maxWidth: '100%',
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
  { id: 'white', hex: '#ffffff', label: 'Trắng' },
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
  const toggleColoring = (shapeKey: string) => {
    const isColored = colorMap[shapeKey] && colorMap[shapeKey] !== 'white';
    onChange({ ...colorMap, [shapeKey]: isColored ? 'white' : 'red' });
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-400">Bấm vào chữ để tô màu</p>

      {/* Shapes grid */}
      <div className={`grid gap-4 ${options.length <= 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
        {options.map((opt) => {
          const colorId = colorMap[opt.key] ?? 'white';
          const isColored = colorId !== 'white';
          const shouldBeColored = correctMap[opt.key] !== 'white';

          // Check if correct
          const isCorrect = checked && isColored === shouldBeColored;
          const isWrong = checked && isColored !== shouldBeColored;

          return (
            <div key={opt.key} className="flex flex-col items-center gap-1">
              <button
                onClick={() => {
                  if (checked) return;
                  toggleColoring(opt.key);
                }}
                className={`w-16 h-16 rounded-2xl border-3 flex items-center justify-center transition-all ${
                  isCorrect ? 'border-green-500 shadow-lg shadow-green-200' :
                  isWrong ? 'border-red-400 shadow-lg shadow-red-100' :
                  isColored ? 'border-amber-400 shadow-md scale-105' :
                  'border-gray-300 hover:border-amber-300 hover:scale-105'
                }`}
              >
                {getShapeRenderer(opt.text, isColored ? '#ef4444' : '#ffffff')}
              </button>
              <span className="text-xs text-gray-600 text-center leading-tight">{formatMath(opt.text)}</span>
              {checked && isWrong && (
                <span className="text-xs text-amber-600">
                  {shouldBeColored ? '✓ Tô màu' : '✗ Không tô'}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-center text-gray-500 mt-4">
        {checked ? '✓ Hoàn thành!' : '← Bấm vào các chữ cần tô'}
      </p>
    </div>
  );
}

// ─── NEW: Puzzle (PuzzleInteraction) ─────────────────────────────────────────
// Drag number tokens into labeled slots to complete an equation/sequence
// optionsJson: [{ key:'slot_1', text:'_ + 3 = 8' }, { key:'token_5', text:'5' }, ...]
//   slots: key starts with 'slot_', text is the expression label
//   tokens: key starts with 'token_', text is the value
// correctAnswerJson: { slot_1: 'token_5', slot_2: 'token_2' }

function Puzzle({ options, answers, checked, correctMap, onChange, correctKey, selected, onSelect }: {
  options: OptionItem[];
  answers: Record<string, string>;
  checked: boolean;
  correctMap: Record<string, string>;
  onChange: (map: Record<string, string>) => void;
  correctKey?: string;
  selected?: string;
  onSelect?: (key: string) => void;
}) {
  const slots = options.filter((o) => o.key.startsWith('slot_'));
  const tokens = options.filter((o) => o.key.startsWith('token_'));
  const usedTokens = new Set(Object.values(answers));
  const available = tokens.filter((t) => !usedTokens.has(t.key));
  const [selectedToken, setSelectedToken] = useState<string | null>(null);

  // Format A/B/C: render as single_choice
  if (slots.length === 0 && tokens.length === 0 && options.length > 0) {
    return (
      <div className="space-y-3">
        {options.map((opt, idx) => {
          const col = OPTION_COLORS[idx % OPTION_COLORS.length];
          const isSel = selected === opt.key;
          const isOk = checked && opt.key === correctKey;
          const isWrong = checked && isSel && opt.key !== correctKey;
          return (
            <button key={opt.key ?? `opt-${idx}`} onClick={() => !checked && onSelect?.(opt.key)}
              className="w-full flex items-center gap-4 pl-3 pr-10 py-4 rounded-2xl transition-all relative text-left"
              style={{
                background: isOk ? '#f0fdf4' : isWrong ? '#fef2f2' : isSel ? `${col}15` : '#f8fafc',
                border: `2.5px solid ${isOk ? '#22c55e' : isWrong ? '#ef4444' : isSel ? col : '#e2e8f0'}`,
                cursor: checked ? 'default' : 'pointer',
              }}>
              <span style={{ width: 36, height: 36, borderRadius: '50%', background: isOk ? '#22c55e' : isWrong ? '#ef4444' : isSel ? col : '#e2e8f0', color: isSel || isOk || isWrong ? '#fff' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, flexShrink: 0 }}>
                {opt.key}
              </span>
              <span style={{ fontSize: 18, fontWeight: 700, color: isOk ? '#15803d' : isWrong ? '#b91c1c' : '#1e293b', flex: 1 }}>{formatMath(opt.text)}</span>
              {isOk && <span className="absolute right-4 text-green-500 font-black text-xl">✓</span>}
              {isWrong && <span className="absolute right-4 text-red-400 font-black text-xl">✗</span>}
            </button>
          );
        })}
      </div>
    );
  }

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
                minWidth: 52, minHeight: 52, padding: '6px 10px', borderRadius: 12, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: placedToken && placedToken.text.length > 4 ? 16 : placedToken && placedToken.text.length > 2 ? 20 : 26,
                fontWeight: 900, lineHeight: 1.2, textAlign: 'center',
                borderWidth: 2, borderStyle: placedToken ? 'solid' : 'dashed',
                borderColor: isCorrect ? '#22c55e' : isWrong ? '#ef4444' : placedToken ? pCol : '#9ca3af',
                background: isCorrect ? '#dcfce7' : isWrong ? '#fee2e2' : placedToken ? `${pCol}22` : '#f3f4f6',
                color: isCorrect ? '#15803d' : isWrong ? '#b91c1c' : placedToken ? pCol : '#9ca3af',
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
                    minWidth: 64, minHeight: 64, padding: '8px 12px',
                    borderRadius: 14, borderWidth: 3, borderStyle: 'solid',
                    borderColor: isSel ? col : '#e5e7eb',
                    background: isSel ? `${col}15` : '#ffffff',
                    fontSize: t.text.length > 5 ? 16 : t.text.length > 3 ? 20 : 26,
                    fontWeight: 900, lineHeight: 1.2, textAlign: 'center',
                    color: col,
                    boxShadow: isSel ? `0 0 0 3px ${col}33` : '0 1px 3px rgba(0,0,0,0.08)',
                    transform: isSel ? 'scale(1.12)' : 'scale(1)',
                    transition: 'all 0.15s', cursor: 'pointer',
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
  // Hooks must be before any early return
  const [tapped, setTapped] = useState<Set<number>>(new Set());

  const isMultiGroup = options.some((o) => o.pair && !isNaN(Number(o.pair)));

  if (isMultiGroup) {
    // Worksheet style: grid of boxes with dashed border, circle input below
    return (
      <div className="space-y-3">
        <div className={`grid gap-3 ${options.length <= 2 ? 'grid-cols-2' : options.length === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
          {options.map((group) => {
            const count = Number(group.pair ?? 1);
            const val = answers[group.key] ?? '';
            const correct = correctMap[group.key];
            const isOk = checked ? val.trim() === String(correct) : null;
            const iconSize = count > 8 ? 'text-2xl' : count > 5 ? 'text-3xl' : 'text-4xl';
            return (
              <div key={group.key} className="flex flex-col items-center gap-2">
                {/* Dashed box with icons */}
                <div style={{
                  border: '2px dashed #1e3a8a',
                  borderRadius: 12,
                  padding: '10px 8px',
                  background: '#f8faff',
                  width: '100%',
                  minHeight: 90,
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 4,
                  alignContent: 'center',
                  justifyContent: 'center',
                }}>
                  {Array.from({ length: count }).map((_, i) => {
                    const sh = tokenShape(group.text);
                    return sh
                      ? <ShapeSVG key={i} shape={sh} color="#1e3a8a" size={count > 8 ? 22 : count > 5 ? 28 : 34} />
                      : <span key={i} className={`${iconSize} select-none leading-none`}>{group.text}</span>;
                  })}
                </div>
                {/* Circle input below */}
                <div className="relative flex items-center justify-center">
                  <input type="text" inputMode="numeric" value={val}
                    onChange={(e) => onChange(group.key, e.target.value)}
                    disabled={checked}
                    style={{
                      width: 44, height: 44,
                      borderRadius: '50%',
                      border: `3px solid ${checked ? (isOk ? '#22c55e' : '#ef4444') : '#1e3a8a'}`,
                      background: checked ? (isOk ? '#f0fdf4' : '#fef2f2') : '#fff',
                      color: checked ? (isOk ? '#15803d' : '#b91c1c') : '#1e3a8a',
                      textAlign: 'center',
                      fontSize: 20, fontWeight: 900,
                      outline: 'none', cursor: checked ? 'default' : 'pointer',
                    }}
                  />
                  {checked && !isOk && (
                    <span style={{ position: 'absolute', top: -18, fontSize: 11, color: '#16a34a', fontWeight: 700, whiteSpace: 'nowrap' }}>→ {correct}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Single-group mode: tap each icon to count, then enter total
  const inputVal = answers['total'] ?? '';
  const isOk = checked ? (correctKey !== null && correctKey !== '' && inputVal.trim() === String(correctKey)) : null;

  const toggleTap = (idx: number) => {
    if (checked) return;
    setTapped((prev: Set<number>) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      onChange('total', String(next.size));
      return next;
    });
  };

  // Đơn vị đếm: nếu là hình học → "hình"; nếu không thì dùng chính biểu tượng (tránh mặc định "con" sai).
  const anyShape = options.some((o) => tokenShape(o.text));
  const firstTok = (options[0]?.text ?? '').trim();
  const unitLabel = anyShape ? 'hình' : (tokenShape(firstTok) ? 'hình' : firstTok);

  return (
    <div className="space-y-4">
      {options.length > 0 && (
        <>
          <p className="text-xs text-gray-400">Bấm vào từng {anyShape ? 'hình' : 'biểu tượng'} để đếm, rồi điền tổng số vào ô</p>
          <div className="flex flex-wrap gap-3 p-4 rounded-2xl bg-blue-50 border border-blue-200 min-h-[80px]">
            {options.map((opt, idx) => {
              const isTapped = tapped.has(idx);
              const sh = tokenShape(opt.text);
              return (
                <button key={idx} onClick={() => toggleTap(idx)}
                  className={`select-none transition-all hover:scale-110 ${sh ? '' : 'text-4xl'} ${isTapped ? 'opacity-30 scale-90' : 'opacity-100'}`}
                >
                  {sh ? <ShapeSVG shape={sh} color="#3b82f6" size={40} /> : opt.text}
                </button>
              );
            })}
          </div>
        </>
      )}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-base font-semibold text-gray-700">Có tất cả</span>
        <input type="text" inputMode="numeric" value={inputVal}
          onChange={(e) => onChange('total', e.target.value)}
          onFocus={(e) => e.target.select()}
          disabled={checked}
          className={`w-16 h-16 text-center font-black text-2xl rounded-xl border-2 outline-none transition-all ${
            checked ? (isOk ? 'border-green-500 bg-green-50 text-green-700' : 'border-red-400 bg-red-50 text-red-700')
            : 'border-dashed border-amber-400 bg-white focus:border-blue-500 focus:border-solid'
          }`}
        />
        <span className="text-base font-semibold text-gray-700">{options.length > 0 ? unitLabel : ''}</span>
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
    // Compare pattern: "Dấu nào đúng? X _ Y" → "X lớn hơn, bé hơn hay bằng Y?"
    .replace(/[Dd]ấu\s+nào\s+đúng\?\s*(\d+)\s*_\s*(\d+)/g, (_m, a, b) =>
      `${numToVi(parseInt(a))} lớn hơn, bé hơn hay bằng ${numToVi(parseInt(b))}?`
    )
    // fill_blank compare single: "6 [b1] 4 (điền dấu so sánh)" → "Sáu lớn hơn, bé hơn hay bằng bốn?"
    .replace(/(\d+)\s*\[b\d+\]\s*(\d+)\s*\(điền dấu so sánh\)/gi, (_m, a, b) =>
      `${numToVi(parseInt(a))} lớn hơn, bé hơn hay bằng ${numToVi(parseInt(b))}?`
    )
    // fill_blank compare chain: "2 [b1] 5 [b2] 8" → "hai, năm, tám — điền dấu thích hợp"
    .replace(/((?:\d+\s*\[b\d+\]\s*){1,}\d+)/g, (m) => {
      const nums = m.split(/\[b\d+\]/g).map(s => s.trim()).filter(s => /^\d+$/.test(s));
      return nums.map((n) => numToVi(parseInt(n))).join(', ') + ' — điền dấu thích hợp';
    })
    .replace(/\[b\d+\]/g, 'mấy')
    // "Điền dấu: 2+5 [?] 10-2" → "Điền dấu so sánh thích hợp vào chỗ trống: hai cộng năm như thế nào so với mười trừ hai?"
    .replace(/[Dd]iền dấu[^:]*:\s*(.*?)\s*\[\?\]\s*([\w\d\s+\-×÷=<>]+)/g, (_m, left, right) => {
      const mathToVi = (s: string) => s
        .replace(/(?<!\d)(\d)[-−–](\d)/g, '$1 đến $2')
        .replace(/[+＋]/g, ' cộng ').replace(/[-−–]/g, ' trừ ')
        .replace(/[×✕*＊·]/g, ' nhân ').replace(/[÷]/g, ' chia ')
        .replace(/\d+/g, (n) => numToVi(parseInt(n))).trim();
      return `Điền dấu so sánh thích hợp vào chỗ trống: ${mathToVi(left)} như thế nào so với ${mathToVi(right)}?`;
    })
    .replace(/\[\?\]/g, 'như thế nào so với')
    .replace(/_{2,}/g, 'mấy')
    .replace(/_/g, 'mấy')
    .replace(/\?/g, '')
    .replace(/(?<!\d)(\d)[-−–](\d)/g, '$1 đến $2')
    .replace(/[+＋]/g, ' cộng ')
    .replace(/[-−–]/g, ' trừ ')
    .replace(/[×✕*＊·]/g, ' nhân ')
    // Dấu chia trong toán: "x : 6" hoặc "12 : 3" → đọc thành "chia"
    // Chỉ áp dụng khi : có space cả 2 bên VÀ không phải label "Tên: nội dung"
    .replace(/(?<=\w)\s+:\s+(?=\w)/g, ' chia ')
    .replace(/(\d)\s*:\s*(\d)/g, '$1 chia $2')
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

// Cờ: bài hiện tại có thuộc khóa TIẾNG ANH không (chỉ khi đó mới tách giọng Anh).
let _ttsEnglish = false;

function speak(text: string) {
  const cleaned = preprocessTTS(text);
  if (!cleaned) return;
  stopSpeak();
  // Bài tiếng Anh → thêm en=1 (đọc giọng bản ngữ) + v=2 (bỏ cache giọng Việt cũ).
  // Bài khác → giữ NGUYÊN URL cũ (cả câu giọng Việt như trước).
  const url = _ttsEnglish
    ? `/api/tts?q=${encodeURIComponent(cleaned)}&en=1&v=2`
    : `/api/tts?q=${encodeURIComponent(cleaned)}`;
  const audio = new Audio(url);
  _ttsAudio = audio;
  // Chỉ dùng giọng đọc riêng của app (/api/tts). Không fallback sang Google TTS.
  audio.play().catch(() => {});
}

function stopSpeak() {
  if (_ttsAudio) { _ttsAudio.pause(); _ttsAudio.src = ''; _ttsAudio = null; }
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

// (Đã bỏ speakWebSpeech dùng giọng Google — app chỉ đọc bằng /api/tts.)

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
  // Chế độ ôn câu sai: chỉ nạp những câu bé làm sai ở lần gần nhất của chặng này.
  const reviewMode = searchParams ? searchParams.get('review') === 'wrong' : false;
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
  // Ghi kết quả đúng/sai từng câu để lưu về server (POST /attempts) khi xong bài.
  const attemptResultsRef = useRef<Record<number, boolean>>({});
  const attemptSubmittedRef = useRef(false);
  // Màn tổng kết sau khi bấm "Nộp bài".
  const [summary, setSummary] = useState<{
    correct: number;
    total: number;
    scorePct: number;
    stars: number;
    points: number;
    newBadges: { name: string; icon?: string }[];
    completedQuests: { name: string }[];
    saved: boolean;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  // Đồng hồ đếm ngược: mỗi câu 1 phút; hết giờ tự động nộp bài.
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

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
  const [traceScores, setTraceScores] = useState<Record<number, number>>({});

  const [shuffledOpts, setShuffledOpts] = useState<Record<number, OptionItem[]>>({});
  const [celebrate, setCelebrate] = useState<'correct' | 'wrong' | null>(null);
  const [celebrateMsg, setCelebrateMsg] = useState('');
  const [activeBlankKey, setActiveBlankKey] = useState<{ qid: number; bkey: string } | null>(null);

  const letterTracingRef = useRef<LetterTracingGameRef>(null);
  const traceSentenceRef = useRef<QuestionTraceSentenceRef>(null);

  const correctAudio = useRef<HTMLAudioElement | null>(null);
  const wrongAudio = useRef<HTMLAudioElement | null>(null);

  // Stop all audio when page unmounts (navigate away)
  useEffect(() => {
    return () => {
      stopSpeak();
      correctAudio.current?.pause();
      wrongAudio.current?.pause();
    };
  }, []);

  useEffect(() => {
    if (!exercise || !soundOn) return;
    const qz = exercise.quizzes[current];
    let a: HTMLAudioElement | null = null;
    if (qz?.questionAudioUrl) {
      a = new Audio(qz.questionAudioUrl);
      a.play().catch(() => {});
    } else if (qz?.questionText) {
      speak(qz.questionText);
    }
    return () => {
      if (a) { a.pause(); a.src = ''; }
      stopSpeak();
    };
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

  // Cache fetched exercises so revisiting an exercise doesn't refetch
  const exerciseCacheRef = useRef<Record<string, ExerciseData>>({});

  // Fetch lesson + all-exercises list ONCE per lesson (not per exercise switch)
  useEffect(() => {
    const fetchLesson = lessonIdProp
      ? apiFetch<LessonMeta>(`/lessons/${lessonIdProp}`)
      : apiFetch<LessonMeta>(`/lessons/slug/${lessonSlugProp}`);

    let cancelled = false;
    fetchLesson
      .then((lessonData) => {
        if (cancelled) return null;
        if (!lessonData || !lessonData.id) {
          setLoading(false);
          return null;
        }
        const lid = String(lessonData.id);
        setResolvedLessonId(lid);
        setLesson(lessonData);
        // Bật đọc giọng Anh CHỈ cho bài thuộc khóa tiếng Anh (vd Tiếng Anh lớp 1).
        _ttsEnglish = /tieng-anh|tiếng anh|english/i.test(
          `${lessonData.course?.slug ?? ''} ${lessonData.course?.title ?? ''}`,
        );
        return apiFetch<AllExercisesData>(`/quizzes/exercises/${lid}`).catch(() => null);
      })
      .then((allData) => {
        if (cancelled || !allData) return;
        setAllExercises(allData.exercises);
      })
      .catch((err) => {
        console.error('[QuizPlayPage] lesson fetch failed:', err);
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [lessonIdProp, lessonSlugProp]);

  // Nộp bài: chấm điểm (% câu đúng), lưu về server nếu đã chọn bé, rồi hiện màn tổng kết.
  const submitAttempt = useCallback(async () => {
    if (!exercise || attemptSubmittedRef.current) return;
    const quizzes = exercise.quizzes;
    const total = quizzes.length;
    if (total === 0) return;
    attemptSubmittedRef.current = true;
    setSubmitting(true);

    const correct = quizzes.filter((qq) => attemptResultsRef.current[qq.id]).length;
    const scorePct = Math.round((correct / total) * 100);
    const stars = scorePct >= 90 ? 3 : scorePct >= 70 ? 2 : scorePct >= 50 ? 1 : 0;

    const childId =
      typeof window !== 'undefined' ? Number(localStorage.getItem('bhh_child_id') || '0') : 0;

    let newBadges: { name: string; icon?: string }[] = [];
    let completedQuests: { name: string }[] = [];
    let saved = false;

    // Chỉ lưu lịch sử khi đã chọn hồ sơ bé.
    if (childId) {
      const answers = quizzes.map((qq) => ({
        quizId: qq.id,
        isCorrect: !!attemptResultsRef.current[qq.id],
      }));
      try {
        // Đăng nhập → lưu server; Khách → lưu localStorage (recordAttempt tự chọn).
        const res = await recordAttempt({
          childId,
          lessonId: Number(resolvedLessonId) || 0,
          exerciseNumber,
          difficultyLevel: exercise.difficultyLevel,
          answers,
          courseSlug: lesson?.course?.slug,
          courseTitle: lesson?.course?.title,
          lessonSlug: lesson?.slug,
          lessonTitle: lesson?.title,
        });
        newBadges = res?.rewards?.newBadges ?? [];
        completedQuests = res?.rewards?.completedQuests ?? [];
        saved = true;
      } catch {
        saved = false; // lỗi bất ngờ → vẫn hiện điểm cục bộ
      }
    }

    setSubmitting(false);
    setSummary({ correct, total, scorePct, stars, points: score, newBadges, completedQuests, saved });

    if (scorePct >= 50) {
      try { confetti({ particleCount: 160, spread: 100, origin: { y: 0.5 } }); } catch {}
    }
    newBadges.forEach((b) => toast.success(`${b.icon ?? '🏅'} Nhận huy hiệu: ${b.name}!`));
    completedQuests.forEach((qq) => toast.success(`🎯 Hoàn thành nhiệm vụ: ${qq.name}!`));
  }, [exercise, resolvedLessonId, exerciseNumber, score]);

  // Đếm ngược mỗi giây khi đang làm bài (chưa nộp).
  useEffect(() => {
    if (timeLeft == null || summary) return;
    const id = setInterval(() => {
      setTimeLeft((v) => (v == null ? v : Math.max(0, v - 1)));
    }, 1000);
    return () => clearInterval(id);
  }, [timeLeft == null, summary]);

  // Hết giờ → tự động nộp bài.
  useEffect(() => {
    if (timeLeft === 0 && !summary && !attemptSubmittedRef.current) {
      submitAttempt();
    }
  }, [timeLeft, summary, submitAttempt]);

  // Fetch the current exercise (uses cache when available)
  useEffect(() => {
    if (!resolvedLessonId) return;
    setCurrent(0);
    setChecked({});
    setScore(0);
    setShuffledOpts({});
    attemptResultsRef.current = {};
    attemptSubmittedRef.current = false;
    setSummary(null);
    setSubmitting(false);

    const cacheKey = `${resolvedLessonId}:${exerciseNumber}`;
    const applyExercise = (exData: ExerciseData, onlyIds?: number[]) => {
      // Ôn câu sai: chỉ giữ các câu có id nằm trong danh sách sai. Nếu rỗng thì giữ nguyên cả chặng.
      const quizzes = onlyIds && onlyIds.length
        ? exData.quizzes.filter((q) => onlyIds.includes(q.id))
        : exData.quizzes;
      const applied = quizzes.length ? { ...exData, quizzes } : exData;
      setExercise(applied);
      // Thời gian làm bài = số câu × 60 giây.
      setTimeLeft(applied.quizzes.length > 0 ? applied.quizzes.length * 60 : null);
      const initDrag: Record<number, string[]> = {};
      const initShuffle: Record<number, OptionItem[]> = {};
      applied.quizzes.forEach((q) => {
        if ((q.questionType === 'drag_drop' || q.questionType === 'sorting') && Array.isArray(q.optionsJson)) {
          // Xáo trộn thứ tự ban đầu để bé phải tự sắp xếp (không để sẵn đáp án đúng).
          const keys = q.optionsJson.map((o) => o.key);
          const correct = Array.isArray(q.correctAnswerJson) ? (q.correctAnswerJson as unknown[]).map(String) : keys;
          const shuffle = (a: string[]) => {
            const arr = [...a];
            for (let i = arr.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
          };
          let order = shuffle(keys);
          let guard = 0;
          while (keys.length > 1 && JSON.stringify(order) === JSON.stringify(correct) && guard < 12) {
            order = shuffle(keys);
            guard++;
          }
          initDrag[q.id] = order;
        }
        // KHÔNG xáo trộn đáp án cho câu "chọn đáp án đúng" (single/multiple/image choice)
        // → giữ nguyên thứ tự A, B, C, D như soạn. Chỉ xáo cross_out (gạch chéo).
        if (q.questionType === 'cross_out' && Array.isArray(q.optionsJson)) {
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
      setLoading(false);
    };

    // Ở chế độ ôn câu sai: lấy id các câu sai rồi mới áp dụng (nếu không có thì hiện cả chặng).
    let stopped = false;
    const applyReview = (exData: ExerciseData) => {
      if (!reviewMode) { applyExercise(exData); return; }
      const childId = getCurrentChildId();
      if (!childId) { applyExercise(exData); return; }
      wrongQuizIdsFor(childId, Number(resolvedLessonId) || 0, exerciseNumber)
        .then((ids) => { if (!stopped) applyExercise(exData, ids); })
        .catch(() => { if (!stopped) applyExercise(exData); });
    };

    const cached = exerciseCacheRef.current[cacheKey];
    if (cached) {
      applyReview(cached);
      return () => { stopped = true; };
    }

    setLoading(true);
    let cancelled = false;
    apiFetch<ExerciseData>(`/quizzes/exercises/${resolvedLessonId}/${exerciseNumber}`)
      .then((exData) => {
        if (cancelled) return;
        exerciseCacheRef.current[cacheKey] = exData;
        applyReview(exData);
      })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; stopped = true; };
  }, [resolvedLessonId, exerciseNumber, reviewMode]);

  const navigateToExercise = (num: number) => {
    const target = allExercises.find((e) => e.exerciseNumber === num);
    if (!target) return;
    if (lesson?.slug) {
      // Reload trang để state reset hoàn toàn (tránh lỗi router.push không refetch)
      const url = buildExerciseUrl(lesson.slug, resolvedLessonId, target.difficultyLevel as 'easy' | 'medium' | 'hard') + `?ex=${num}`;
      window.location.href = url;
    } else {
      setExerciseNumber(num);
    }
  };

  // ─── Derived values (memoized) — MUST be declared before any early return ──
  const q = exercise?.quizzes[current];
  const options: OptionItem[] = useMemo(
    () => (q ? (shuffledOpts[q.id] ?? (Array.isArray(q.optionsJson) ? q.optionsJson : [])) : []),
    [shuffledOpts, q],
  );
  const totalPoints = useMemo(
    () => (exercise ? exercise.quizzes.reduce((s, qz) => s + (qz.points || 10), 0) : 0),
    [exercise],
  );
  const { correctKey, correctKeys, correctBool, correctDragOrder, correctMatchMap } = useMemo(() => {
    let cj = q?.correctAnswerJson;

    // Parse JSON string if needed (coloring, matching, fill_blank, etc.)
    if (typeof cj === 'string') {
      // Try to parse as JSON if it looks like JSON
      if (cj.startsWith('{') || cj.startsWith('[')) {
        try {
          cj = JSON.parse(cj);
          console.log('[correctAnswer] Parsed JSON:', cj);
        } catch (e) {
          console.warn('[correctAnswer] Failed to parse JSON:', cj, e);
          // If parse fails, treat as string
        }
      }
    }

    const result = {
      correctKey: typeof cj === 'string' ? cj : typeof cj === 'number' ? String(cj) : null,
      correctKeys: Array.isArray(cj) ? (cj as string[]) : [],
      correctBool: typeof cj === 'boolean' ? cj : null,
      correctDragOrder: Array.isArray(cj) ? (cj as string[]) : [],
      correctMatchMap: (typeof cj === 'object' && cj !== null && !Array.isArray(cj))
        ? cj as Record<string, string> : {},
    };

    if (q?.questionType === 'coloring') {
      console.log('[coloring] correctMatchMap:', result.correctMatchMap);
    }

    return result;
  }, [q?.correctAnswerJson, q?.questionType]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #2d5a1b 0%, #4a8c2a 50%, #3d7a22 100%)' }}>
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-amber-400 border-t-transparent" />
      </div>
    );
  }

  if (!exercise || exercise.quizzes.length === 0 || !q) {
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

  const isChecked = !!checked[q.id];
  const diffColor = DIFF_COLOR[exercise.difficultyLevel] || '#E8871A';
  const isLetterTracing = q.questionType === 'letter_tracing' || /^\s*(?:tô|viết)\s*(?:chữ|ký\s*tự)/i.test(q.questionText || '');

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
        return sortingMatches(dragOrder[q.id] ?? [], correctDragOrder, q.optionsJson);
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
      case 'cross_out':
      case 'find_errors': {
        const sel = crossOutSel[q.id] ?? [];
        return new Set(sel).size === new Set(correctKeys).size && correctKeys.every((k) => sel.includes(k));
      }
      case 'coloring': {
        const map = coloringMap[q.id] ?? {};

        // If correctMatchMap is empty, it means the answer data is corrupted
        if (Object.keys(correctMatchMap).length === 0) {
          console.warn('[coloring] correctMatchMap is empty - possible corrupted data!', { q: q?.id, correctAnswerJson: q?.correctAnswerJson });
          // Fallback: require user to have colored something
          return Object.keys(map).length > 0 && Object.values(map).some(v => v && v !== 'white');
        }

        // Validation: check if items are colored correctly
        // Items not in map default to 'white' (not colored)
        const isCorrect = Object.entries(correctMatchMap).every(([k, v]) => {
          const userColor = map[k] ?? 'white'; // Default to 'white' if not set
          const userColored = userColor !== 'white';
          const shouldBeColored = v !== 'white';
          return userColored === shouldBeColored;
        });

        const userAnswerDebug = Object.fromEntries(
          Object.keys(correctMatchMap).map(k => [k, (map[k] ?? 'white') !== 'white' ? 'colored' : 'not colored'])
        );
        const correctAnswerDebug = Object.fromEntries(
          Object.entries(correctMatchMap).map(([k, v]) => [k, v !== 'white' ? 'colored' : 'not colored'])
        );
        console.log('[coloring] validation:', { id: q?.id, isCorrect, userAnswer: userAnswerDebug, correctAnswer: correctAnswerDebug });
        return isCorrect;
      }
      case 'puzzle': {
        const opts = Array.isArray(q.optionsJson) ? q.optionsJson : [];
        const hasSlots = opts.some((o) => o.key.startsWith('slot_'));
        if (!hasSlots) return (puzzleAns[q.id] ?? {})['_sel'] === correctKey;
        const ans = puzzleAns[q.id] ?? {};
        return Object.entries(correctMatchMap).every(([k, v]) => ans[k] === v);
      }
      case 'game':
        return gameComplete[q.id] ?? false;
      case 'trace_number':
        return (traceScores[q.id] ?? 0) >= 0.5;
      case 'letter_tracing':
        return true; // auto-complete when answered
      case 'counting': {
        const ans = countingAns[q.id] ?? {};
        if (correctKey !== null && correctKey !== '') return !!(ans['total']?.trim()) && ans['total']?.trim() === correctKey;
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
      case 'cross_out':
      case 'find_errors': return (crossOutSel[q.id]?.length ?? 0) > 0;
      case 'coloring': {
        const map = coloringMap[q.id] ?? {};
        // Check if user has colored at least one item
        return Object.values(map).some(v => v && v !== 'white');
      }
      case 'puzzle': {
        const hasSlots = options.some((o) => o.key.startsWith('slot_'));
        if (!hasSlots) return !!(puzzleAns[q.id] ?? {})['_sel'];
        const slots = options.filter((o) => o.key.startsWith('slot_'));
        const ans = puzzleAns[q.id] ?? {};
        return slots.every((s) => !!ans[s.key]);
      }
      case 'game': return gameComplete[q.id] ?? false;
      case 'trace_number': return false; // handled internally — no "Kiểm tra" button
      case 'letter_tracing': return false; // handled internally — auto-completes
      case 'trace_sentence': return false; // handled internally — auto-completes
      case 'counting': {
        const ans = countingAns[q.id] ?? {};
        if (correctKey !== null && correctKey !== '') return !!(ans['total']?.trim());
        return Object.keys(correctMatchMap).every((k) => !!(ans[k]?.trim()));
      }
      default: return false;
    }
  };

  const handleCheck = () => {
    if (isChecked || !hasAnswer()) return;
    const correct = isAnswerCorrect();
    attemptResultsRef.current[q.id] = correct;
    setChecked((prev) => ({ ...prev, [q.id]: true }));
    if (correct) {
      setScore((s) => s + (q.points || 10));
      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#FF6B9D','#FFD93D','#4ECDC4','#A06CD5','#6BCB77'] });
      } catch {}
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
  const isTraceQuestion = q.questionType === 'trace_number' || /^\s*tô\s*số\s*\d/i.test(q.questionText || '');

  // ─── Question type label ──────────────────────────────────────────────────
  const typeLabel: Record<string, string> = {
    true_false: 'Chọn Đúng hoặc Sai',
    drag_drop: 'Kéo thả sắp xếp',
    sorting: 'Sắp xếp thứ tự',
    multiple_choice: 'Chọn tất cả đáp án đúng',
    matching: 'Nối các cặp tương ứng',
    fill_blank: 'Điền vào chỗ trống',
    table_fill: 'Điền vào bảng',
    number_line: 'Tìm số trên tia số',
    cross_out: 'Gạch bỏ đáp án sai',
    find_errors: 'Tìm từ viết sai chính tả',
    coloring: 'Tô màu theo yêu cầu',
    puzzle: 'Điền vào ô trống',
    letter_tracing: 'Viết/tô theo chữ',
    trace_number: 'Viết/tô theo số',
    trace_sentence: 'Tô theo nét câu',
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
        return sortingMatches(dragOrder[qz.id] ?? [], cks, qz.optionsJson);
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
      case 'cross_out':
      case 'find_errors': {
        const sel = crossOutSel[qz.id] ?? [];
        return sel.length === cks.length && cks.every((k) => sel.includes(k));
      }
      case 'puzzle': {
        const opts2 = Array.isArray(qz.optionsJson) ? qz.optionsJson : [];
        const hasSlots2 = opts2.some((o: OptionItem) => o.key.startsWith('slot_'));
        if (!hasSlots2) {
          const ck2 = typeof qz.correctAnswerJson === 'string' ? qz.correctAnswerJson : null;
          return (puzzleAns[qz.id] ?? {})['_sel'] === ck2;
        }
        const ans = puzzleAns[qz.id] ?? {};
        return Object.entries(cm).every(([k, v]) => ans[k] === v);
      }
      case 'game': return gameComplete[qz.id] ?? false;
      case 'trace_number': return (traceScores[qz.id] ?? 0) >= 0.5;
      case 'trace_sentence': return (traceScores[qz.id] ?? 0) >= 0.5;
      case 'counting': {
        const ans = countingAns[qz.id] ?? {};
        const ck = typeof qz.correctAnswerJson === 'string' && qz.correctAnswerJson !== '' ? qz.correctAnswerJson : null;
        if (ck !== null) return !!(ans['total']?.trim()) && ans['total']?.trim() === ck;
        return Object.entries(cm).every(([k, v]) => ans[k]?.trim() === String(v));
      }
      default: return false;
    }
  };


  const handleVirtualKey = (char: string) => {
    if (isChecked) return;

    // counting: gõ vào ô total
    if (q.questionType === 'counting') {
      const cur = countingAns[q.id]?.['total'] ?? '';
      const next = char === 'del' ? cur.slice(0, -1) : cur + char;
      setCountingAns((p) => ({ ...p, [q.id]: { ...(p[q.id] ?? {}), total: next } }));
      return;
    }

    // fill_blank / table_fill
    let target = activeBlankKey;
    if (!target && q.questionType === 'fill_blank') {
      const match = q.questionText.match(/\[(\w+)\]/);
      const key = match?.[1] ?? (Array.isArray(q.optionsJson) ? q.optionsJson[0]?.key : null);
      if (key) { target = { qid: q.id, bkey: key }; setActiveBlankKey(target); }
    }
    if (!target) return;
    const { qid, bkey } = target;
    if (q.questionType === 'table_fill') {
      const cur = tableFillAns[qid]?.[bkey] ?? '';
      const next = char === 'del' ? cur.slice(0, -1) : cur + char;
      setTableFillAns((p) => ({ ...p, [qid]: { ...(p[qid] ?? {}), [bkey]: next } }));
    } else {
      const cur = fillBlankAns[qid]?.[bkey] ?? '';
      const next = char === 'del' ? cur.slice(0, -1) : cur + char;
      setFillBlankAns((p) => ({ ...p, [qid]: { ...(p[qid] ?? {}), [bkey]: next } }));
    }
  };

  // Text fill_blank: any correct answer contains non-numeric characters (letters/Vietnamese)
  const isTextFillBlank = q.questionType === 'fill_blank' &&
    Object.values(correctMatchMap).some((v) => /[a-zA-ZÀ-ỹ]/.test(String(v)));

  const showVirtualKeyboard = !isChecked && !isTextFillBlank && (q.questionType === 'fill_blank' || q.questionType === 'table_fill' || q.questionType === 'counting');

  return (
    <div className="min-h-screen flex flex-col pb-24 md:pb-0" style={{ background: 'linear-gradient(135deg, #FFE5F1 0%, #C9F0FF 50%, #FFF4D6 100%)' }}>

      {/* Màn tổng kết điểm sau khi nộp bài */}
      {summary && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="text-6xl">{summary.scorePct >= 50 ? '🎉' : '💪'}</div>
            <h2 className="mt-2 text-2xl font-black text-slate-900">
              {summary.scorePct >= 90 ? 'Xuất sắc!' : summary.scorePct >= 50 ? 'Làm tốt lắm!' : 'Cố lên nào!'}
            </h2>
            <div className="mt-2 text-3xl tracking-widest">
              {'⭐'.repeat(summary.stars)}<span className="opacity-30">{'☆'.repeat(3 - summary.stars)}</span>
            </div>
            <div className="mt-4 text-5xl font-black text-emerald-600">
              {summary.scorePct}<span className="text-2xl text-slate-400">/100</span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Đúng {summary.correct}/{summary.total} câu · {summary.points} điểm thưởng
            </p>

            {!summary.saved && (
              <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700">
                Kết quả chưa lưu vào lịch sử — hãy chọn hồ sơ bé (và đăng nhập) để theo dõi tiến độ.
              </p>
            )}

            {(summary.newBadges.length > 0 || summary.completedQuests.length > 0) && (
              <div className="mt-4 space-y-1 text-sm">
                {summary.newBadges.map((b, i) => (
                  <div key={`b${i}`} className="font-semibold text-amber-700">{b.icon ?? '🏅'} Huy hiệu mới: {b.name}</div>
                ))}
                {summary.completedQuests.map((qq, i) => (
                  <div key={`q${i}`} className="font-semibold text-sky-700">🎯 Hoàn thành nhiệm vụ: {qq.name}</div>
                ))}
              </div>
            )}

            <div className="mt-6 flex flex-col gap-2">
              {(() => {
                const nextEx = allExercises.find((e) => e.exerciseNumber === exerciseNumber + 1);
                return nextEx ? (
                  <button onClick={() => navigateToExercise(nextEx.exerciseNumber)}
                    className="kid-btn-3d text-base"
                    style={{ background: 'linear-gradient(135deg, #6BCB77, #16a34a)', boxShadow: '0 6px 0 #047857, 0 8px 16px rgba(107,203,119,0.4)' }}>
                    🚀 Bài tiếp theo
                  </button>
                ) : null;
              })()}
              <button onClick={() => window.location.reload()}
                className="rounded-full bg-slate-100 px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-200">
                🔁 Làm lại
              </button>
              <Link href={lesson?.slug ? `/${lesson.slug}` : `/lessons/${resolvedLessonId}`}
                className="rounded-full bg-slate-100 px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-200">
                ← Quay lại bài học
              </Link>
            </div>
          </div>
        </div>
      )}

      <audio ref={correctAudio} src="/sounds/correct.mp3" preload="auto" />
      <audio ref={wrongAudio} src="/sounds/wrong.mp3" preload="auto" />

      {/* Top bar: breadcrumb thẻ trắng 1 hàng (cuộn ngang nếu dài) + dãy chọn bài ở hàng riêng */}
      <div className="w-full px-3 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto space-y-2.5">
          <nav className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap rounded-2xl bg-white/95 px-4 py-2.5 text-xs sm:text-sm text-slate-500 shadow-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Link href="/" className="shrink-0 font-medium hover:text-pink-500">🏠 Trang chủ</Link>
            {lesson?.course && (
              <>
                <span className="shrink-0 text-slate-300">›</span>
                <Link href={`/khoa-hoc/${lesson.course.slug}`} className="shrink-0 font-medium hover:text-pink-500">{lesson.course.title}</Link>
              </>
            )}
            {lesson && (
              <>
                <span className="shrink-0 text-slate-300">›</span>
                {/* Rút gọn "Bài 3: Nhiều hơn…" → "Bài 3" cho vừa một hàng */}
                <Link href={lesson.slug ? `/${lesson.slug}` : `/lessons/${resolvedLessonId}`} className="shrink-0 font-medium hover:text-pink-500">
                  {lesson.title.split(':')[0]}
                </Link>
              </>
            )}
            <span className="shrink-0 text-slate-300">›</span>
            <span className="shrink-0 font-black" style={{ color: '#FF6B9D' }}>{DIFF_LABEL[exercise.difficultyLevel]}</span>
          </nav>

          {allExercises.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <span className="shrink-0 text-xs font-bold text-slate-500">Bài:</span>
              {allExercises.map((ex) => {
                const colors: Record<string, string> = { easy: '#0e7490', medium: '#c0392b', hard: '#b45309' };
                const isActive = ex.exerciseNumber === exerciseNumber;
                return (
                  <button key={ex.exerciseNumber} onClick={() => navigateToExercise(ex.exerciseNumber)}
                    className="h-9 w-9 shrink-0 rounded-xl text-xs font-bold shadow-sm transition-all hover:scale-110"
                    style={{
                      background: isActive ? colors[ex.difficultyLevel] : '#fff',
                      color: isActive ? 'white' : '#64748b',
                      border: isActive ? 'none' : '1px solid #e2e8f0',
                    }}>
                    {ex.exerciseNumber}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Layout */}
      <div className="flex flex-1 items-start justify-center gap-3 px-4 sm:px-6 py-4 max-w-6xl mx-auto w-full">

        {/* Left sidebar — question list */}
        <div className="hidden md:flex flex-col w-16 bg-white rounded-3xl shadow-md shrink-0 border-4 border-purple-200 p-2 gap-1.5">
          <div className="text-center text-xs font-black py-1.5 text-white rounded-full kid-display mx-auto w-10" style={{ background: 'linear-gradient(135deg, #A06CD5, #FF6B9D)' }}>KQ</div>
          {exercise.quizzes.map((qz, idx) => {
            const done = !!checked[qz.id];
            const ok = done && checkCorrectForNav(qz);
            const canNavigate = idx <= current || done;
            const isActive = idx === current;
            let bg = '#f3f4f6';
            let txtColor = '#9ca3af';
            let extra = '';
            if (isActive) { bg = 'linear-gradient(135deg, #FF6B9D, #FF9F45)'; txtColor = '#fff'; extra = 'kid-pulse-glow'; }
            else if (done && ok) { bg = 'linear-gradient(135deg, #6BCB77, #16a34a)'; txtColor = '#fff'; }
            else if (done && !ok) { bg = 'linear-gradient(135deg, #FF6B6B, #ef4444)'; txtColor = '#fff'; }
            return (
              <button key={qz.id} onClick={() => canNavigate && setCurrent(idx)} disabled={!canNavigate}
                className={`text-sm font-black w-10 h-10 mx-auto rounded-full transition-all kid-display flex items-center justify-center ${canNavigate ? 'hover:scale-110 cursor-pointer' : 'cursor-not-allowed'} ${extra}`}
                style={{ background: bg, color: txtColor, boxShadow: isActive ? '0 4px 12px rgba(255,107,157,0.5)' : '0 2px 4px rgba(0,0,0,0.08)' }}>
                {done && ok ? '⭐' : done && !ok ? '💔' : idx + 1}
              </button>
            );
          })}
        </div>

        {/* Main card */}
        <div className="flex-1 max-w-2xl bg-white rounded-3xl overflow-hidden border-4 border-pink-200" style={{ boxShadow: '0 8px 30px rgba(255,107,157,0.20)' }}>
          {/* Card header with arrow badge */}
          <div className="flex items-center gap-3 px-4 py-3 border-b-2 border-pink-100 bg-gradient-to-r from-pink-50 to-yellow-50">
            {/* Arrow-shaped badge */}
            <div className="relative flex items-center shrink-0">
              <span className="pl-4 pr-6 py-1.5 text-white text-base font-black shadow-sm"
                style={{ background: diffColor, clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%)', borderRadius: '4px 0 0 4px' }}>
                Câu {current + 1}
              </span>
            </div>
            <span className="text-blue-600 font-semibold text-sm flex-1">
              {q.questionType === 'fill_blank'
                ? (isTextFillBlank ? 'Điền từ vào chỗ trống' : 'Điền số vào chỗ trống')
                : (typeLabel[q.questionType] ?? 'Chọn đáp án đúng nhất')}
            </span>
          </div>

          <div className="px-6 py-5">
            {/* Question text */}
            <div className="flex items-start gap-3 mb-4">
              <button
                onClick={() => { if (q.questionAudioUrl) playAudio(q.questionAudioUrl); else speak(q.questionText); }}
                className="shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center hover:scale-110 shadow-lg transition-transform kid-pulse-glow"
                title="Nghe câu hỏi"
              >
                <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6 ml-0.5"><path d="M8 5v14l11-7z"/></svg>
              </button>
              {q.questionType === 'fill_blank' && (() => {
                // Support "label\nsequence" format: first line = label, second line = number sequence
                const newlineIdx = q.questionText.indexOf('\n');
                const displayText = newlineIdx >= 0 ? q.questionText.slice(0, newlineIdx) : q.questionText;
                const seqText = newlineIdx >= 0 ? q.questionText.slice(newlineIdx + 1) : q.questionText;
                const parts2 = seqText.split(/(\[b\d+\])/g);
                const isSeq = parts2.every((p2) => {
                  const m2 = p2.match(/^\[(\w+)\]$/);
                  return m2 || /^[\s\d\W]{0,5}$/.test(p2.trim()) || p2.trim() === '';
                }) && parts2.some((p2) => /^\[b\d+\]$/.test(p2));
                // If has label prefix, show it; then FillBlank renders the sequence
                if (isSeq) {
                  if (newlineIdx >= 0) {
                    return <p className="pt-1" style={{ fontSize: 22, fontWeight: 700, color: '#1e293b' }}>{displayText}</p>;
                  }
                  return null;
                }
                const renderedKeys2 = new Set<string>();
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
                        // Duplicate key: show as inline value badge instead of another input
                        if (renderedKeys2.has(bk)) {
                          const displayVal = bval || (isChecked ? String(correct2) : '?');
                          return (
                            <span key={pi} style={{ display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle', margin: '0 4px', padding: '2px 10px', borderRadius: 10, fontWeight: 900, fontSize: 'inherit', background: isChecked ? (isOk2 ? '#dcfce7' : '#fee2e2') : '#dbeafe', color: isChecked ? (isOk2 ? '#15803d' : '#b91c1c') : '#1d4ed8', border: `2px solid ${isChecked ? (isOk2 ? '#22c55e' : '#ef4444') : '#93c5fd'}` }}>
                              {displayVal}
                            </span>
                          );
                        }
                        renderedKeys2.add(bk);
                        return (
                          <span key={pi} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, verticalAlign: 'middle', margin: '0 6px' }}>
                            <input
                              type="text"
                              inputMode={isTextFillBlank ? 'text' : 'numeric'}
                              value={bval}
                              disabled={isChecked}
                              onClick={() => !isChecked && setActiveBlankKey({ qid: q.id, bkey: bk })}
                              onFocus={() => !isChecked && setActiveBlankKey({ qid: q.id, bkey: bk })}
                              onChange={(e) => !isChecked && setFillBlankAns((p) => ({ ...p, [q.id]: { ...(p[q.id] ?? {}), [bk]: e.target.value } }))}
                              style={{
                                width: isTextFillBlank ? Math.max(80, Math.min(200, (correctMatchMap[bk] ? String(correctMatchMap[bk]).length * 22 : 80))) : 80,
                                height: 56, textAlign: 'center',
                                fontSize: isTextFillBlank ? 22 : 32, fontWeight: 900,
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
                      // Strip the "(điền dấu so sánh)" annotation from display
                      const cleanPart = part2.replace(/\s*\(điền dấu so sánh\)/gi, '');
                      if (!cleanPart.trim()) return null;
                      return <span key={pi}>{cleanPart}</span>;
                    })}
                  </p>
                );
              })()}
              {q.questionType !== 'fill_blank' && (
                <p className="text-xl font-bold leading-snug pt-1" style={{ color: '#1e293b' }}>{q.questionText.replace(/\[b\d+\]/g, '____')}</p>
              )}
            </div>

            {/* Minh họa khi chưa có ảnh: (1) hình học tự vẽ SVG, (2) emoji cho con vật/đồ vật/quả.
                Vd "Tam giác có 3 góc. Đúng hay sai?" → vẽ tam giác; "Quan sát hình con gà" → 🐔 */}
            {(() => {
              if (q.questionImageUrl) return null;
              const optShapes = (q.optionsJson ?? []).some((o) => tokenShape(o?.text));
              const shapes = optShapes ? [] : shapesInText(q.questionText);
              if (shapes.length) {
                return (
                  <div className="mb-4 flex flex-wrap items-center justify-center gap-6">
                    {shapes.map((sh, i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <ShapeSVG shape={sh} color={SHAPE_COLOR[sh]} size={92} />
                      </div>
                    ))}
                  </div>
                );
              }
              // Câu 1 đáp án đúng → cho phép lấy emoji theo đáp án (câu "chọn hình")
              const singleAns = q.questionType === 'single_choice' || q.questionType === 'image_choice';
              const correctText = singleAns
                ? (q.optionsJson ?? []).find((o) => o.key === correctKey)?.text
                : undefined;
              const emo = questionEmoji(q.questionText, correctText);
              if (emo) {
                return (
                  <div className="mb-4 flex justify-center">
                    <span className="leading-none" style={{ fontSize: 76 }} aria-hidden="true">{emo}</span>
                  </div>
                );
              }
              return null;
            })()}

            {q.questionImageUrl && (
              <div className="flex justify-center mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={q.questionImageUrl} alt="question" className="rounded-xl object-contain border border-gray-100 shadow-sm" style={{ maxHeight: 'min(28vh, 200px)' }} />
              </div>
            )}

            {/* Answer area */}
            <div key={`${q.id}-answer`} className="mb-3">
              {q.questionType === 'single_choice' && (
                <SingleChoice options={options} selected={singleSel[q.id] ?? ''} checked={isChecked} correctKey={correctKey}
                  compact={!!q.questionImageUrl}
                  onSelect={(k) => setSingleSel((p) => ({ ...p, [q.id]: k }))} />
              )}
              {q.questionType === 'image_choice' && (
                <ImageChoice options={options} selected={singleSel[q.id] ?? ''} checked={isChecked} correctKey={correctKey}
                  onSelect={(k) => setSingleSel((p) => ({ ...p, [q.id]: k }))} />
              )}
              {q.questionType === 'multiple_choice' && (
                <MultipleChoice options={options} selected={multiSel[q.id] ?? []} checked={isChecked} correctKeys={correctKeys}
                  compact={!!q.questionImageUrl}
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
                  activeKey={activeBlankKey?.qid === q.id ? activeBlankKey.bkey : null}
                  onFocus={(bkey) => setActiveBlankKey({ qid: q.id, bkey })}
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
              {q.questionType === 'find_errors' && (
                <FindErrors
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
              {isLetterTracing && !isChecked && (
                <QuestionLetterTracing
                  key={q.id}
                  ref={letterTracingRef as React.Ref<QuestionLetterTracingRef>}
                  letter={(() => {
                    const ans = q.correctAnswerJson;
                    if (ans && typeof ans === 'object' && !Array.isArray(ans) && 'letter' in ans) {
                      return (ans as { letter?: string }).letter || '';
                    }
                    return '';
                  })()}
                  instruction={q.questionText}
                />
              )}
              {isLetterTracing && isChecked && (
                <div className="py-4 text-center text-gray-500 text-sm">
                  ✓ Đã hoàn thành bài tập viết chữ
                </div>
              )}
              {q.questionType === 'trace_sentence' && !isChecked && (
                <QuestionTraceSentence
                  key={q.id}
                  ref={traceSentenceRef as React.Ref<QuestionTraceSentenceRef>}
                  sentence={q.questionText}
                />
              )}
              {q.questionType === 'trace_sentence' && isChecked && (
                <div className="py-4 text-center text-gray-500 text-sm">
                  ✓ Đã hoàn thành bài tập tô theo nét câu
                </div>
              )}
              {q.questionType === 'puzzle' && (
                <Puzzle key={q.id}
                  options={Array.isArray(q.optionsJson) ? q.optionsJson : []}
                  answers={puzzleAns[q.id] ?? {}}
                  checked={isChecked}
                  correctMap={correctMatchMap}
                  correctKey={typeof q.correctAnswerJson === 'string' ? q.correctAnswerJson : undefined}
                  selected={(puzzleAns[q.id] ?? {})['_sel']}
                  onSelect={(key) => setPuzzleAns((p) => ({ ...p, [q.id]: { ...(p[q.id] ?? {}), _sel: key } }))}
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
                  options={Array.isArray(q.optionsJson) ? q.optionsJson : (q.optionsJson && typeof q.optionsJson === 'object' ? Object.entries(q.optionsJson as Record<string,string>).map(([k,v]) => ({ key: k, text: v })) : [])}
                  answers={countingAns[q.id] ?? {}}
                  checked={isChecked}
                  correctMap={correctMatchMap}
                  correctKey={correctKey}
                  onChange={(key, val) => setCountingAns((p) => ({ ...p, [q.id]: { ...(p[q.id] ?? {}), [key]: val } }))}
                />
              )}
              {isTraceQuestion && !isChecked && (
                <NumberTrace
                  key={q.id}
                  number={(() => {
                    const ans = q.correctAnswerJson;
                    const fromText = (q.questionText || '').replace(/\D/g, '').slice(0, 2);
                    if (typeof ans === 'string' || typeof ans === 'number') return String(ans) || fromText || '0';
                    if (ans && typeof ans === 'object' && !Array.isArray(ans) && 'number' in ans) {
                      const n = (ans as { number?: string | number }).number;
                      if (n !== undefined) return String(n);
                    }
                    return fromText || '0';
                  })()}
                  onDone={(scoreRatio) => {
                    const earned = Math.round((q.points || 10) * scoreRatio);
                    setScore((s) => s + earned);
                    setTraceScores((prev) => ({ ...prev, [q.id]: scoreRatio }));
                    setChecked((prev) => ({ ...prev, [q.id]: true }));

                    // Hiệu ứng + giọng đọc giống các câu khác (≥ 0.5 = đạt)
                    if (scoreRatio >= 0.5) {
                      try {
                        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#FF6B9D','#FFD93D','#4ECDC4','#A06CD5','#6BCB77'] });
                      } catch {}
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
                  }}
                />
              )}
              {isTraceQuestion && isChecked && (() => {
                const ratio = traceScores[q.id] ?? 0;
                const earned = Math.round((q.points || 10) * ratio);
                const total = q.points || 10;
                const label = ratio >= 1 ? '🌟 Tuyệt vời!' : ratio >= 0.8 ? '😊 Tốt lắm!' : ratio >= 0.5 ? '👍 Khá rồi!' : '💪 Cần tô kỹ hơn nhé!';
                const bg = ratio >= 1
                  ? 'from-green-300 to-emerald-400 border-green-500 text-green-900'
                  : ratio >= 0.8
                    ? 'from-lime-200 to-green-300 border-green-400 text-green-900'
                    : ratio >= 0.5
                      ? 'from-yellow-200 to-amber-300 border-amber-500 text-amber-900'
                      : 'from-red-200 to-pink-300 border-red-400 text-red-900';
                const emoji = ratio >= 1 ? '🎉' : ratio >= 0.8 ? '😊' : ratio >= 0.5 ? '🤔' : '😕';
                return (
                  <div className={`mb-3 px-4 py-3 rounded-2xl text-sm flex items-start gap-3 border-4 bg-gradient-to-r ${bg} kid-pop-in`}>
                    <span className="text-3xl shrink-0 mt-0.5">{emoji}</span>
                    <div>
                      <p className="font-bold text-base">{label}</p>
                      <p className="opacity-80 leading-snug">Bạn được <b>{earned}/{total}</b> điểm cho câu tô số này.</p>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Explanation */}
            {isChecked && !isTraceQuestion && (
              <div className={`mb-3 px-4 py-3 rounded-2xl text-sm flex items-start gap-3 border-4 kid-pop-in ${isCurrentCorrect ? 'bg-gradient-to-r from-green-300 to-emerald-400 border-green-500 text-green-900' : 'bg-gradient-to-r from-red-300 to-pink-400 border-red-400 text-red-900'}`}>
                <span className="text-3xl shrink-0 mt-0.5 kid-pop-in">{isCurrentCorrect ? '🎉' : '😢'}</span>
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
              {!isChecked && !isTraceQuestion && !isLetterTracing && (
                <button onClick={handleCheck} disabled={!hasAnswer()}
                  className="kid-btn-3d text-base"
                  style={{ background: hasAnswer() ? 'linear-gradient(135deg, #FFD93D, #FF9F45)' : '#d1d5db', boxShadow: hasAnswer() ? '0 6px 0 #b45309, 0 8px 16px rgba(255,159,69,0.45)' : 'none' }}>
                  ▶️ Kiểm tra
                </button>
              )}
              {!isChecked && isLetterTracing && (
                <button onClick={() => {
                  const score = letterTracingRef.current?.getScore() ?? 0;
                  // Only award points if score >= 50 (50% accuracy)
                  if (score >= 50) {
                    setChecked((prev) => ({ ...prev, [q.id]: true }));
                    const earned = Math.round(((q.points || 10) * score) / 100);
                    setScore((s) => s + earned);
                  } else {
                    // Show error message if score too low
                    toast.error(`Tô chưa đủ tốt (${score}%). Hãy tô lại để đạt ≥50%!`);
                  }
                }}
                  className="kid-btn-3d text-base"
                  style={{ background: 'linear-gradient(135deg, #A78BFA, #C084FC)', boxShadow: '0 6px 0 #7c3aed, 0 8px 16px rgba(192,132,252,0.4)' }}>
                  ✏️ Tô xong
                </button>
              )}
              {!isChecked && q.questionType === 'trace_sentence' && (
                <button onClick={() => {
                  const score = traceSentenceRef.current?.getScore() ?? 0;
                  // Only award points if score >= 50 (50% accuracy)
                  if (score >= 50) {
                    setChecked((prev) => ({ ...prev, [q.id]: true }));
                    const earned = Math.round(((q.points || 10) * score) / 100);
                    setScore((s) => s + earned);
                  } else {
                    // Show error message if score too low
                    toast.error(`Tô chưa đủ tốt (${score}%). Hãy tô lại để đạt ≥50%!`);
                  }
                }}
                  className="kid-btn-3d text-base"
                  style={{ background: 'linear-gradient(135deg, #A78BFA, #C084FC)', boxShadow: '0 6px 0 #7c3aed, 0 8px 16px rgba(192,132,252,0.4)' }}>
                  ✏️ Tô xong
                </button>
              )}
              {isChecked && (current < exercise.quizzes.length - 1 ? (
                <button onClick={handleNext}
                  className="kid-btn-3d text-base"
                  style={{ background: 'linear-gradient(135deg, #60a5fa, #A06CD5)', boxShadow: '0 6px 0 #6d28d9, 0 8px 16px rgba(160,108,213,0.4)' }}>
                  🚀 Câu tiếp theo
                </button>
              ) : (
                // Câu cuối đã kiểm tra → nộp bài để xem tổng kết điểm.
                <button onClick={submitAttempt} disabled={submitting}
                  className="kid-btn-3d text-base"
                  style={{ background: submitting ? '#9ca3af' : 'linear-gradient(135deg, #6BCB77, #16a34a)', boxShadow: submitting ? 'none' : '0 6px 0 #047857, 0 8px 16px rgba(107,203,119,0.4)' }}>
                  {submitting ? '⏳ Đang nộp…' : '📤 Nộp bài'}
                </button>
              ))}
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
        <div className="hidden md:flex flex-col w-36 gap-0 shrink-0 bg-white overflow-hidden shadow-md border-4 border-yellow-300" style={{ borderRadius: 24, boxShadow: '0 8px 24px rgba(255,217,61,0.3)' }}>
          {/* Countdown timer */}
          {timeLeft != null && (
            <>
              <div className="text-white text-center text-xs font-black py-2 kid-display" style={{ background: 'linear-gradient(135deg, #4ECDC4, #45b7aa)' }}>Thời gian còn lại</div>
              <div className="flex items-center justify-center gap-1.5 py-3 border-b-2 border-yellow-100">
                {/* eslint-disable-next-line @next/next/no-img-element -- icon tĩnh trong /public */}
                <img src="/icons/icon_dong_ho_dem_nguoc.webp" alt="" className={`h-11 w-11 shrink-0 object-contain ${timeLeft <= 60 ? 'animate-pulse' : ''}`} draggable={false} />
                <span className={`text-2xl font-black kid-display tabular-nums ${timeLeft <= 60 ? 'text-red-500 animate-pulse' : 'text-sky-500'}`}>{fmtClock(timeLeft)}</span>
              </div>
            </>
          )}
          {/* Question number */}
          <div className="text-white text-center text-xs font-black py-2 kid-display" style={{ background: 'linear-gradient(135deg, #4ECDC4, #87CEEB)' }}>Câu hỏi số</div>
          <div className="text-center py-3 border-b-2 border-yellow-100">
            <span className="text-3xl font-black text-gray-800 kid-display">{current + 1}</span>
            <span className="text-base text-gray-500">/{exercise.quizzes.length}</span>
          </div>
          {/* Score */}
          <div className="text-white text-center text-xs font-black py-2 kid-display" style={{ background: 'linear-gradient(135deg, #FF6B9D, #FF6B6B)' }}>Điểm</div>
          <div className="text-center py-3 border-b-2 border-yellow-100">
            <div key={score} className="text-4xl font-black kid-display kid-bounce" style={{ color: '#FF6B9D' }}>{score}</div>
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


      {/* ── Thanh thời gian / câu hỏi / điểm / âm thanh — nằm DƯỚI thẻ câu hỏi (mobile) ── */}
      <div className="md:hidden mx-3 grid grid-cols-4 overflow-hidden rounded-2xl border border-slate-200 bg-white text-center shadow-sm">
        <div className="border-r border-slate-100 bg-teal-50/40 px-1 py-2">
          <div className="text-[10px] font-black text-teal-600">Thời gian còn lại</div>
          <div className={`mt-0.5 flex items-center justify-center gap-0.5 text-base font-black tabular-nums ${timeLeft != null && timeLeft <= 60 ? 'text-red-500 animate-pulse' : 'text-sky-600'}`}>
            {/* eslint-disable-next-line @next/next/no-img-element -- icon tĩnh trong /public */}
            <img src="/icons/icon_dong_ho_dem_nguoc.webp" alt="" className="h-5 w-5 object-contain" draggable={false} />
            {timeLeft != null ? fmtClock(timeLeft) : '--:--'}
          </div>
        </div>
        <div className="border-r border-slate-100 bg-sky-50/40 px-1 py-2">
          <div className="text-[10px] font-black text-sky-600">Câu hỏi số</div>
          <div className="mt-0.5 text-base font-black text-slate-800 kid-display">
            {current + 1}<span className="text-xs font-bold text-slate-400">/{exercise.quizzes.length}</span>
          </div>
        </div>
        <div className="border-r border-slate-100 bg-pink-50/40 px-1 py-2">
          <div className="text-[10px] font-black text-pink-500">Điểm</div>
          <div key={score} className="mt-0.5 text-base font-black kid-bounce kid-display" style={{ color: '#FF6B9D' }}>
            {score}<span className="text-xs font-bold text-slate-400">/{totalPoints}</span>
          </div>
        </div>
        <button onClick={() => setSoundOn((s) => !s)} aria-label="Bật/tắt âm thanh"
          className="flex items-center justify-center gap-1 bg-amber-50/40 px-1 py-2">
          <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${soundOn ? 'bg-teal-400 text-white' : 'bg-gray-200 text-gray-400'}`}>
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
              <path d={soundOn
                ? 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z'
                : 'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z'}
              />
            </svg>
          </span>
          <span className="text-left text-[9px] font-bold leading-tight text-slate-600">Bật/Tắt âm thanh</span>
        </button>
      </div>

      {/* ── Điều hướng câu hỏi (mobile) ── */}
      <div className="md:hidden mx-3 mt-2 mb-3 flex items-center gap-1.5 overflow-x-auto rounded-2xl border border-purple-100 bg-white/80 px-3 py-2 shadow-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <span className="shrink-0 mr-1 text-[11px] font-black text-slate-600 kid-display">🚩 Câu hỏi</span>
        {exercise.quizzes.map((qz, idx) => {
          const done = !!checked[qz.id];
          const ok = done && checkCorrectForNav(qz);
          const canNavigate = idx <= current || done;
          const isActive = idx === current;
          let bg = '#f3f4f6';
          let txtColor = '#9ca3af';
          if (isActive) { bg = 'linear-gradient(135deg, #FF6B9D, #FF9F45)'; txtColor = '#fff'; }
          else if (done && ok) { bg = 'linear-gradient(135deg, #6BCB77, #16a34a)'; txtColor = '#fff'; }
          else if (done && !ok) { bg = 'linear-gradient(135deg, #FF6B6B, #ef4444)'; txtColor = '#fff'; }
          return (
            <button key={qz.id} onClick={() => canNavigate && setCurrent(idx)} disabled={!canNavigate}
              className={`shrink-0 flex h-8 w-8 items-center justify-center rounded-full text-xs font-black kid-display ${canNavigate ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              style={{ background: bg, color: txtColor, boxShadow: isActive ? '0 2px 8px rgba(255,107,157,0.5)' : '0 1px 3px rgba(0,0,0,0.08)' }}>
              {done && ok ? '⭐' : done && !ok ? '💔' : idx + 1}
            </button>
          );
        })}
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
