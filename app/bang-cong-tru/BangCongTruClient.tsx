'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CAP_BAN_CUA_10, bangCong, bangTru, meoTinh, raCauDo, type CauDo, type Pham, type Phep,
} from '../lib/bangCongTru';
import { speakText, stopSpeaking, unlockAudio } from '../components/edu/utils/speech';
import PhaoAnMung from '../components/edu/PhaoAnMung';

// Hai chế độ:
//   📋 Xem bảng — bảng vuông, bấm vào một ô thì máy đọc phép đó, và MỌI Ô CÙNG
//      KẾT QUẢ sáng lên. Đây là điểm khác bảng in trong vở: bé thấy ngay 3+4,
//      4+3, 5+2 cùng ra 7, tức là thấy được quy luật chứ không học vẹt.
//   🎮 Đố nhanh — 10 câu, có thể ẩn kết quả hoặc ẩn một số hạng.

const KHOA_LUU = 'bhh_bang_cong_tru';
const SO_CAU = 10;

/** Câu đố mở màn cố định — random ở state khởi tạo thì HTML hai bên lệch nhau. */
const CAU_MO_MAN: CauDo = { a: 3, b: 4, kq: 7, phep: 'cong', an: 'kq', dapAn: 7, chon: [5, 7, 8, 12] };

