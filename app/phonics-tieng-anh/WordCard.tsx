'use client';

// Thẻ từ vựng in được trên ảnh nền /assets/images/bg-card-2.webp (1092×1441): huy hiệu tròn góc
// trái, ô chữ, vùng hình lớn. Dùng chung cho Âm ghép (digraph) và Họ từ (word family).

import PhonicsPic from './PhonicsPic';

const BG = '/assets/images/bg-card-2.webp';

// Vị trí trên ảnh nền (% bề rộng / bề cao ảnh).
const BADGE = { x: 12.7, y: 10, w: 20 };
const BANNER = { x: 54, y: 24, w: 75 };
const PICTURE = { x: 50, y: 63 };

export type Segment = { text: string; color: string };

export const INK = '#0f172a';
export const BLUE = '#1565c0';
export const RED = '#dc2626';

/**
 * In riêng một vùng: gắn class print-only vào đúng phần tử rồi gọi window.print(); CSS in
 * (PRINT_CSS) ẩn mọi thứ không chứa phần tử đó. Mỗi khu có nút in riêng mà không đè nhau.
 */
export function printOnly(el: HTMLElement | null) {
  if (!el) return;
  el.classList.add('print-only');
  const done = () => {
    el.classList.remove('print-only');
    window.removeEventListener('afterprint', done);
  };
  window.addEventListener('afterprint', done);
  window.print();
}

export const PRINT_CSS = `
  @media print {
    @page { size: A4 portrait; margin: 10mm; }
    /* display:none (không chỉ ẩn) mọi thứ không chứa vùng in → không đẻ thêm trang trắng */
    body *:not(:has(.print-only)):not(.print-only):not(.print-only *) { display: none !important; }
    html, body, body *:has(.print-only) { margin: 0 !important; padding: 0 !important; min-height: 0 !important; height: auto !important; background: #fff !important; box-shadow: none !important; }
    .print-only, .print-only * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .print-only.wc-grid { display: grid !important; grid-template-columns: repeat(2, 88mm) !important; gap: 8mm 10mm !important; justify-content: center; max-width: none !important; }
    .print-only .wc-card { width: 88mm !important; box-shadow: none !important; break-inside: avoid; }
    .print-only .wc-hint { display: none !important; }
  }
`;

export default function WordCard({
  badge,
  segments,
  emoji,
  vi,
  onTap,
  selected = false,
  as = 'li',
}: {
  badge: string;
  segments: Segment[];
  emoji: string;
  vi: string;
  onTap: () => void;
  selected?: boolean;
  as?: 'li' | 'div';
}) {
  const Wrap = as;
  const word = segments.map((s) => s.text).join('');
  // Từ dài (elephant, jellyfish) thu nhỏ chữ cho vừa ô.
  const fs = Math.min(17, 100 / word.length);
  return (
    <Wrap className="flex flex-col items-center gap-1.5">
      <button
        type="button"
        onClick={onTap}
        className={`wc-card relative w-full overflow-hidden rounded-[6%] shadow-lg transition ${selected ? 'ring-4 ring-amber-400' : 'ring-1 ring-slate-100'} hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]`}
        style={{ aspectRatio: '1092 / 1441', containerType: 'inline-size' }}
        aria-label={`Nghe từ ${word} – ${vi}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ảnh nền cố định, cần in được */}
        <img src={BG} alt="" className="absolute inset-0 h-full w-full" />
        <span
          className="absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center font-black leading-none text-white"
          style={{
            left: `${BADGE.x}%`,
            top: `${BADGE.y}%`,
            width: `${BADGE.w}cqw`,
            height: `${BADGE.w}cqw`,
            fontSize: badge.length > 2 ? '6.5cqw' : badge.length > 1 ? '9cqw' : '11cqw',
          }}
        >
          {badge}
        </span>
        <span
          className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-center font-black leading-none tracking-tight"
          style={{ left: `${BANNER.x}%`, top: `${BANNER.y}%`, width: `${BANNER.w}cqw`, fontSize: `${fs}cqw` }}
        >
          {segments.map((s, i) => (
            <span key={i} style={{ color: s.color }}>
              {s.text}
            </span>
          ))}
        </span>
        <span
          className="absolute -translate-x-1/2 -translate-y-1/2 leading-none"
          style={{ left: `${PICTURE.x}%`, top: `${PICTURE.y}%`, fontSize: '44cqw' }}
          aria-hidden
        >
          <PhonicsPic word={word} emoji={emoji} />
        </span>
      </button>
      <span className="wc-hint text-sm font-bold text-emerald-600">{vi}</span>
    </Wrap>
  );
}
