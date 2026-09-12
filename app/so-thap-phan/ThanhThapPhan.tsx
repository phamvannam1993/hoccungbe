'use client';

// Thanh chia 10 phần hoặc lưới 100 ô. Tô đầy từ trái sang phải như đổ nước
// vào cốc — nhờ vậy đặt hai thanh cạnh nhau là SO SÁNH ĐƯỢC BẰNG MẮT, không
// cần đếm chữ số.

export default function ThanhThapPhan({
  o, tong, mau = '#0ea5e9', bamDuoc = false, onBam, nhan,
}: {
  o: number;
  tong: 10 | 100;
  mau?: string;
  bamDuoc?: boolean;
  onBam?: (i: number) => void;
  nhan?: string;
}) {
  if (tong === 10) {
    return (
      <div className="w-full">
        {nhan && <p className="mb-1 text-center text-sm font-black text-slate-600">{nhan}</p>}
        <div className="flex w-full max-w-[420px] overflow-hidden rounded-xl border-2 border-slate-400">
          {Array.from({ length: 10 }, (_, i) => (
            <button
              key={i}
              disabled={!bamDuoc}
              onClick={() => onBam?.(i)}
              className={`h-14 flex-1 border-r border-slate-300 last:border-r-0 ${bamDuoc ? 'cursor-pointer' : 'cursor-default'}`}
              style={{ background: i < o ? mau : '#fff' }}
              aria-label={`Ô thứ ${i + 1}${i < o ? ' đã tô' : ''}`}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {nhan && <p className="mb-1 text-center text-sm font-black text-slate-600">{nhan}</p>}
      <div className="grid w-full max-w-[260px] grid-cols-10 overflow-hidden rounded-xl border-2 border-slate-400">
        {Array.from({ length: 100 }, (_, i) => (
          <button
            key={i}
            disabled={!bamDuoc}
            onClick={() => onBam?.(i)}
            // Kẻ đậm sau mỗi 5 ô để mắt đếm theo nhóm, khỏi đếm từng ô một.
            className={`aspect-square border-r border-b border-slate-200 ${(i % 5 === 4) ? 'border-r-slate-400' : ''} ${(Math.floor(i / 10) % 5 === 4) ? 'border-b-slate-400' : ''}`}
            style={{ background: i < o ? mau : '#fff' }}
            aria-label={`Ô thứ ${i + 1}${i < o ? ' đã tô' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
