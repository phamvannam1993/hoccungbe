'use client';

import { useEffect, useState } from 'react';
import type { AmIpa, KhauHinhSo, DiemCan } from '../lib/ipa';

// Hình cắt dọc miệng, VẼ THEO SỐ ĐO nên chuyển động được.
//
// Các trang khác dùng 44 tấm ảnh tĩnh: bé nhìn thấy lưỡi ở đâu, nhưng không
// thấy nó ĐI thế nào. Ở đây lưỡi và môi là đường cong tính từ bốn con số, đổi
// âm là nó bò dần sang vị trí mới; nguyên âm đôi thì chạy từ mốc đầu sang mốc
// cuối rồi lặp lại — đúng thứ bé cần bắt chước.

const W = 320;
const H = 320;

/** Trần vòm miệng tại hoành độ x — lưỡi không được chồm lên trên đường này. */
const tranVom = (x: number) =>
  194 - Math.sin(Math.min(1, Math.max(0, (x - 104) / 118)) * Math.PI) * 18;

/** Vị trí đỉnh lưỡi theo số đo: trước/sau theo trục x, cao/thấp theo trục y. */
function dinhLuoi(h: KhauHinhSo) {
  const x = 118 + (1 - h.truoc) * 92;
  const y = Math.max(236 - h.cao * 54, tranVom(x) + 14);
  return { x, y };
}

/** Lưng lưỡi là một gò tròn bám sàn miệng, gốc lưỡi cuộn xuống họng. */
function duongLuoi(h: KhauHinhSo) {
  const { x, y } = dinhLuoi(h);
  return `M 110 262 C 112 ${y + 30} ${x - 48} ${y + 8} ${x} ${y}
          C ${x + 40} ${y + 10} 202 ${y + 40} 214 240
          C 220 262 214 278 204 280 L 124 280 C 112 278 108 272 110 262 Z`;
}

/** Khe môi: mở theo `mo`; môi tròn thì dày lên và nhô ra trước. */
const soMoi = (h: KhauHinhSo) => ({ khe: 6 + h.mo * 28, day: 12 + h.tron * 5, nho: h.tron * 12 });

const DIEM_CAN: Record<DiemCan, { x: number; y: number; ten: string }> = {
  'moi':      { x: 72,  y: 204, ten: 'hai môi' },
  'moi-rang': { x: 88,  y: 200, ten: 'môi dưới + răng trên' },
  'rang':     { x: 100, y: 200, ten: 'lưỡi giữa hai hàm răng' },
  'loi':      { x: 112, y: 196, ten: 'đầu lưỡi ở lợi' },
  'sau-loi':  { x: 134, y: 188, ten: 'sau lợi' },
  'vom-cung': { x: 168, y: 180, ten: 'vòm cứng' },
  'vom-mem':  { x: 204, y: 190, ten: 'vòm mềm' },
  'hong':     { x: 224, y: 240, ten: 'thanh hầu' },
};

