'use client';

import type { BaiTimX } from '../lib/timX';

// Cân minh hoạ cho phương trình: đĩa trái là vế trái, đĩa phải là vế phải.
//
// Trước khi bé chọn, cân NẰM NGANG (vì đề nói hai vế bằng nhau). Sau khi chọn,
// cân nghiêng theo đúng giá trị bé chọn — chọn sai thì thấy ngay cân lệch, đó
// là cách "thử lại" trực quan nhất.

export default function CanTimX({ bai, xThu }: { bai: BaiTimX; xThu: number | null }) {
  const traiThat = xThu === null ? bai.b : (bai.dang === 'nhan' ? xThu * bai.a : xThu + bai.a);
  const lech = traiThat - bai.b;
  const goc = xThu === null ? 0 : Math.max(-11, Math.min(11, (lech / Math.max(bai.b, 1)) * 26));

  return (
    <svg viewBox="0 0 420 210" className="w-full max-w-[420px]" role="img"
         aria-label={xThu === null ? 'Cân thăng bằng' : lech === 0 ? 'Cân vẫn thăng bằng' : 'Cân bị lệch'}>
      <rect x="200" y="62" width="20" height="112" rx="4" fill="#94a3b8" />
      <rect x="142" y="172" width="136" height="15" rx="7" fill="#64748b" />

      <g transform={`rotate(${Math.round(-goc * 100) / 100} 210 64)`}
         style={{ transition: 'transform 520ms cubic-bezier(.4,0,.2,1)' }}>
        <rect x="42" y="58" width="336" height="12" rx="6" fill="#475569" />

        {/* Đĩa trái: vế có x */}
        <g>
          <line x1="72" y1="64" x2="72" y2="100" stroke="#475569" strokeWidth="3" />
          <path d="M 20 100 L 124 100 L 108 126 L 36 126 Z" fill="#ddd6fe" stroke="#6d28d9" strokeWidth="2.5" />
          <text x="72" y="92" textAnchor="middle" fontSize="17" fontWeight="800" fill="#4c1d95">
            {bai.dang === 'nhan'
              ? `${xThu ?? 'x'} × ${bai.a}`
              : bai.dang === 'cong-dao'
                ? `${bai.a} + ${xThu ?? 'x'}`
                : `${xThu ?? 'x'} + ${bai.a}`}
          </text>
        </g>

        {/* Đĩa phải: vế đã biết */}
        <g>
          <line x1="348" y1="64" x2="348" y2="100" stroke="#475569" strokeWidth="3" />
          <path d="M 296 100 L 400 100 L 384 126 L 312 126 Z" fill="#cbd5e1" stroke="#475569" strokeWidth="2.5" />
          <text x="348" y="92" textAnchor="middle" fontSize="17" fontWeight="800" fill="#334155">{bai.b}</text>
        </g>
      </g>

      <text x="210" y="204" textAnchor="middle" fontSize="13" fontWeight="800"
            fill={xThu === null ? '#6d28d9' : lech === 0 ? '#16a34a' : '#b45309'}>
        {xThu === null
          ? 'Hai đĩa đang bằng nhau — tìm x để giữ nguyên như vậy'
          : lech === 0 ? '⚖️ Vẫn thăng bằng — x đúng rồi!'
          : lech > 0 ? 'Đĩa trái nặng hơn — x chọn hơi lớn' : 'Đĩa trái nhẹ hơn — x chọn hơi nhỏ'}
      </text>
    </svg>
  );
}
