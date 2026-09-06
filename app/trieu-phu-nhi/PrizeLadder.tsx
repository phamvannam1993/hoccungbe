'use client';

import { formatVnd } from '../lib/millionaire';

/**
 * Thang tiền 15 mốc bên phải màn chơi.
 * Mốc AN TOÀN được đánh dấu riêng: trả lời sai ở trên vẫn giữ được tiền của mốc
 * an toàn gần nhất đã qua — nhờ vậy bé không mất trắng và dám chơi tiếp.
 */
/**
 * Dải mốc GỌN cho điện thoại.
 * Màn hình nhỏ không đủ chỗ cho 15 dòng — nhét đủ thì câu hỏi bị đẩy xuống dưới
 * đáy, bé phải cuộn mới thấy đề. Ở đây chỉ hiện mốc đang chơi, mốc kế tiếp và
 * mốc an toàn sắp tới.
 */
export function PrizeStrip({
  prizes, safeLevels, current,
}: { prizes: number[]; safeLevels: number[]; current: number }) {
  const safeTiep = safeLevels.find((s) => s >= current);
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-[#061238]/80 px-3 py-2 ring-1 ring-white/10">
      <span className="shrink-0 rounded-lg px-2 py-1 text-xs font-black text-[#5a2d00]"
        style={{ background: 'linear-gradient(180deg,#FFE27A,#F5A623)' }}>
        Mốc {current + 1}
      </span>
      <span className="shrink-0 text-sm font-black text-[#FFD54A] tabular-nums">
        {formatVnd(prizes[Math.min(current, prizes.length - 1)])}
      </span>

      {/* Thanh tiến độ 15 mốc, mốc an toàn có vạch đậm */}
      <span className="flex min-w-0 flex-1 items-center gap-[2px]">
        {prizes.map((_, i) => (
          <span key={i} className="h-1.5 flex-1 rounded-full"
            style={{
              background: i < current ? '#FFC42E' : i === current ? '#fff' : 'rgba(255,255,255,.22)',
              outline: safeLevels.includes(i) ? '1px solid rgba(255,196,46,.9)' : undefined,
            }} />
        ))}
      </span>

      {safeTiep != null && (
        <span className="shrink-0 text-[10px] font-bold text-white/60">
          🛡️ {formatVnd(prizes[safeTiep])}
        </span>
      )}
    </div>
  );
}

export default function PrizeLadder({
  prizes,
  safeLevels,
  current,
  compact = false,
}: {
  prizes: number[];
  safeLevels: number[];
  /** Chỉ số câu đang chơi (0-based). */
  current: number;
  compact?: boolean;
}) {
  return (
    <ol className={`flex flex-col-reverse gap-0.5 rounded-2xl bg-[#061238]/80 p-2 ring-1 ring-white/10 ${compact ? 'text-[11px]' : 'text-xs'}`}>
      {prizes.map((p, i) => {
        const isNow = i === current;
        const passed = i < current;
        const safe = safeLevels.includes(i);
        return (
          <li
            key={p}
            className={`flex items-center justify-between rounded-lg px-2.5 py-1 font-bold ${
              isNow ? 'text-[#0a1a52]' : passed ? 'text-[#FFD54A]' : safe ? 'text-white' : 'text-white/55'
            }`}
            style={isNow ? { background: 'linear-gradient(180deg,#FFE27A,#F5A623)' } : undefined}
          >
            <span className={isNow ? '' : 'opacity-70'}>{i + 1}</span>
            <span className="tabular-nums">
              {formatVnd(p)}
              {safe && !isNow && <span className="ml-1" aria-label="mốc an toàn">🛡️</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
