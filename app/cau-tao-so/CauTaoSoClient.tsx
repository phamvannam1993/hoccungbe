'use client';

import { useCallback, useEffect, useState } from 'react';
import BangHang from './BangHang';
import {
  HANG, MUC_DO, docSo, giaiBieuThuc, phanTich, raBaiBieuThuc, raBaiHang, raBaiPhanTich, vietSo,
  type BaiBieuThuc, type BaiHang, type BaiPhanTich, type MucDo,
} from '../lib/cauTaoSo';
import { speakText, stopSpeaking, unlockAudio } from '../components/edu/utils/speech';
import PhaoAnMung from '../components/edu/PhaoAnMung';

// Ba dạng:
//   🔢 Hàng và lớp — chữ số này ở hàng nào, đáng bao nhiêu.
//   🧩 Phân tích   — viết số thành tổng các hàng.
//   🔤 Biểu thức   — thay giá trị của chữ rồi tính (lớp 4 trở lên).

type Dang = 'hang' | 'phan-tich' | 'bieu-thuc';
const KHOA_LUU = 'bhh_cau_tao_so';

const HANG_MO_MAN: BaiHang = {
  so: 5302, viTri: 3, chuSo: 5, hoi: 'gia-tri',
  dapAn: '5 000', chon: ['5 000', '5', '50 000', '1 000'],
};
const PT_MO_MAN: BaiPhanTich = {
  so: 5302, dapAn: '5 000 + 300 + 2', chon: ['5 000 + 300 + 2', '5 + 3 + 2', '5 000 + 3 000 + 2', '500 + 300 + 2'],
};
const BT_MO_MAN: BaiBieuThuc = {
  bieuThuc: 'a + b', gia: [{ chu: 'a', gia: 3 }, { chu: 'b', gia: 5 }], dapAn: 8, chon: [8, 15, 2, 9],
};

