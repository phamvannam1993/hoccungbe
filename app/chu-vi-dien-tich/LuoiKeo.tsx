'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// Lưới ô vuông có hình chữ nhật KÉO ĐƯỢC ở góc dưới bên phải.
//
// Đây là chỗ bé vỡ lẽ: kéo cho dài ra thì diện tích tăng nhanh hơn chu vi, và
// nhiều hình khác nhau vẫn có cùng một chu vi. Nhìn số đổi theo tay mình kéo
// thì hiểu, chứ đọc công thức thì chỉ thuộc.

const O = 30; // bề rộng một ô, tính bằng pixel

export default function LuoiKeo({
  toiDa, dai, rong, onDoi,
}: { toiDa: number; dai: number; rong: number; onDoi: (d: number, r: number) => void }) {
  const svg = useRef<SVGSVGElement | null>(null);
  const [keo, setKeo] = useState(false);
  const W = toiDa * O;

  const doVeO = useCallback((e: { clientX: number; clientY: number }) => {
    const el = svg.current;
    if (!el) return;
    const b = el.getBoundingClientRect();
    const x = ((e.clientX - b.left) / b.width) * W;
    const y = ((e.clientY - b.top) / b.height) * W;
    const d = Math.max(1, Math.min(toiDa, Math.round(x / O)));
    const r = Math.max(1, Math.min(toiDa, Math.round(y / O)));
    onDoi(d, r);
  }, [W, toiDa, onDoi]);

  // Theo dõi ở cấp document để ngón tay trượt ra ngoài lưới vẫn còn ăn.
  useEffect(() => {
    if (!keo) return;
    const di = (e: PointerEvent) => { e.preventDefault(); doVeO(e); };
    const thoi = () => setKeo(false);
    document.addEventListener('pointermove', di, { passive: false });
    document.addEventListener('pointerup', thoi);
    document.addEventListener('pointercancel', thoi);
    return () => {
      document.removeEventListener('pointermove', di);
      document.removeEventListener('pointerup', thoi);
      document.removeEventListener('pointercancel', thoi);
    };
  }, [keo, doVeO]);

  return (
    <svg ref={svg} viewBox={`0 0 ${W + 2} ${W + 2}`} className="w-full max-w-[380px] touch-none select-none"
         role="img" aria-label={`Hình chữ nhật dài ${dai} ô, rộng ${rong} ô trên lưới ${toiDa} ô`}>
      {/* Lưới nền */}
      {Array.from({ length: toiDa + 1 }, (_, i) => (
        <g key={i}>
          <line x1={i * O + 1} y1="1" x2={i * O + 1} y2={W + 1} stroke="#e2e8f0" strokeWidth="1" />
          <line x1="1" y1={i * O + 1} x2={W + 1} y2={i * O + 1} stroke="#e2e8f0" strokeWidth="1" />
        </g>
      ))}

      {/* Hình chữ nhật hiện tại */}
      <rect x="1" y="1" width={dai * O} height={rong * O} fill="#22c55e33" stroke="#16a34a" strokeWidth="3" />

      {/* Đánh dấu từng ô bên trong để bé ĐẾM được diện tích, không chỉ tính */}
      {dai * rong <= 80 && Array.from({ length: rong }, (_, y) =>
        Array.from({ length: dai }, (_, x) => (
          <circle key={`${x}-${y}`} cx={x * O + O / 2 + 1} cy={y * O + O / 2 + 1} r="2.5" fill="#16a34a" opacity="0.5" />
        )),
      )}

      {/* Núm kéo ở góc dưới bên phải */}
      <circle cx={dai * O + 1} cy={rong * O + 1} r="11" fill="#16a34a" />
      <circle cx={dai * O + 1} cy={rong * O + 1} r="20" fill="#16a34a" fillOpacity={keo ? 0.25 : 0.12}
              style={{ cursor: 'grab' }}
              onPointerDown={(e) => { e.preventDefault(); setKeo(true); }} />

      {/* Số đo cạnh */}
      <text x={(dai * O) / 2 + 1} y={rong * O + 24} textAnchor="middle" fontSize="14" fontWeight="800" fill="#15803d">
        {dai}
      </text>
      <text x={dai * O + 18} y={(rong * O) / 2 + 6} fontSize="14" fontWeight="800" fill="#15803d">
        {rong}
      </text>
    </svg>
  );
}
