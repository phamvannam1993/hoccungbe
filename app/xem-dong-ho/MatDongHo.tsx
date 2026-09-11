'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { gocKimGio, gocKimPhut, gioTuGoc, phutTuGoc, type Gio } from '../lib/dongHo';

// Mặt đồng hồ vẽ bằng SVG, KÉO ĐƯỢC KIM.
//
// Vì sao phải kéo được: bé nhìn hình tĩnh thì học thuộc "kim ngắn chỉ 3 là 3
// giờ", nhưng không hiểu vì sao 3 giờ rưỡi kim ngắn lại nằm giữa 3 và 4. Tự
// tay quay kim thì thấy ngay kim giờ nhích dần theo kim phút.

const R = 140;      // bán kính mặt
const TAM = 150;    // tâm

type Props = {
  gio: Gio;
  /** Có cho kéo kim không; kèm bước làm tròn theo mức độ. */
  keoDuoc?: boolean;
  buoc?: number;
  onDoi?: (g: Gio) => void;
  /** Hiện số phút nhỏ quanh mặt (5, 10, 15…) — lớp 1 chưa cần. */
  hienPhut?: boolean;
  mau?: string;
};

export default function MatDongHo({ gio, keoDuoc = false, buoc = 5, onDoi, hienPhut = true, mau = '#2563eb' }: Props) {
  const svg = useRef<SVGSVGElement | null>(null);
  const [dangKeo, setDangKeo] = useState<'gio' | 'phut' | null>(null);

  const gocTu = useCallback((e: { clientX: number; clientY: number }) => {
    const el = svg.current;
    if (!el) return 0;
    const o = el.getBoundingClientRect();
    const x = ((e.clientX - o.left) / o.width) * 300 - TAM;
    const y = ((e.clientY - o.top) / o.height) * 300 - TAM;
    return (Math.atan2(x, -y) * 180) / Math.PI; // 0° ở vạch 12, tăng theo chiều kim
  }, []);

  // Kéo kim: theo dõi ở cấp document để ngón tay trượt ra ngoài mặt đồng hồ
  // vẫn còn ăn — trẻ nhỏ kéo rất rộng tay.
  useEffect(() => {
    if (!dangKeo) return;
    const di = (e: PointerEvent) => {
      e.preventDefault();
      const goc = gocTu(e);
      if (dangKeo === 'phut') {
        const phut = phutTuGoc(goc, buoc);
        // Kim phút vượt qua vạch 12 thì kim giờ phải sang giờ kế tiếp — chỗ
        // này mà bỏ qua là đồng hồ chạy sai kiểu "3 giờ 59 rồi về 3 giờ 00".
        const truoc = gio.phut;
        let g = gio.gio;
        if (truoc > 45 && phut < 15) g = (g % 12) + 1;
        else if (truoc < 15 && phut > 45) g = g === 1 ? 12 : g - 1;
        onDoi?.({ gio: g, phut });
      } else {
        onDoi?.({ gio: gioTuGoc(goc), phut: gio.phut });
      }
    };
    const thoi = () => setDangKeo(null);
    document.addEventListener('pointermove', di, { passive: false });
    document.addEventListener('pointerup', thoi);
    document.addEventListener('pointercancel', thoi);
    return () => {
      document.removeEventListener('pointermove', di);
      document.removeEventListener('pointerup', thoi);
      document.removeEventListener('pointercancel', thoi);
    };
  }, [dangKeo, buoc, gio, gocTu, onDoi]);

  const gPhut = gocKimPhut(gio);
  const gGio = gocKimGio(gio);
  // LÀM TRÒN 2 chữ số thập phân. Math.cos/sin của Node và của trình duyệt lệch
  // nhau ở chữ số cuối (42.612849930729624 với 42.61284993072964), đủ để React
  // báo HTML máy chủ khác HTML trình duyệt. Đã đo thật trên trang này.
  const lam = (x: number) => Math.round(x * 100) / 100;
  const dau = (goc: number, dai: number) => {
    const r = (goc - 90) * (Math.PI / 180);
    return { x: lam(TAM + Math.cos(r) * dai), y: lam(TAM + Math.sin(r) * dai) };
  };
  const mp = dau(gPhut, R - 26);
  const mg = dau(gGio, R - 62);

  return (
    <svg
      ref={svg}
      viewBox="0 0 300 300"
      className="w-full max-w-[300px] touch-none select-none"
      role="img"
      aria-label={`Mặt đồng hồ chỉ ${gio.gio} giờ ${gio.phut} phút`}
    >
      <circle cx={TAM} cy={TAM} r={R} fill="#fff" stroke={mau} strokeWidth="8" />
      <circle cx={TAM} cy={TAM} r={R - 14} fill="#f8fafc" />

      {/* 60 vạch phút, vạch 5 phút dài và đậm hơn */}
      {Array.from({ length: 60 }, (_, i) => {
        const lon = i % 5 === 0;
        const a = dau(i * 6, R - 16);
        const b = dau(i * 6, R - (lon ? 30 : 23));
        return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                     stroke={lon ? '#334155' : '#cbd5e1'} strokeWidth={lon ? 3 : 1.5} strokeLinecap="round" />;
      })}

      {/* Số giờ 1–12 */}
      {Array.from({ length: 12 }, (_, i) => {
        const so = i + 1;
        const p = dau(so * 30, R - 48);
        return <text key={so} x={p.x} y={p.y + 8} textAnchor="middle" fontSize="26" fontWeight="800" fill="#0f172a">{so}</text>;
      })}

      {/* Số phút nhỏ (5, 10, 15…) — giúp bé đọc kim phút mà không phải đếm vạch */}
      {hienPhut && Array.from({ length: 12 }, (_, i) => {
        const p = dau(i * 30, R - 76);
        return <text key={i} x={p.x} y={p.y + 5} textAnchor="middle" fontSize="13" fontWeight="700" fill="#94a3b8">{i * 5}</text>;
      })}

      {/* KIM PHÚT (dài, mảnh) */}
      <line x1={TAM} y1={TAM} x2={mp.x} y2={mp.y} stroke="#0ea5e9" strokeWidth="7" strokeLinecap="round"
            style={{ transition: dangKeo ? 'none' : 'all 320ms cubic-bezier(.4,0,.2,1)' }} />
      {/* KIM GIỜ (ngắn, dày) */}
      <line x1={TAM} y1={TAM} x2={mg.x} y2={mg.y} stroke="#dc2626" strokeWidth="10" strokeLinecap="round"
            style={{ transition: dangKeo ? 'none' : 'all 320ms cubic-bezier(.4,0,.2,1)' }} />

      {keoDuoc && (
        <>
          {/* Núm kéo: vòng tròn trong suốt to hơn kim để ngón tay trẻ bắt trúng */}
          <circle cx={mp.x} cy={mp.y} r="20" fill="#0ea5e9" fillOpacity={dangKeo === 'phut' ? 0.35 : 0.16}
                  style={{ cursor: 'grab' }} onPointerDown={(e) => { e.preventDefault(); setDangKeo('phut'); }} />
          <circle cx={mg.x} cy={mg.y} r="20" fill="#dc2626" fillOpacity={dangKeo === 'gio' ? 0.35 : 0.16}
                  style={{ cursor: 'grab' }} onPointerDown={(e) => { e.preventDefault(); setDangKeo('gio'); }} />
        </>
      )}

      <circle cx={TAM} cy={TAM} r="11" fill="#0f172a" />
      <circle cx={TAM} cy={TAM} r="4" fill="#fff" />
    </svg>
  );
}