export default function KhauHinh({ am, mau }: { am: AmIpa; mau: string }) {
  const doi = Array.isArray(am.hinh);
  const mocs = (Array.isArray(am.hinh) ? am.hinh : [am.hinh]) as KhauHinhSo[];
  const [buoc, setBuoc] = useState(0);

  // Nguyên âm đôi: tự chạy đi chạy lại giữa hai mốc để thấy rõ đường trượt.
  // Không cần đặt lại mốc khi đổi âm: bên gọi truyền key={am} nên component
  // dựng mới hẳn, state tự về 0.
  useEffect(() => {
    if (!doi) return;
    const id = setInterval(() => setBuoc((b) => (b === 0 ? 1 : 0)), 1400);
    return () => clearInterval(id);
  }, [am.am, doi]);

  const h = mocs[Math.min(buoc, mocs.length - 1)];
  const m = soMoi(h);
  const yTren = 204 - m.khe / 2;
  const yDuoi = 204 + m.khe / 2;
  const can = am.can ? DIEM_CAN[am.can] : null;
  const dinh = dinhLuoi(h);

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img"
           aria-label={`Hình khẩu hình của âm ${am.am}: ${am.khauHinh}, ${am.luoi}`}>
        {/* ĐẦU nghiêng, mặt quay sang trái. Ba mốc nhô ra theo đúng thứ tự của
            mặt người: chóp mũi nhô nhất, rồi tới môi, rồi cằm. */}
        <path
          d="M 152 14 C 230 14 292 76 292 156 C 292 232 256 292 196 304
             L 130 304 C 110 302 98 290 94 274
             C 90 258 84 250 76 246 C 64 240 62 228 74 224 L 100 218
             L 100 192 L 74 186 C 62 182 64 170 76 166 C 84 163 88 158 88 152
             L 30 134 C 24 132 24 126 30 124 L 88 104
             C 92 70 108 30 152 14 Z"
          fill="#fff8ef" stroke="#f4a52a" strokeWidth="3" strokeLinejoin="round"
        />

        {/* Khoang mũi */}
        <path d="M 74 132 C 118 114 178 112 220 124 C 236 134 238 156 224 160 C 176 148 116 154 70 162 Z"
              fill="#ffe4e8" stroke="#f79cab" strokeWidth="1.6" />

        {/* Khoang miệng (vùng trống giữa vòm và lưỡi) */}
        <path d="M 100 200 C 140 174 188 170 222 182 L 222 258 C 178 278 130 276 104 260 Z" fill="#fffdfa" />

        {/* Vòm cứng + vòm mềm + lưỡi gà */}
        <path d="M 100 198 C 138 168 188 164 220 178 C 234 186 234 208 222 220 C 218 210 218 202 212 196 C 176 184 132 190 104 208 Z"
              fill="#fbc0ca" stroke="#ef6d88" strokeWidth="1.8" />

        {/* Họng */}
        <path d="M 220 194 C 242 208 244 248 236 282 L 216 292 C 210 252 210 222 220 194 Z"
              fill="#ffeef1" stroke="#f79cab" strokeWidth="1.6" />

        {/* Răng trên / dưới */}
        <path d="M 96 186 l 18 0 l -4 24 l -14 0 z" fill="#fff" stroke="#9aa7b8" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M 96 252 l 18 0 l -4 -22 l -14 0 z" fill="#fff" stroke="#9aa7b8" strokeWidth="1.8" strokeLinejoin="round" />

        {/* LƯỠI — phần chuyển động chính */}
        <path d={duongLuoi(h)} fill="#f8788f" stroke="#d82c52" strokeWidth="2.4"
              style={{ transition: 'd 900ms cubic-bezier(.4,0,.2,1)' }} />
        <circle cx={dinh.x} cy={dinh.y} r="6.5" fill="#fff" stroke={mau} strokeWidth="3"
                style={{ transition: 'cx 900ms cubic-bezier(.4,0,.2,1), cy 900ms cubic-bezier(.4,0,.2,1)' }} />

        {/* MÔI trên / dưới */}
        <path d={`M 104 ${yTren - m.day} C ${84 - m.nho / 2} ${yTren - m.day - 2} ${70 - m.nho / 2} ${yTren - 2} ${72 - m.nho / 2} ${yTren + 3} L 104 ${yTren + 3} Z`}
              fill="#f9a3b2" stroke="#d82c52" strokeWidth="2.2" strokeLinejoin="round"
              style={{ transition: 'd 900ms cubic-bezier(.4,0,.2,1)' }} />
        <path d={`M 104 ${yDuoi + m.day} C ${84 - m.nho / 2} ${yDuoi + m.day + 2} ${70 - m.nho / 2} ${yDuoi + 2} ${72 - m.nho / 2} ${yDuoi - 3} L 104 ${yDuoi - 3} Z`}
              fill="#f9a3b2" stroke="#d82c52" strokeWidth="2.2" strokeLinejoin="round"
              style={{ transition: 'd 900ms cubic-bezier(.4,0,.2,1)' }} />

        {/* Điểm cản hơi của phụ âm */}
        {can && (
          <g>
            <circle cx={can.x} cy={can.y} r="12" fill="none" stroke={mau} strokeWidth="3" className="kh-nhay" />
            <circle cx={can.x} cy={can.y} r="4" fill={mau} />
          </g>
        )}

        {/* Luồng hơi: ra mũi (m, n, ŋ) hay ra miệng */}
        <g stroke="#2bb3ef" strokeWidth="3.4" strokeLinecap="round" fill="none" className="kh-hoi">
          {am.mui
            ? <path d="M 186 126 C 140 110 100 114 62 128" markerEnd="url(#ipa-ten)" />
            : <path d="M 120 204 L 48 204" markerEnd="url(#ipa-ten)" />}
        </g>
        <defs>
          <marker id="ipa-ten" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#2bb3ef" />
          </marker>
        </defs>

        {/* Thanh quản: rung hay không rung */}
        <g transform="translate(220 284)">
          <circle r="14" fill={am.thanh === 'huu' ? '#bbf7d0' : '#f1f5f9'}
                  stroke={am.thanh === 'huu' ? '#16a34a' : '#94a3b8'} strokeWidth="2.2"
                  className={am.thanh === 'huu' ? 'kh-rung' : ''} />
          <text textAnchor="middle" y="5" fontSize="13" fill={am.thanh === 'huu' ? '#15803d' : '#64748b'}>
            {am.thanh === 'huu' ? '♪' : '✕'}
          </text>
        </g>
      </svg>

      {/* Nhãn giải thích, đặt ngoài SVG cho dễ đọc trên điện thoại */}
      <div className="mt-2 flex flex-wrap justify-center gap-2 text-[11px] font-bold">
        <span className="rounded-full bg-rose-100 px-2.5 py-1 text-rose-700">🔴 lưỡi</span>
        <span className="rounded-full bg-sky-100 px-2.5 py-1 text-sky-700">
          {am.mui ? '💨 hơi ra mũi' : '💨 hơi ra miệng'}
        </span>
        {can && <span className="rounded-full px-2.5 py-1" style={{ background: `${mau}22`, color: mau }}>⭕ cản ở {can.ten}</span>}
        <span className={`rounded-full px-2.5 py-1 ${am.thanh === 'huu' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
          {am.thanh === 'huu' ? '♪ cổ rung' : am.thanh === 'vo' ? '✕ cổ không rung' : '♪ nguyên âm luôn rung'}
        </span>
        {doi && (
          <span className="rounded-full bg-purple-100 px-2.5 py-1 text-purple-700">
            ▶ đang trượt: mốc {buoc + 1}/2
          </span>
        )}
      </div>
    </div>
  );
}