export default function CauTaoSoClient() {
  const [lop, setLop] = useState<MucDo>(4);
  const [dang, setDang] = useState<Dang>('hang');

  const [hang, setHang] = useState<BaiHang>(HANG_MO_MAN);
  const [pt, setPt] = useState<BaiPhanTich>(PT_MO_MAN);
  const [bt, setBt] = useState<BaiBieuThuc>(BT_MO_MAN);

  const [daBam, setDaBam] = useState<string | null>(null);
  const [ketQua, setKetQua] = useState<'dung' | 'sai' | null>(null);
  const [diem, setDiem] = useState(0);
  const [tong, setTong] = useState(0);

  const raDe = useCallback(() => {
    setKetQua(null);
    setDaBam(null);
    if (dang === 'hang') setHang(raBaiHang(lop));
    else if (dang === 'phan-tich') setPt(raBaiPhanTich(lop));
    else setBt(raBaiBieuThuc(lop));
  }, [lop, dang]);

  // Đặt state thẳng trong effect — bọc rAF/microtask thì có thể chạy trước khi
  // hydrate xong, HTML hai bên lệch nhau.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { raDe(); }, [raDe]);

  useEffect(() => {
    try {
      const l = Number(localStorage.getItem(KHOA_LUU));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (l >= 3 && l <= 5) setLop(l as MucDo);
    } catch { /* máy chặn lưu trữ thì thôi */ }
  }, []);

  function doiLop(l: MucDo) {
    setLop(l);
    // Lớp 3 chưa học biểu thức chứa chữ.
    if (l === 3 && dang === 'bieu-thuc') setDang('hang');
    try { localStorage.setItem(KHOA_LUU, String(l)); } catch { /* bỏ qua */ }
  }

  function cham(ok: boolean, noi: string) {
    setKetQua(ok ? 'dung' : 'sai');
    setTong((t) => t + 1);
    if (ok) setDiem((d) => d + 1);
    unlockAudio();
    stopSpeaking();
    speakText(ok ? `Đúng rồi. ${noi}` : `Chưa đúng. ${noi}`);
  }

  const nut = (dung: boolean, bam: boolean) => {
    if (!ketQua) return 'border-slate-200 bg-white text-slate-800';
    if (dung) return 'border-emerald-400 bg-emerald-50 text-emerald-700';
    if (bam) return 'border-rose-300 bg-rose-50 text-rose-600';
    return 'border-slate-100 bg-slate-50 text-slate-400';
  };

  const dangCo: { id: Dang; ten: string }[] = [
    { id: 'hang', ten: '🔢 Hàng và lớp' },
    { id: 'phan-tich', ten: '🧩 Phân tích số' },
    ...(lop >= 4 ? [{ id: 'bieu-thuc' as Dang, ten: '🔤 Biểu thức chữ' }] : []),
  ];

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-black text-slate-500">Bé học lớp</span>
        {MUC_DO.map((m) => (
          <button key={m.lop} onClick={() => doiLop(m.lop)} title={m.moTa}
                  className={`h-11 w-11 rounded-2xl border-2 text-lg font-black transition active:translate-y-0.5 ${
                    lop === m.lop
                      ? 'border-indigo-700 bg-gradient-to-b from-indigo-400 to-indigo-600 text-white shadow-[0_4px_0_#4338ca]'
                      : 'border-slate-200 bg-white text-slate-600 shadow-[0_3px_0_#e2e8f0]'}`}>
            {m.lop}
          </button>
        ))}
        <span key={diem} className="toan-sao-nay ml-auto rounded-full bg-gradient-to-b from-amber-200 to-amber-300 px-3.5 py-1.5 text-sm font-black text-amber-800 shadow-[0_3px_0_#fbbf24]">
          ⭐ {diem}/{tong}
        </span>
      </div>
      <p className="mt-1.5 text-xs text-slate-500">{MUC_DO.find((m) => m.lop === lop)!.moTa}</p>

      <div className="mt-4 flex gap-2 rounded-full bg-slate-100 p-1">
        {dangCo.map((d) => (
          <button key={d.id} onClick={() => { stopSpeaking(); setDang(d.id); }}
                  className={`flex-1 rounded-full px-2 py-2 text-xs font-black transition sm:text-sm ${
                    dang === d.id ? 'bg-white text-slate-900 shadow' : 'text-slate-500'}`}>
            {d.ten}
          </button>
        ))}
      </div>

      <div className="toan-nen relative mt-5 rounded-3xl border-2 border-indigo-100 bg-gradient-to-br from-indigo-50 to-sky-50/60 p-4 sm:p-6">
        {ketQua === 'dung' && <PhaoAnMung khoa={`${dang}-${tong}`} />}

        {/* 🔢 HÀNG VÀ LỚP */}
        {dang === 'hang' && (
          <div className="flex flex-col items-center">
            <p className="flex items-center gap-3 text-center text-lg font-black text-slate-900">
              <button onClick={() => { unlockAudio(); stopSpeaking(); speakText(`Số ${docSo(hang.so)}. Chữ số ${hang.chuSo} ${hang.hoi === 'ten-hang' ? 'ở hàng nào' : 'có giá trị bao nhiêu'}?`); }}
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-b from-sky-400 to-blue-600 text-lg text-white shadow-[0_4px_0_#1e40af] transition active:translate-y-1 active:shadow-none"
                      aria-label="Nghe đọc câu hỏi">🔊</button>
              Chữ số <span className="text-rose-600">{hang.chuSo}</span> (ô đỏ){' '}
              {hang.hoi === 'ten-hang' ? 'ở hàng nào?' : 'có giá trị bao nhiêu?'}
            </p>
            <p className="mt-1 text-sm text-slate-500">Số này đọc là: {docSo(hang.so)}</p>

            <div className="mt-4 max-w-full overflow-x-auto">
              <BangHang so={hang.so} nhanManh={hang.viTri} hienGiaTri={!!ketQua} />
            </div>

            <div className="mt-5 grid w-full max-w-md grid-cols-2 gap-2.5">
              {hang.chon.map((c) => (
                <button key={c} disabled={!!ketQua}
                        onClick={() => { setDaBam(c); cham(c === hang.dapAn, `Đáp án là ${hang.dapAn}`); }}
                        className={`rounded-2xl border-2 py-4 text-base font-black shadow-[0_4px_0_rgba(15,23,42,.08)] transition active:translate-y-1 active:shadow-none disabled:active:translate-y-0 ${nut(c === hang.dapAn, daBam === c)}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 🧩 PHÂN TÍCH SỐ */}
        {dang === 'phan-tich' && (
          <div className="flex flex-col items-center">
            <p className="flex items-center gap-3 text-center text-lg font-black text-slate-900">
              <button onClick={() => { unlockAudio(); stopSpeaking(); speakText(`Viết số ${docSo(pt.so)} thành tổng các hàng`); }}
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-b from-sky-400 to-blue-600 text-lg text-white shadow-[0_4px_0_#1e40af] transition active:translate-y-1 active:shadow-none"
                      aria-label="Nghe đọc câu hỏi">🔊</button>
              Viết thành tổng các hàng
            </p>
            <p className="mt-2 text-4xl font-black text-slate-900">{vietSo(pt.so)}</p>
            <p className="mt-1 text-sm text-slate-500">{docSo(pt.so)}</p>

            <div className="mt-3 max-w-full overflow-x-auto">
              <BangHang so={pt.so} hienGiaTri={!!ketQua} />
            </div>

            <div className="mt-5 grid w-full max-w-xl gap-2.5">
              {pt.chon.map((c) => (
                <button key={c} disabled={!!ketQua}
                        onClick={() => { setDaBam(c); cham(c === pt.dapAn, `${vietSo(pt.so)} bằng ${pt.dapAn}`); }}
                        className={`rounded-2xl border-2 px-3 py-3.5 text-base font-black shadow-[0_4px_0_rgba(15,23,42,.08)] transition active:translate-y-1 active:shadow-none disabled:active:translate-y-0 ${nut(c === pt.dapAn, daBam === c)}`}>
                  {vietSo(pt.so)} = {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 🔤 BIỂU THỨC CHỨA CHỮ */}
        {dang === 'bieu-thuc' && (
          <div className="flex flex-col items-center">
            <p className="flex items-center gap-3 text-center text-lg font-black text-slate-900">
              <button onClick={() => { unlockAudio(); stopSpeaking(); speakText(`Tính giá trị biểu thức ${bt.bieuThuc.replace('×', 'nhân').replace('−', 'trừ')} với ${bt.gia.map((g) => `${g.chu} bằng ${g.gia}`).join(', ')}`); }}
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-b from-sky-400 to-blue-600 text-lg text-white shadow-[0_4px_0_#1e40af] transition active:translate-y-1 active:shadow-none"
                      aria-label="Nghe đọc câu hỏi">🔊</button>
              Tính giá trị biểu thức
            </p>
            <p className="mt-2 text-4xl font-black tracking-wide text-slate-900">{bt.bieuThuc}</p>

            {/* Thẻ giá trị của từng chữ — bé nhìn thấy "a là 3" chứ không phải nhớ */}
            <div className="mt-3 flex gap-2">
              {bt.gia.map((g) => (
                <span key={g.chu} className="rounded-2xl border-2 border-indigo-200 bg-white px-4 py-2 text-lg font-black text-indigo-700">
                  {g.chu} = {g.gia}
                </span>
              ))}
            </div>
            {/* Sau khi chấm mới hiện bước thay số, tránh mách bài */}
            {ketQua && (
              <p className="mt-3 rounded-xl bg-white px-4 py-2 text-base font-bold text-slate-700">
                {bt.gia.reduce((s, g) => s.replaceAll(g.chu, String(g.gia)), bt.bieuThuc)} = {bt.dapAn}
              </p>
            )}

            <div className="mt-4 grid w-full max-w-md grid-cols-2 gap-2.5 sm:grid-cols-4">
              {bt.chon.map((n) => (
                <button key={n} disabled={!!ketQua}
                        onClick={() => { setDaBam(String(n)); cham(n === bt.dapAn, `Giá trị biểu thức là ${bt.dapAn}`); }}
                        className={`rounded-2xl border-2 py-5 text-2xl font-black shadow-[0_4px_0_rgba(15,23,42,.08)] transition active:translate-y-1 active:shadow-none disabled:active:translate-y-0 ${nut(n === bt.dapAn, daBam === String(n))}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        )}

        {ketQua && (
          <div className={`mt-5 rounded-2xl border-2 p-4 ${ketQua === 'dung' ? 'toan-an-mung border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}>
            <p className="font-black text-slate-900">{ketQua === 'dung' ? '🎉 Đúng rồi!' : '💡 Chưa đúng'}</p>
            <p className="mt-1 text-sm leading-6 text-slate-700">
              {dang === 'hang' && (
                hang.hoi === 'ten-hang'
                  ? `Đếm từ phải sang trái: đơn vị, chục, trăm, nghìn… Chữ số ${hang.chuSo} đứng ở hàng ${HANG[hang.viTri].ten}, thuộc ${HANG[hang.viTri].lop.toLowerCase()}.`
                  : `Chữ số ${hang.chuSo} ở hàng ${HANG[hang.viTri].ten} nên đáng ${hang.chuSo} × ${vietSo(HANG[hang.viTri].gia)} = ${hang.dapAn}. Cùng một chữ số nhưng đứng ở hàng khác thì giá trị khác hẳn.`
              )}
              {dang === 'phan-tich' && `${vietSo(pt.so)} = ${phanTich(pt.so)}. Mỗi số hạng là giá trị của một chữ số; hàng nào có chữ số 0 thì bỏ qua vì đáng 0.`}
              {dang === 'bieu-thuc' && giaiBieuThuc(bt)}
            </p>
            <button onClick={raDe} className="mt-3 rounded-full bg-slate-900 px-6 py-2.5 text-sm font-black text-white shadow-[0_4px_0_#0f172a55] transition active:translate-y-1 active:shadow-none">
              Bài tiếp →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
