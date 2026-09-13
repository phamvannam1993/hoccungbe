'use client';

import type { Hop } from '../lib/xacSuat';

// Hộp bóng vẽ bằng SVG. Bóng xếp so le cho giống hộp thật, và ĐẾM ĐƯỢC —
// bé phải tự nhìn hộp có mấy quả mỗi màu chứ không đọc con số cho sẵn.

export default function HopBong({ hop, noiBat }: { hop: Hop; noiBat?: string }) {
  const qua = hop.bong.flatMap((b) => Array.from({ length: b.so }, () => b));
  const moiHang = Math.min(6, Math.max(3, Math.ceil(Math.sqrt(qua.length * 1.6))));
  const hang = Math.ceil(qua.length / moiHang);
  const R = 19;
  const W = moiHang * (R * 2 + 8) + 24;
  const H = hang * (R * 2 + 8) + 40;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[320px]" role="img"
         aria-label={`Hộp có ${hop.bong.map((b) => `${b.so} quả ${b.ten}`).join(', ')}`}>
      {/* Thành hộp */}
      <path d={`M 6 26 L ${W - 6} 26 L ${W - 16} ${H - 6} L 16 ${H - 6} Z`}
            fill="#fef3c7" stroke="#d97706" strokeWidth="3" strokeLinejoin="round" />
      <rect x="2" y="14" width={W - 4} height="16" rx="6" fill="#fcd34d" stroke="#d97706" strokeWidth="3" />

      {qua.map((b, i) => {
        const h = Math.floor(i / moiHang);
        const c = i % moiHang;
        // Hàng lẻ đẩy sang phải nửa quả cho giống bóng xếp trong hộp.
        const x = 20 + c * (R * 2 + 6) + (h % 2 ? R : 0);
        const y = 48 + h * (R * 2 + 4);
        const mo = noiBat && b.ma !== noiBat;
        return (
          <g key={i} opacity={mo ? 0.25 : 1}>
            <circle cx={x} cy={y} r={R} fill={b.mau} stroke="#0f172a22" strokeWidth="2" />
            <circle cx={x - R / 3} cy={y - R / 3} r={R / 3.4} fill="#fff" opacity="0.45" />
          </g>
        );
      })}
    </svg>
  );
}
