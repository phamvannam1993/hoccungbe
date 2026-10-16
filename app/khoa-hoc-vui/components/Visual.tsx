/* eslint-disable @next/next/no-img-element -- ảnh minh họa tĩnh */
import type { Question } from '../lib/types';
import { Clock, parseTime, withClocks } from './Clock';
import { MoneyRow } from './Money';

/** Hình minh họa cho câu hỏi / ví dụ: dòng emoji, đồng hồ kim, ảnh, bảng (ô "?" được tô nổi). */
export default function Visual({ visual, compact = false }: { visual: NonNullable<Question['visual']>; compact?: boolean }) {
  // Ô có chữ dài (vd "Toán", "✔ An") thì chữ nhỏ lại, ô tự giãn.
  const gridLong = (visual.grid ?? []).flat().some((c) => [...c].length > 3);
  const clockSize = compact ? 88 : (visual.clock?.length ?? 0) > 2 ? 96 : 120;
  return (
    <div className="mt-3 flex flex-col items-center gap-3">
      {visual.emoji && (
        <p className={`whitespace-pre-line text-center leading-snug tracking-wider ${compact ? 'text-3xl' : 'text-4xl'}`}>
          {withClocks(visual.emoji, compact ? 80 : 96)}
        </p>
      )}
      {visual.clock && (
        <div className="flex flex-wrap justify-center gap-4">
          {visual.clock.map((t, i) => {
            const time = parseTime(t);
            return time ? <Clock key={i} hour={time.hour} minute={time.minute} size={clockSize} /> : null;
          })}
        </div>
      )}
      {visual.money && <MoneyRow items={visual.money} width={compact ? 120 : visual.money.length > 4 ? 120 : 150} />}
      {visual.image && <img src={visual.image} alt="" className="max-h-64 rounded-2xl object-contain" />}
      {visual.grid && (
        <div
          className="inline-grid gap-1.5 rounded-2xl bg-white/70 p-2 shadow-[0_2px_0_#c6c6c7]"
          style={{ gridTemplateColumns: `repeat(${visual.grid[0]?.length ?? 1}, minmax(0, 1fr))` }}
        >
          {visual.grid.flat().map((cell, i) => (
            <span
              key={i}
              className={`flex h-14 min-w-14 items-center justify-center rounded-[10px] border-[3px] px-1.5 font-black sm:h-16 sm:min-w-16 ${
                gridLong ? 'text-sm sm:text-base' : 'text-2xl'
              } ${cell === '?' ? 'border-dashed border-[#ffaf36] bg-[#fff6e5] text-[#ffaf36]' : 'border-[#e4e3e3] bg-white text-[#1b1b1b]'}`}
            >
              {withClocks(cell, 48)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
