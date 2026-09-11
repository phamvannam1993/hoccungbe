'use client';

import { useEffect, useState } from 'react';
import { amTheoNhom, type AmIpa, type KhauHinhSo } from '../lib/ipa';

// Bản đồ 20 nguyên âm — chính là "hình thang nguyên âm" của ngữ âm học, vẽ lại
// cho trẻ nhìn được: trục dọc là lưỡi cao/thấp, trục ngang là lưỡi trước/sau.
//
// Cái hay là NGUYÊN ÂM ĐÔI hiện thành một mũi tên: bé thấy ngay /aɪ/ đi từ góc
// dưới lên góc trên, còn /ɔɪ/ đi từ phải sang trái. Bảng chữ in không làm được
// việc đó, và đây là chỗ trẻ hay học vẹt nhất.

const W = 460;
const H = 320;
const LE = { t: 30, p: 30, tr: 44, d: 40 };

const toaDo = (h: KhauHinhSo) => ({
  x: LE.tr + (1 - h.truoc) * (W - LE.tr - LE.p),
  y: LE.t + (1 - h.cao) * (H - LE.t - LE.d),
});

const moc = (a: AmIpa) => (Array.isArray(a.hinh) ? a.hinh : [a.hinh]) as KhauHinhSo[];

export default function BanDoNguyenAm({ onChon }: { onChon?: (am: string) => void }) {
  const don = amTheoNhom('don');
  const doi = amTheoNhom('doi');
  const [hien, setHien] = useState<'don' | 'doi'>('don');
  const [chay, setChay] = useState(0);

  // Chấm chạy dọc mũi tên để mắt bám theo hướng trượt.
  useEffect(() => {
    if (hien !== 'doi') return;
    let t = 0;
    const id = setInterval(() => { t = (t + 0.02) % 1; setChay(t); }, 30);
    return () => clearInterval(id);
  }, [hien]);

  return (
    <div>
      <div className="mb-3 flex gap-2">
        {([['don', '12 nguyên âm đơn'], ['doi', '8 nguyên âm đôi']] as const).map(([id, ten]) => (
          <button
            key={id}
            onClick={() => setHien(id)}
            className={`rounded-full border-2 px-3.5 py-1.5 text-xs font-black transition ${
              hien === id ? 'border-amber-500 bg-amber-500 text-white' : 'border-amber-200 bg-amber-50 text-amber-700'}`}
          >
            {ten}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="min-w-[340px]" role="img"
             aria-label="Bản đồ vị trí lưỡi của các nguyên âm tiếng Anh">
          {/* Khung hình thang — vùng lưỡi có thể với tới */}
          <path d={`M ${LE.tr} ${LE.t} L ${W - LE.p} ${LE.t} L ${W - LE.p - 46} ${H - LE.d} L ${LE.tr + 16} ${H - LE.d} Z`}
                fill="#fffbeb" stroke="#fcd34d" strokeWidth="2" />

          {/* Nhãn trục */}
          <text x={LE.tr} y={18} fontSize="12" fill="#92400e" fontWeight="700">lưỡi ra TRƯỚC</text>
          <text x={W - LE.p} y={18} fontSize="12" fill="#92400e" fontWeight="700" textAnchor="end">lưỡi lùi SAU</text>
          <text x={6} y={LE.t + 10} fontSize="12" fill="#92400e" fontWeight="700">cao</text>
          <text x={6} y={H - LE.d} fontSize="12" fill="#92400e" fontWeight="700">thấp</text>

          {hien === 'don' && don.map((a) => {
            const p = toaDo(moc(a)[0]);
            return (
              <g key={a.am} onClick={() => onChon?.(a.am)} style={{ cursor: onChon ? 'pointer' : 'default' }}>
                <circle cx={p.x} cy={p.y} r="17" fill="#fff" stroke="#f59e0b" strokeWidth="2.5" />
                <text x={p.x} y={p.y + 5} textAnchor="middle" fontSize="14" fontWeight="800" fill="#b45309">{a.am}</text>
              </g>
            );
          })}

          {hien === 'doi' && doi.map((a) => {
            const [m1, m2] = moc(a);
            const p1 = toaDo(m1);
            const p2 = toaDo(m2);
            const px = p1.x + (p2.x - p1.x) * chay;
            const py = p1.y + (p2.y - p1.y) * chay;
            return (
              <g key={a.am} onClick={() => onChon?.(a.am)} style={{ cursor: onChon ? 'pointer' : 'default' }}>
                <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#a855f7" strokeWidth="2.5"
                      strokeDasharray="5 4" markerEnd="url(#ten-doi)" opacity="0.75" />
                <circle cx={px} cy={py} r="5" fill="#a855f7" opacity="0.9" />
                <circle cx={p1.x} cy={p1.y} r="15" fill="#faf5ff" stroke="#a855f7" strokeWidth="2.5" />
                <text x={p1.x} y={p1.y + 5} textAnchor="middle" fontSize="12" fontWeight="800" fill="#7e22ce">{a.am}</text>
              </g>
            );
          })}

          <defs>
            <marker id="ten-doi" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#a855f7" />
            </marker>
          </defs>
        </svg>
      </div>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {hien === 'don'
          ? 'Mỗi chấm là một nguyên âm đơn — lưỡi đứng yên một chỗ suốt cả âm. Bấm vào chấm để mở thẻ chi tiết.'
          : 'Mũi tên là đường lưỡi trượt của nguyên âm đôi: bắt đầu ở vòng tròn, kết thúc ở đầu mũi tên. Đọc liền một hơi, không tách đôi.'}
      </p>
    </div>
  );
}
