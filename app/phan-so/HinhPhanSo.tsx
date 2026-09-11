'use client';

import type { PhanSo } from '../lib/phanSo';

// Vẽ phân số thành HÌNH: bánh tròn chia múi, hoặc thanh sô-cô-la chia ô.
//
// Bấm vào từng phần được (khi `bamDuoc`) — đây là chỗ khác hẳn sách in: bé tự
// tô lấy 3 trên 4 phần thì hiểu "3/4" bằng tay, không phải học thuộc.
//
// Mọi toạ độ đều LÀM TRÒN 2 chữ số: Math.cos/sin của máy chủ và của trình
// duyệt lệch nhau ở chữ số cuối, đủ để React báo HTML hai bên khác nhau.

const lam = (x: number) => Math.round(x * 100) / 100;

type Props = {
  phanSo: PhanSo;
  kieu?: 'tron' | 'thanh';
  /** Các phần đang được tô (chỉ số 0…mau-1). Không truyền thì tô `tu` phần đầu. */
  toDs?: number[];
  bamDuoc?: boolean;
  onBam?: (i: number) => void;
  mau?: string;
  cao?: number;
};

export default function HinhPhanSo({
  phanSo, kieu = 'tron', toDs, bamDuoc = false, onBam, mau = '#f97316', cao = 200,
}: Props) {
  const { tu, mau: soPhan } = phanSo;
  const to = toDs ?? Array.from({ length: tu }, (_, i) => i);
  const daTo = (i: number) => to.includes(i);

  if (kieu === 'thanh') {
    const W = 320;
    const H = 96;
    const rong = W / soPhan;
    return (
      <svg viewBox={`0 0 ${W} ${H}`} style={{ height: cao * 0.5 }} className="w-full max-w-[320px] touch-none"
           role="img" aria-label={`Thanh chia ${soPhan} phần, tô ${to.length} phần`}>
        {Array.from({ length: soPhan }, (_, i) => (
          <rect
            key={i}
            x={lam(i * rong) + 2} y={6} width={lam(rong) - 4} height={H - 12} rx={8}
            fill={daTo(i) ? mau : '#fff'}
            stroke={daTo(i) ? mau : '#cbd5e1'} strokeWidth="3"
            style={{ cursor: bamDuoc ? 'pointer' : 'default', transition: 'fill 200ms' }}
            onClick={() => bamDuoc && onBam?.(i)}
          />
        ))}
      </svg>
    );
  }

  const R = 92;
  const C = 100;
  const goc = 360 / soPhan;
  const diem = (g: number) => {
    const r = ((g - 90) * Math.PI) / 180;
    return `${lam(C + Math.cos(r) * R)} ${lam(C + Math.sin(r) * R)}`;
  };

  return (
    <svg viewBox="0 0 200 200" style={{ height: cao }} className="w-full max-w-[200px] touch-none"
         role="img" aria-label={`Hình tròn chia ${soPhan} phần, tô ${to.length} phần`}>
      {Array.from({ length: soPhan }, (_, i) => {
        const d = soPhan === 1
          ? `M ${C} ${C} m -${R} 0 a ${R} ${R} 0 1 0 ${R * 2} 0 a ${R} ${R} 0 1 0 -${R * 2} 0`
          : `M ${C} ${C} L ${diem(i * goc)} A ${R} ${R} 0 ${goc > 180 ? 1 : 0} 1 ${diem((i + 1) * goc)} Z`;
        return (
          <path
            key={i} d={d}
            fill={daTo(i) ? mau : '#fff'}
            stroke={daTo(i) ? mau : '#cbd5e1'} strokeWidth="3" strokeLinejoin="round"
            style={{ cursor: bamDuoc ? 'pointer' : 'default', transition: 'fill 200ms' }}
            onClick={() => bamDuoc && onBam?.(i)}
          />
        );
      })}
      <circle cx={C} cy={C} r={R} fill="none" stroke="#475569" strokeWidth="3.5" />
    </svg>
  );
}

/** Phân số viết kiểu tử trên, gạch ngang, mẫu dưới. */
export function ChuPhanSo({ p, co = 'lon' }: { p: PhanSo; co?: 'lon' | 'nho' }) {
  const lon = co === 'lon';
  return (
    <span className="inline-flex flex-col items-center align-middle leading-none">
      <span className={lon ? 'text-3xl font-black' : 'text-lg font-black'}>{p.tu}</span>
      <span className={`my-0.5 block w-full border-t-[3px] border-current ${lon ? 'min-w-[28px]' : 'min-w-[18px]'}`} />
      <span className={lon ? 'text-3xl font-black' : 'text-lg font-black'}>{p.mau}</span>
    </span>
  );
}
