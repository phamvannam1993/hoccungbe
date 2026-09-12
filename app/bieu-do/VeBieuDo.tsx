'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { BoSoLieu } from '../lib/bieuDo';

// Biểu đồ cột. Kéo được khi `keoDuoc` — dùng cho dạng bé TỰ VẼ biểu đồ từ
// bảng số liệu. Đọc biểu đồ và vẽ biểu đồ là hai việc khác nhau; biết đọc chưa
// chắc đã vẽ được, nên có cả hai chiều.

const CAO = 230;
const RONG_COT = 54;
const LE_TRAI = 42;
const LE_DUOI = 52;

export default function BieuDoCot({
  bo, toiDa, giaTri, keoDuoc = false, onDoi, sai,
}: {
  bo: BoSoLieu;
  toiDa: number;
  /** Chiều cao đang vẽ của từng cột; không truyền thì lấy số liệu thật. */
  giaTri?: number[];
  keoDuoc?: boolean;
  onDoi?: (i: number, v: number) => void;
  /** Sau khi chấm: đánh dấu cột nào sai. */ sai?: boolean[];
}) {
  const svg = useRef<SVGSVGElement | null>(null);
  const [keo, setKeo] = useState<number | null>(null);
  const gt = giaTri ?? bo.cot.map((c) => c.gia);
  const W = LE_TRAI + bo.cot.length * RONG_COT + 16;
  const H = CAO + LE_DUOI;
  const yCua = (v: number) => CAO - (v / toiDa) * (CAO - 16);

  const doVe = useCallback((e: { clientY: number }) => {
    const el = svg.current;
    if (el == null || keo == null) return;
    const b = el.getBoundingClientRect();
    const y = ((e.clientY - b.top) / b.height) * H;
    const v = Math.round(((CAO - y) / (CAO - 16)) * toiDa);
    onDoi?.(keo, Math.max(0, Math.min(toiDa, v)));
  }, [keo, H, toiDa, onDoi]);

  useEffect(() => {
    if (keo == null) return;
    const di = (e: PointerEvent) => { e.preventDefault(); doVe(e); };
    const thoi = () => setKeo(null);
    document.addEventListener('pointermove', di, { passive: false });
    document.addEventListener('pointerup', thoi);
    document.addEventListener('pointercancel', thoi);
    return () => {
      document.removeEventListener('pointermove', di);
      document.removeEventListener('pointerup', thoi);
      document.removeEventListener('pointercancel', thoi);
    };
  }, [keo, doVe]);

  // Mốc trục dọc: chia thành khoảng tròn cho dễ đọc.
  const buoc = toiDa <= 10 ? 1 : toiDa <= 25 ? 5 : 10;
  const moc: number[] = [];
  for (let v = 0; v <= toiDa; v += buoc) moc.push(v);

  return (
    <svg ref={svg} viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[420px] touch-none select-none"
         role="img" aria-label={`Biểu đồ cột: ${bo.cot.map((c, i) => `${c.nhan} ${gt[i]}`).join(', ')}`}>
      {/* Lưới ngang + số trên trục dọc */}
      {moc.map((v) => (
        <g key={v}>
          <line x1={LE_TRAI - 6} y1={yCua(v)} x2={W - 8} y2={yCua(v)} stroke="#e2e8f0" strokeWidth="1" />
          <text x={LE_TRAI - 10} y={yCua(v) + 4} textAnchor="end" fontSize="11" fontWeight="700" fill="#94a3b8">{v}</text>
        </g>
      ))}
      <line x1={LE_TRAI} y1="10" x2={LE_TRAI} y2={CAO} stroke="#475569" strokeWidth="2" />
      <line x1={LE_TRAI} y1={CAO} x2={W - 8} y2={CAO} stroke="#475569" strokeWidth="2" />

      {bo.cot.map((c, i) => {
        const x = LE_TRAI + 10 + i * RONG_COT;
        const y = yCua(gt[i]);
        const mauCot = sai ? (sai[i] ? '#fb7185' : '#34d399') : '#6366f1';
        return (
          <g key={c.nhan}>
            <rect x={x} y={y} width={RONG_COT - 20} height={Math.max(0, CAO - y)} rx="5"
                  fill={mauCot} opacity="0.9" />
            {gt[i] > 0 && (
              <text x={x + (RONG_COT - 20) / 2} y={y - 6} textAnchor="middle" fontSize="13" fontWeight="800" fill="#334155">
                {gt[i]}
              </text>
            )}
            {keoDuoc && (
              <circle cx={x + (RONG_COT - 20) / 2} cy={y} r="13" fill={mauCot} fillOpacity={keo === i ? 0.4 : 0.18}
                      style={{ cursor: 'grab' }}
                      onPointerDown={(e) => { e.preventDefault(); setKeo(i); }} />
            )}
            <text x={x + (RONG_COT - 20) / 2} y={CAO + 20} textAnchor="middle" fontSize="18">{c.emoji}</text>
            <text x={x + (RONG_COT - 20) / 2} y={CAO + 38} textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569">
              {c.nhan}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** Biểu đồ tranh: mỗi hình đại diện cho `heSo` đơn vị. */
export function BieuDoTranh({ bo }: { bo: BoSoLieu }) {
  return (
    <div className="w-full">
      {bo.cot.map((c) => (
        <div key={c.nhan} className="flex items-center gap-2 border-b border-slate-100 py-1.5 last:border-0">
          <span className="w-20 shrink-0 text-sm font-bold text-slate-600">{c.nhan}</span>
          <span className="flex flex-wrap gap-0.5 text-xl leading-none">
            {Array.from({ length: c.gia / bo.heSo }, (_, i) => (
              <span key={i} aria-hidden>{c.emoji}</span>
            ))}
          </span>
        </div>
      ))}
      <p className="mt-2 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-black text-indigo-700">
        Mỗi {bo.cot[0].emoji} là <b>{bo.heSo}</b> {bo.donVi}
      </p>
    </div>
  );
}