export default function BangCongTruClient() {
  const [pham, setPham] = useState<Pham>(10);
  const [phep, setPhep] = useState<Phep>('cong');
  const [man, setMan] = useState<'bang' | 'do'>('bang');
  const [sang, setSang] = useState<number | null>(null);

  const [anSoHang, setAnSoHang] = useState(false);
  const [cau, setCau] = useState<CauDo>(CAU_MO_MAN);
  const [daBam, setDaBam] = useState<number | null>(null);
  const [soCau, setSoCau] = useState(0);
  const [diem, setDiem] = useState(0);

  const bang = useMemo(() => (phep === 'cong' ? bangCong(pham) : bangTru(pham)), [phep, pham]);

  const raDe = useCallback(() => {
    setCau(raCauDo(pham, phep, anSoHang));
    setDaBam(null);
  }, [pham, phep, anSoHang]);

  // Đặt state thẳng trong effect — bọc rAF/microtask thì có thể chạy trước khi
  // hydrate xong, HTML hai bên lệch nhau.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { raDe(); }, [raDe]);

  useEffect(() => {
    try {
      const p = Number(localStorage.getItem(KHOA_LUU));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (p === 10 || p === 20) setPham(p);
    } catch { /* máy chặn lưu trữ thì thôi */ }
  }, []);

  function doiPham(p: Pham) {
    setPham(p);
    try { localStorage.setItem(KHOA_LUU, String(p)); } catch { /* bỏ qua */ }
  }

  function bamO(o: { a: number; b: number; kq: number }) {
    unlockAudio();
    stopSpeaking();
    setSang(o.kq);
    speakText(`${o.a} ${phep === 'cong' ? 'cộng' : 'trừ'} ${o.b} bằng ${o.kq}`);
  }

  function traLoi(n: number) {
    if (daBam !== null) return;
    setDaBam(n);
    const ok = n === cau.dapAn;
    setSoCau((c) => c + 1);
    if (ok) setDiem((d) => d + 1);
    unlockAudio();
    stopSpeaking();
    speakText(ok ? `Đúng rồi. ${cau.a} ${cau.phep === 'cong' ? 'cộng' : 'trừ'} ${cau.b} bằng ${cau.kq}` : `Chưa đúng. Đáp án là ${cau.dapAn}`);
  }

  return (
    <div className="mt-6">
      {/* Phạm vi + phép tính */}
      <div className="flex flex-wrap items-center gap-2">
        {([10, 20] as Pham[]).map((p) => (
          <button key={p} onClick={() => doiPham(p)}
                  className={`rounded-2xl border-2 px-4 py-2 text-sm font-black transition active:translate-y-0.5 ${
                    pham === p
                      ? 'border-rose-600 bg-gradient-to-b from-rose-400 to-rose-600 text-white shadow-[0_4px_0_#be123c]'
                      : 'border-slate-200 bg-white text-slate-600 shadow-[0_3px_0_#e2e8f0]'}`}>
            Trong {p}
          </button>
        ))}
        {([['cong', '➕ Bảng cộng'], ['tru', '➖ Bảng trừ']] as const).map(([id, ten]) => (
          <button key={id} onClick={() => { stopSpeaking(); setPhep(id); setSang(null); }}
                  className={`rounded-2xl border-2 px-4 py-2 text-sm font-black transition active:translate-y-0.5 ${
                    phep === id
                      ? 'border-slate-900 bg-slate-900 text-white shadow-[0_4px_0_#334155]'
                      : 'border-slate-200 bg-white text-slate-600 shadow-[0_3px_0_#e2e8f0]'}`}>
            {ten}
          </button>
        ))}
        <span key={diem} className="toan-sao-nay ml-auto rounded-full bg-gradient-to-b from-amber-200 to-amber-300 px-3.5 py-1.5 text-sm font-black text-amber-800 shadow-[0_3px_0_#fbbf24]">
          ⭐ {diem}/{soCau}
        </span>
      </div>

      <div className="mt-4 flex gap-2 rounded-full bg-slate-100 p-1">
        {([['bang', '📋 Xem bảng'], ['do', '🎮 Đố nhanh']] as const).map(([id, ten]) => (
          <button key={id} onClick={() => { stopSpeaking(); setMan(id); }}
                  className={`flex-1 rounded-full px-3 py-2 text-xs font-black transition sm:text-sm ${
                    man === id ? 'bg-white text-slate-900 shadow' : 'text-slate-500'}`}>
            {ten}
          </button>
        ))}
      </div>

      {/* 📋 XEM BẢNG */}
      {man === 'bang' && (
        <div className="toan-nen mt-5 rounded-3xl border-2 border-rose-100 bg-gradient-to-br from-rose-50 to-orange-50/60 p-3 sm:p-5">
          <p className="text-sm font-bold text-slate-600">
            Bấm một ô để nghe đọc — <b>mọi ô cùng kết quả sẽ sáng lên</b>, bé thấy ngay các phép cho cùng một đáp số.
            {sang !== null && <span className="ml-1 text-rose-600">Đang sáng: kết quả {sang}.</span>}
          </p>

          <div className="mt-3 overflow-x-auto">
            <table className="border-separate border-spacing-1">
              <thead>
                <tr>
                  <th className="w-9 text-xs text-slate-400">{phep === 'cong' ? '+' : '−'}</th>
                  {bang[0].map((o) => (
                    <th key={o.b} className="w-10 text-xs font-black text-slate-500">{o.b}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bang.map((hang, i) => (
                  <tr key={i}>
                    <th className="text-xs font-black text-slate-500">{hang[0].a}</th>
                    {hang.map((o) => {
                      const hopLe = phep === 'cong' ? o.kq <= pham : o.kq >= 0;
                      if (!hopLe) return <td key={o.b} className="h-10 w-10 rounded-lg bg-slate-100/60" />;
                      const noiBat = sang !== null && o.kq === sang;
                      return (
                        <td key={o.b}>
                          <button onClick={() => bamO(o)}
                                  className={`h-10 w-10 rounded-lg border-2 text-sm font-black transition ${
                                    noiBat
                                      ? 'border-rose-500 bg-rose-500 text-white shadow-[0_3px_0_#be123c]'
                                      : 'border-white bg-white text-slate-700 hover:border-rose-200'}`}>
                            {o.kq}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {phep === 'cong' && (
            <div className="mt-4 rounded-2xl border-2 border-amber-200 bg-amber-50 p-3">
              <p className="text-sm font-black text-amber-800">🤝 Năm cặp bạn của 10 — thuộc năm cặp này là cộng trừ nhanh hẳn</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {CAP_BAN_CUA_10.map(([x, y]) => (
                  <button key={x} onClick={() => bamO({ a: x, b: y, kq: 10 })}
                          className="rounded-full border-2 border-amber-300 bg-white px-3 py-1.5 text-sm font-black text-amber-800 shadow-[0_3px_0_#fcd34d] transition active:translate-y-0.5 active:shadow-none">
                    {x} + {y} = 10
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 🎮 ĐỐ NHANH */}
      {man === 'do' && (
        <div className="toan-nen relative mt-5 rounded-3xl border-2 border-rose-100 bg-gradient-to-br from-rose-50 to-orange-50/60 p-4 sm:p-6">
          {daBam === cau.dapAn && <PhaoAnMung khoa={`${cau.a}-${cau.b}-${soCau}`} />}

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-600">
              <input type="checkbox" checked={anSoHang} onChange={(e) => setAnSoHang(e.target.checked)}
                     className="h-4 w-4 accent-rose-500" />
              Ẩn cả số hạng (khó hơn): 3 + ? = 7
            </label>
            <span className="text-sm font-black text-slate-500">{soCau % SO_CAU || SO_CAU}/{SO_CAU}</span>
          </div>

          <p className="mt-5 text-center text-4xl font-black tracking-wide text-slate-900 sm:text-5xl">
            {cau.a} {cau.phep === 'cong' ? '+' : '−'}{' '}
            {cau.an === 'b' ? <span className="text-rose-500">?</span> : cau.b} ={' '}
            {cau.an === 'kq' ? <span className="text-rose-500">?</span> : cau.kq}
          </p>

          <div className="mx-auto mt-6 grid max-w-md grid-cols-2 gap-2.5 sm:grid-cols-4">
            {cau.chon.map((n) => {
              const laDung = n === cau.dapAn;
              let k = 'border-slate-200 bg-white text-slate-800';
              if (daBam !== null) {
                if (laDung) k = 'border-emerald-400 bg-emerald-50 text-emerald-700';
                else if (daBam === n) k = 'border-rose-300 bg-rose-50 text-rose-600';
                else k = 'border-slate-100 bg-slate-50 text-slate-400';
              }
              return (
                <button key={n} onClick={() => traLoi(n)} disabled={daBam !== null}
                        className={`rounded-2xl border-2 py-5 text-2xl font-black shadow-[0_4px_0_rgba(15,23,42,.08)] transition active:translate-y-1 active:shadow-none disabled:active:translate-y-0 ${k}`}>
                  {n}
                </button>
              );
            })}
          </div>

          {daBam !== null && (
            <div className={`mt-5 rounded-2xl border-2 p-4 ${daBam === cau.dapAn ? 'toan-an-mung border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}>
              <p className="font-black text-slate-900">
                {daBam === cau.dapAn ? '🎉 Đúng rồi!' : '💡 Chưa đúng'} — {cau.a} {cau.phep === 'cong' ? '+' : '−'} {cau.b} = {cau.kq}
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-700">{meoTinh(cau)}</p>
              <button onClick={raDe} className="mt-3 rounded-full bg-slate-900 px-6 py-2.5 text-sm font-black text-white shadow-[0_4px_0_#0f172a55] transition active:translate-y-1 active:shadow-none">
                Câu tiếp →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
