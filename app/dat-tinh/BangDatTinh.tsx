'use client';

import { chuSo, type PhepDat } from '../lib/datTinh';

// Bảng đặt tính cột dọc. Mỗi ô là một chữ số, điền TỪ PHẢI SANG TRÁI đúng như
// làm trên giấy. Hàng trên cùng là ô ghi số nhớ — có ghi hay không tuỳ bé, máy
// không bắt buộc, nhưng ghi thì đỡ quên.

type Props = {
  phep: PhepDat;
  /** Chữ số bé đã điền, chỉ số 0 = hàng đơn vị. */
  dien: (number | null)[];
  nhoDien: (number | null)[];
  oDangChon: number;
  onChonO: (i: number) => void;
  onChonNho: (i: number) => void;
  oNho: number | null;
  /** Đã chấm bài chưa — chấm rồi thì tô xanh/đỏ từng ô. */
  daCham: boolean;
};

export default function BangDatTinh({ phep, dien, nhoDien, oDangChon, onChonO, onChonNho, oNho, daCham }: Props) {
  const cot = phep.soCot;
  const a = chuSo(phep.a);
  const b = chuSo(phep.b);
  // Vẽ từ trái sang phải nên đảo ngược: cột ngoài cùng bên trái là hàng cao nhất.
  const thuTu = Array.from({ length: cot }, (_, i) => cot - 1 - i);

  const O = 'grid h-12 w-12 place-items-center rounded-xl text-2xl font-black sm:h-14 sm:w-14 sm:text-3xl';

  return (
    <div className="inline-block rounded-2xl bg-white px-4 py-3 shadow-sm">
      {/* Hàng ghi số nhớ */}
      <div className="flex items-center gap-1.5">
        <span className="w-9" />
        {thuTu.map((c) => (
          <button
            key={`nho-${c}`}
            onClick={() => onChonNho(c)}
            className={`grid h-7 w-12 place-items-center rounded-lg border-2 border-dashed text-sm font-black sm:w-14 ${
              oNho === c ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-200 text-amber-600'}`}
            aria-label={`Ô ghi số nhớ cột ${c + 1}`}
          >
            {nhoDien[c] ?? ''}
          </button>
        ))}
      </div>

      {/* Số thứ nhất */}
      <div className="mt-1 flex items-center gap-1.5">
        <span className="w-9" />
        {thuTu.map((c) => (
          <span key={`a-${c}`} className={`${O} text-slate-900`}>{a[c] ?? ''}</span>
        ))}
      </div>

      {/* Dấu phép tính đứng BÊN TRÁI số thứ hai, đúng cách viết trong vở. */}
      <div className="flex items-center gap-1.5">
        <span className="grid w-9 place-items-center text-3xl font-black text-slate-600">{phep.dau}</span>
        {thuTu.map((c) => (
          <span key={`b-${c}`} className={`${O} text-slate-900`}>{b[c] ?? ''}</span>
        ))}
      </div>

      {/* Gạch ngang */}
      <div className="my-1.5 ml-9 h-1 rounded-full bg-slate-800" />

      {/* Ô điền kết quả */}
      <div className="flex items-center gap-1.5">
        <span className="w-9" />
        {thuTu.map((c) => {
          const v = dien[c];
          const dung = v !== null && v === phep.chuSoKq[c];
          let kieu = 'border-slate-300 bg-slate-50 text-slate-900';
          if (oDangChon === c && !daCham) kieu = 'border-blue-500 bg-blue-50 text-blue-700 ring-4 ring-blue-100';
          if (daCham) kieu = dung ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : 'border-rose-400 bg-rose-50 text-rose-600';
          return (
            <button key={`kq-${c}`} onClick={() => onChonO(c)}
                    className={`${O} border-2 transition ${kieu}`}
                    aria-label={`Ô kết quả cột ${c + 1}`}>
              {v ?? ''}
            </button>
          );
        })}
      </div>
    </div>
  );
}
