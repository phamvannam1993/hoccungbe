'use client';

import type { PhepChia } from '../lib/datTinhChia';

// Bảng chia cột dọc theo cách viết của Việt Nam:
//
//     3274 | 7
//    -28   |----
//      47  | 467
//     -42  |
//       54
//      -49
//        5
//
// Bé điền hai thứ ở mỗi bước: CHỮ SỐ THƯƠNG và SỐ DƯ. Tích (chữ số thương ×
// số chia) máy điền giúp ngay khi bé chọn đúng thương — vì đó là phép nhân
// bảng cửu chương, không phải cái đang học ở đây.

type O = { thuong: number | null; du: number | null };

type Props = {
  phep: PhepChia;
  dien: O[];
  /** Bước và ô đang chờ điền. */ oDang: { buoc: number; loai: 'thuong' | 'du' };
  onChonO: (buoc: number, loai: 'thuong' | 'du') => void;
  daCham: boolean;
};

export default function BangChiaDoc({ phep, dien, oDang, onChonO, daCham }: Props) {
  const cs = String(phep.a).split('');
  const O_CHU = 'inline-grid h-10 w-8 place-items-center text-2xl font-black sm:h-11 sm:w-9';

  /** Ô nhập: viền xanh khi đang chọn, xanh lá / đỏ sau khi chấm. */
  const oNhap = (gt: number | null, dung: boolean, dangChon: boolean, onBam: () => void, nhan: string) => {
    let kieu = 'border-slate-300 bg-slate-50 text-slate-900';
    if (dangChon && !daCham) kieu = 'border-blue-500 bg-blue-50 text-blue-700 ring-4 ring-blue-100';
    if (daCham) kieu = dung ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : 'border-rose-400 bg-rose-50 text-rose-600';
    return (
      <button onClick={onBam} aria-label={nhan}
              className={`inline-grid h-10 w-8 place-items-center rounded-lg border-2 text-2xl font-black transition sm:h-11 sm:w-9 ${kieu}`}>
        {gt ?? ''}
      </button>
    );
  };

  return (
    <div className="inline-block rounded-2xl bg-white px-4 py-3 shadow-sm">
      <div className="flex items-start gap-3">
        {/* CỘT TRÁI: số bị chia và các lần trừ */}
        <div>
          <div className="flex">
            {cs.map((c, i) => <span key={i} className={`${O_CHU} text-slate-900`}>{c}</span>)}
          </div>

          {phep.buoc.map((b, i) => {
            const d = dien[i] ?? { thuong: null, du: null };
            // Tích chỉ hiện khi bé đã chọn ĐÚNG chữ số thương — hiện sớm thì
            // hoá ra mách luôn đáp án.
            const hienTich = daCham || d.thuong === b.chuSoThuong;
            const le = b.viTri - String(b.phanChia).length + 1;
            return (
              <div key={i}>
                {/* Dòng trừ: tích của bước này */}
                <div className="flex items-center" style={{ marginLeft: Math.max(0, le) * 32 }}>
                  <span className="w-4 text-lg font-black text-slate-500">−</span>
                  {hienTich
                    ? String(b.tich).padStart(String(b.phanChia).length, ' ').split('').map((c, k) => (
                        <span key={k} className={`${O_CHU} text-slate-500`}>{c.trim()}</span>
                      ))
                    : <span className="px-2 text-sm italic text-slate-400">chọn thương trước</span>}
                </div>
                {/* Dòng dư: bé điền */}
                <div className="flex items-center border-t-2 border-slate-300 pt-1"
                     style={{ marginLeft: Math.max(0, le) * 32 }}>
                  <span className="w-4" />
                  {oNhap(d.du, d.du === b.du, oDang.buoc === i && oDang.loai === 'du',
                         () => onChonO(i, 'du'), `Số dư bước ${i + 1}`)}
                  {/* Chữ số được hạ xuống ở bước sau */}
                  {i < phep.buoc.length - 1 && (
                    <span className={`${O_CHU} text-slate-400`} title="chữ số hạ xuống">
                      {cs[phep.buoc[i + 1].viTri]}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* CỘT PHẢI: số chia và thương */}
        <div className="border-l-2 border-slate-800 pl-3">
          <div className="flex">
            {String(phep.b).split('').map((c, i) => <span key={i} className={`${O_CHU} text-slate-900`}>{c}</span>)}
          </div>
          <div className="mt-1 border-t-2 border-slate-800 pt-1">
            <div className="flex">
              {phep.buoc.map((b, i) => {
                const d = dien[i] ?? { thuong: null, du: null };
                return (
                  <span key={i}>
                    {oNhap(d.thuong, d.thuong === b.chuSoThuong, oDang.buoc === i && oDang.loai === 'thuong',
                           () => onChonO(i, 'thuong'), `Chữ số thương thứ ${i + 1}`)}
                  </span>
                );
              })}
            </div>
            <p className="mt-1 text-[11px] font-bold text-slate-400">thương</p>
          </div>
        </div>
      </div>
    </div>
  );
}
