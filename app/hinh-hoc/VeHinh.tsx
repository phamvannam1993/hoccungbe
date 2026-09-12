'use client';

import type { TenHinh } from '../lib/hinhHoc';

// Vẽ hình phẳng và khối 3D bằng SVG.
//
// Cố ý vẽ hình ở tư thế HƠI XOAY với vài hình (thoi, bình hành, tam giác) —
// sách hay in hình "đứng thẳng" nên bé quen mắt, gặp hình xoay là không nhận
// ra nữa. Nhận hình phải dựa vào số cạnh và góc, không dựa vào tư thế.

const D: Record<TenHinh, { d?: string; tron?: boolean }> = {
  'tron': { tron: true },
  'tam-giac': { d: 'M 100 26 L 172 156 L 28 156 Z' },
  'vuong': { d: 'M 36 36 L 164 36 L 164 164 L 36 164 Z' },
  'chu-nhat': { d: 'M 22 54 L 178 54 L 178 146 L 22 146 Z' },
  'tu-giac': { d: 'M 34 44 L 170 30 L 158 160 L 46 138 Z' },
  'ngu-giac': { d: 'M 100 24 L 176 79 L 147 168 L 53 168 L 24 79 Z' },
  'luc-giac': { d: 'M 100 22 L 168 61 L 168 139 L 100 178 L 32 139 L 32 61 Z' },
  'binh-hanh': { d: 'M 48 52 L 186 52 L 152 148 L 14 148 Z' },
  'thoi': { d: 'M 100 22 L 170 100 L 100 178 L 30 100 Z' },
  'thang': { d: 'M 58 54 L 142 54 L 182 152 L 18 152 Z' },
};

export default function VeHinh({ ma, mau = '#0ea5e9', co = 200 }: { ma: TenHinh; mau?: string; co?: number }) {
  const h = D[ma];
  return (
    <svg viewBox="0 0 200 200" style={{ width: co, height: co }} role="img" aria-label={`Hình ${ma}`}>
      {h.tron
        ? <circle cx="100" cy="100" r="76" fill={`${mau}26`} stroke={mau} strokeWidth="5" />
        : <path d={h.d} fill={`${mau}26`} stroke={mau} strokeWidth="5" strokeLinejoin="round" />}
    </svg>
  );
}

/** Khối 3D vẽ kiểu phối cảnh đơn giản — đủ để bé nhận ra, không cần chính xác. */
export function VeKhoi({ ma, mau = '#8b5cf6', co = 190 }: { ma: string; mau?: string; co?: number }) {
  const nhat = `${mau}26`;
  const dam = `${mau}55`;
  return (
    <svg viewBox="0 0 200 200" style={{ width: co, height: co }} role="img" aria-label={`Khối ${ma}`}>
      {ma === 'lap-phuong' && (
        <g stroke={mau} strokeWidth="4" strokeLinejoin="round">
          <path d="M 50 70 L 130 70 L 130 150 L 50 150 Z" fill={nhat} />
          <path d="M 50 70 L 80 40 L 160 40 L 130 70 Z" fill={dam} />
          <path d="M 130 70 L 160 40 L 160 120 L 130 150 Z" fill={dam} />
        </g>
      )}
      {ma === 'hop-chu-nhat' && (
        <g stroke={mau} strokeWidth="4" strokeLinejoin="round">
          <path d="M 34 82 L 142 82 L 142 146 L 34 146 Z" fill={nhat} />
          <path d="M 34 82 L 62 52 L 170 52 L 142 82 Z" fill={dam} />
          <path d="M 142 82 L 170 52 L 170 116 L 142 146 Z" fill={dam} />
        </g>
      )}
      {ma === 'cau' && (
        <g stroke={mau} strokeWidth="4">
          <circle cx="100" cy="100" r="66" fill={nhat} />
          <ellipse cx="100" cy="100" rx="66" ry="22" fill="none" strokeDasharray="6 5" opacity="0.7" />
        </g>
      )}
      {ma === 'tru' && (
        <g stroke={mau} strokeWidth="4">
          <path d="M 46 62 L 46 138" fill="none" />
          <path d="M 154 62 L 154 138" fill="none" />
          <ellipse cx="100" cy="62" rx="54" ry="20" fill={dam} />
          <path d="M 46 62 A 54 20 0 0 0 154 62 L 154 138 A 54 20 0 0 1 46 138 Z" fill={nhat} />
          <ellipse cx="100" cy="138" rx="54" ry="20" fill="none" />
        </g>
      )}
      {ma === 'non' && (
        <g stroke={mau} strokeWidth="4" strokeLinejoin="round">
          <path d="M 100 36 L 158 146 A 58 20 0 0 1 42 146 Z" fill={nhat} />
          <ellipse cx="100" cy="146" rx="58" ry="20" fill={dam} />
        </g>
      )}
      {ma === 'chop-tu-giac' && (
        <g stroke={mau} strokeWidth="4" strokeLinejoin="round">
          <path d="M 100 34 L 168 132 L 62 158 Z" fill={dam} />
          <path d="M 100 34 L 62 158 L 32 116 Z" fill={nhat} />
          <path d="M 32 116 L 62 158 L 168 132" fill="none" strokeDasharray="5 4" opacity="0.8" />
        </g>
      )}
    </svg>
  );
}
