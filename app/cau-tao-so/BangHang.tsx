'use client';

import { HANG, vietSo } from '../lib/cauTaoSo';

// Bảng hàng và lớp — mỗi chữ số nằm trong một ô, phía trên ghi tên hàng, phía
// trên nữa gộp thành LỚP (lớp đơn vị / lớp nghìn / lớp triệu).
//
// Đây là thứ chữ nghĩa không dạy được: chữ số 5 trong 50 302 nằm ở ô "chục
// nghìn" nên đáng 50 000, còn chữ số 2 nằm ô "đơn vị" chỉ đáng 2. Nhìn cùng
// một chữ số ở hai ô khác nhau là hiểu.

export default function BangHang({
  so, nhanManh, hienGiaTri = false,
}: { so: number; nhanManh?: number; hienGiaTri?: boolean }) {
  const cs = String(so).split('').reverse();      // đơn vị đứng trước
  const o = cs.map((c, i) => ({ chuSo: Number(c), hang: HANG[i], viTri: i })).reverse();

  // Gom các ô cùng lớp để vẽ dải tiêu đề bên trên.
  const lop: { ten: string; so: number }[] = [];
  for (const x of o) {
    const cuoi = lop[lop.length - 1];
    if (cuoi && cuoi.ten === x.hang.lop) cuoi.so += 1;
    else lop.push({ ten: x.hang.lop, so: 1 });
  }

  return (
    <div className="inline-block overflow-x-auto">
      {/* Dải lớp */}
      <div className="flex gap-1">
        {lop.map((l, i) => (
          <div key={i} className="rounded-t-lg bg-indigo-100 px-2 py-1 text-center text-[11px] font-black text-indigo-700"
               style={{ width: l.so * 56 + (l.so - 1) * 4 }}>
            {l.ten}
          </div>
        ))}
      </div>

      {/* Tên hàng */}
      <div className="mt-1 flex gap-1">
        {o.map((x) => (
          <div key={x.viTri} className="w-14 text-center text-[10px] font-bold leading-tight text-slate-500">
            {x.hang.ten}
          </div>
        ))}
      </div>

      {/* Chữ số */}
      <div className="mt-1 flex gap-1">
        {o.map((x) => {
          const noi = nhanManh === x.viTri;
          return (
            <div key={x.viTri}
                 className={`grid h-16 w-14 place-items-center rounded-xl border-2 text-3xl font-black transition ${
                   noi ? 'border-rose-500 bg-rose-50 text-rose-600 ring-4 ring-rose-100'
                       : 'border-slate-200 bg-white text-slate-800'}`}>
              {x.chuSo}
            </div>
          );
        })}
      </div>

      {/* Giá trị từng chữ số — chỉ hiện sau khi chấm bài */}
      {hienGiaTri && (
        <div className="mt-1 flex gap-1">
          {o.map((x) => (
            <div key={x.viTri} className="w-14 text-center text-[10px] font-bold text-slate-400">
              {x.chuSo > 0 ? vietSo(x.chuSo * x.hang.gia) : '—'}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
