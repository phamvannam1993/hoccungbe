'use client';

import type { BaiToan, Hang } from '../lib/soDoDoanThang';

// Vẽ sơ đồ đoạn thẳng từ cấu trúc bài toán.
//
// Quy ước để bé đọc được ngay:
//   • mỗi hàng là một bạn / một đại lượng, có tên ở đầu hàng;
//   • đoạn đã biết tô đặc, đoạn CHƯA BIẾT để gạch chéo mờ và ghi "?";
//   • dấu ngoặc ôm dưới là "tất cả" — chỗ mà nhìn vào là biết bài hỏi tổng.

const W = 620;
const CAO_HANG = 52;
const LE_TRAI = 74;

export default function SoDo({ bai, hienDapAn = false }: { bai: BaiToan; hienDapAn?: boolean }) {
  const { hang, ngoacTong } = bai;
  const tongDai = Math.max(...hang.map((h) => h.doan.reduce((s, d) => s + d.gia, 0)));
  // Chừa chỗ bên phải cho nhãn tổng của hàng ("83", "?").
  const rongToiDa = W - LE_TRAI - 72;
  const donVi = rongToiDa / tongDai;
  const coNgoac = !!ngoacTong;
  const H = hang.length * CAO_HANG + (coNgoac ? 46 : 16);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img"
         aria-label={`Sơ đồ đoạn thẳng: ${hang.map((h) => `${h.ten} gồm ${h.doan.length} đoạn`).join('; ')}`}>
      {hang.map((h, i) => (
        <HangSoDo key={i} hang={h} y={10 + i * CAO_HANG} donVi={donVi} hienDapAn={hienDapAn} />
      ))}

      {coNgoac && (() => {
        const y = 10 + hang.length * CAO_HANG - 6;
        // Ngoặc ôm hết chiều dài của hàng DÀI NHẤT: đó chính là "tất cả".
        const x2 = LE_TRAI + tongDai * donVi;
        return (
          <g>
            <path d={`M ${LE_TRAI} ${y} L ${LE_TRAI} ${y + 10} L ${x2} ${y + 10} L ${x2} ${y}`}
                  fill="none" stroke="#334155" strokeWidth="2.5" />
            <text x={(LE_TRAI + x2) / 2} y={y + 30} textAnchor="middle" fontSize="17" fontWeight="800"
                  fill={ngoacTong!.an ? '#dc2626' : '#334155'}>
              {ngoacTong!.nhan}
            </text>
          </g>
        );
      })()}
    </svg>
  );
}

function HangSoDo({ hang, y, donVi, hienDapAn }: { hang: Hang; y: number; donVi: number; hienDapAn: boolean }) {
  // Tính sẵn vị trí từng đoạn rồi mới vẽ.
  const rongDs = hang.doan.map((d) => Math.max(d.nhan.length > 4 ? 84 : 34, Math.round(d.gia * donVi)));
  const oDoan = hang.doan.map((d, i) => ({
    d,
    rong: rongDs[i],
    // Vị trí = lề trái cộng bề rộng của các đoạn đứng trước. Tính kiểu cộng
    // dồn vào một biến thì vi phạm luật "không sửa biến sau khi render xong".
    x: LE_TRAI + rongDs.slice(0, i).reduce((s, r) => s + r, 0),
  }));

  return (
    <g>
      <text x={LE_TRAI - 10} y={y + 24} textAnchor="end" fontSize="15" fontWeight="800" fill="#334155">{hang.ten}</text>
      {oDoan.map(({ d, x, rong }, i) => {
        const an = d.an && !hienDapAn;
        return (
          <g key={i}>
            <rect x={x} y={y} width={rong} height={34} rx="6"
                  fill={an ? '#fff' : hang.mau} fillOpacity={an ? 1 : 0.85}
                  stroke={an ? '#dc2626' : hang.mau} strokeWidth="2.5"
                  strokeDasharray={an ? '6 4' : undefined}
                  className={an ? 'toan-an-so' : undefined} />
            <text x={x + rong / 2} y={y + 23} textAnchor="middle"
                  fontSize={d.nhan.length > 6 ? 13 : 15} fontWeight="800"
                  fill={an ? '#dc2626' : '#fff'}>
              {an ? '?' : d.nhan}
            </text>
          </g>
        );
      })}
      {hang.tongNhan && (() => {
        const cuoi = oDoan[oDoan.length - 1];
        const x = cuoi.x + cuoi.rong + 10;
        return (
          <g>
            <path d={`M ${x} ${y + 2} l 6 0 l 0 30 l -6 0`} fill="none" stroke="#64748b" strokeWidth="2" />
            <text x={x + 12} y={y + 23} fontSize="15" fontWeight="800"
                  fill={hang.tongNhan === '?' ? '#dc2626' : '#334155'}>
              {hang.tongNhan}
            </text>
          </g>
        );
      })()}
    </g>
  );
}
