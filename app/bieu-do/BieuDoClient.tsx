'use client';

import { useCallback, useEffect, useState } from 'react';
import BieuDoCot, { BieuDoTranh } from './VeBieuDo';
import {
  MUC_DO, giaiThich, raBaiDoc, raBaiVe, type BaiDoc, type BaiVe, type MucDo,
} from '../lib/bieuDo';
import { speakText, stopSpeaking, unlockAudio } from '../components/edu/utils/speech';
import PhaoAnMung from '../components/edu/PhaoAnMung';

// Hai chiều của cùng một kỹ năng:
//   👀 Đọc biểu đồ — nhìn tranh/cột rồi trả lời.
//   ✏️ Vẽ biểu đồ  — cho bảng số liệu, bé kéo chiều cao từng cột.
// Biết đọc chưa chắc đã vẽ được, nên phải có cả hai.

type Dang = 'doc' | 've';
const KHOA_LUU = 'bhh_bieu_do';

const DOC_MO_MAN: BaiDoc = {
  bo: {
    tieuDe: 'Số con vật trong trang trại', donVi: 'con', heSo: 1,
    cot: [
      { nhan: 'Gà', emoji: '🐔', gia: 5 }, { nhan: 'Vịt', emoji: '🦆', gia: 3 },
      { nhan: 'Lợn', emoji: '🐷', gia: 2 }, { nhan: 'Bò', emoji: '🐄', gia: 6 },
    ],
  },
  tranh: true, kieu: 'nhieu-nhat', cauHoi: 'Loại nào NHIỀU NHẤT?',
  dapAn: 'Bò', chon: ['Gà', 'Vịt', 'Lợn', 'Bò'],
};

export default function BieuDoClient() {
  const [lop, setLop] = useState<MucDo>(3);
  const [dang, setDang] = useState<Dang>('doc');

  const [doc, setDoc] = useState<BaiDoc>(DOC_MO_MAN);
  const [ve, setVe] = useState<BaiVe | null>(null);
  const [cotVe, setCotVe] = useState<number[]>([]);

  const [daBam, setDaBam] = useState<string | null>(null);
  const [ketQua, setKetQua] = useState<'dung' | 'sai' | null>(null);
  const [diem, setDiem] = useState(0);
  const [tong, setTong] = useState(0);

  const raDe = useCallback(() => {
    setKetQua(null);
    setDaBam(null);
    if (dang === 'doc') setDoc(raBaiDoc(lop));
    else {
      const b = raBaiVe(lop);
      setVe(b);
      setCotVe(b.bo.cot.map(() => 0));
    }
  }, [lop, dang]);

  // Đặt state thẳng trong effect — bọc rAF/microtask thì có thể chạy trước khi
  // hydrate xong, HTML hai bên lệch nhau.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { raDe(); }, [raDe]);

  useEffect(() => {
    try {
      const l = Number(localStorage.getItem(KHOA_LUU));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (l >= 2 && l <= 5) setLop(l as MucDo);
    } catch { /* máy chặn lưu trữ thì thôi */ }
  }, []);

  function doiLop(l: MucDo) {
    setLop(l);
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

  const saiCot = ve && ketQua ? ve.bo.cot.map((c, i) => cotVe[i] !== c.gia) : undefined;

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
        {([['doc', '👀 Đọc biểu đồ'], ['ve', '✏️ Vẽ biểu đồ']] as const).map(([id, ten]) => (
          <button key={id} onClick={() => { stopSpeaking(); setDang(id); }}
                  className={`flex-1 rounded-full px-3 py-2 text-xs font-black transition sm:text-sm ${
                    dang === id ? 'bg-white text-slate-900 shadow' : 'text-slate-500'}`}>
            {ten}
          </button>
        ))}
      </div>

      <div className="toan-nen relative mt-5 rounded-3xl border-2 border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50/60 p-4 sm:p-6">
        {ketQua === 'dung' && <PhaoAnMung khoa={`${dang}-${tong}`} />}

        {/* 👀 ĐỌC BIỂU ĐỒ */}
        {dang === 'doc' && (
          <div className="flex flex-col items-center">
            <p className="text-center text-sm font-black uppercase tracking-wide text-indigo-500">{doc.bo.tieuDe}</p>
            <div className="mt-3 w-full max-w-[420px] rounded-2xl bg-white p-3">
              {doc.tranh ? <BieuDoTranh bo={doc.bo} /> : <BieuDoCot bo={doc.bo} toiDa={Math.max(...doc.bo.cot.map((c) => c.gia)) + 2} />}
            </div>

            <p className="mt-4 flex items-center gap-3 text-center text-lg font-black text-slate-900">
              <button onClick={() => { unlockAudio(); stopSpeaking(); speakText(doc.cauHoi); }}
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-b from-sky-400 to-blue-600 text-lg text-white shadow-[0_4px_0_#1e40af] transition active:translate-y-1 active:shadow-none"
                      aria-label="Nghe đọc câu hỏi">🔊</button>
              {doc.cauHoi}
            </p>

            <div className="mt-4 grid w-full max-w-md grid-cols-2 gap-2.5 sm:grid-cols-4">
              {doc.chon.map((c) => {
                const dung = c === doc.dapAn;
                let k = 'border-slate-200 bg-white text-slate-800';
                if (ketQua) {
                  if (dung) k = 'border-emerald-400 bg-emerald-50 text-emerald-700';
                  else if (daBam === c) k = 'border-rose-300 bg-rose-50 text-rose-600';
                  else k = 'border-slate-100 bg-slate-50 text-slate-400';
                }
                return (
                  <button key={c} disabled={!!ketQua}
                          onClick={() => { setDaBam(c); cham(dung, `Đáp án là ${doc.dapAn}`); }}
                          className={`rounded-2xl border-2 py-4 text-base font-black shadow-[0_4px_0_rgba(15,23,42,.08)] transition active:translate-y-1 active:shadow-none disabled:active:translate-y-0 ${k}`}>
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ✏️ VẼ BIỂU ĐỒ */}
        {dang === 've' && ve && (
          <div className="flex flex-col items-center">
            <p className="flex items-center gap-3 text-center text-lg font-black text-slate-900">
              <button onClick={() => { unlockAudio(); stopSpeaking(); speakText('Kéo từng cột cho đúng bảng số liệu'); }}
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-b from-sky-400 to-blue-600 text-lg text-white shadow-[0_4px_0_#1e40af] transition active:translate-y-1 active:shadow-none"
                      aria-label="Nghe đọc câu hỏi">🔊</button>
              Kéo cột cho khớp bảng số liệu
            </p>

            {/* Bảng số liệu */}
            <table className="mt-3 overflow-hidden rounded-xl bg-white text-sm">
              <tbody>
                {ve.bo.cot.map((c) => (
                  <tr key={c.nhan} className="border-b border-slate-100 last:border-0">
                    <td className="px-3 py-1.5">{c.emoji} <b>{c.nhan}</b></td>
                    <td className="px-4 py-1.5 text-right font-black text-indigo-700">{c.gia} {ve.bo.donVi}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-3 rounded-2xl bg-white p-3">
              <BieuDoCot bo={ve.bo} toiDa={ve.toiDa} giaTri={cotVe} keoDuoc={!ketQua} sai={saiCot}
                         onDoi={(i, v) => setCotVe((ds) => ds.map((x, j) => (j === i ? v : x)))} />
            </div>
            <p className="mt-1 text-xs text-slate-500">Kéo chấm tròn trên đầu mỗi cột lên xuống.</p>

            <button onClick={() => cham(ve.bo.cot.every((c, i) => cotVe[i] === c.gia), 'Chiều cao mỗi cột phải đúng bằng số trong bảng')}
                    disabled={!!ketQua}
                    className="mt-3 rounded-2xl bg-gradient-to-b from-indigo-400 to-indigo-600 px-8 py-3.5 text-base font-black text-white shadow-[0_5px_0_#4338ca] transition active:translate-y-1 active:shadow-[0_1px_0_#4338ca] disabled:opacity-50">
              Kiểm tra
            </button>
          </div>
        )}

        {ketQua && (
          <div className={`mt-5 rounded-2xl border-2 p-4 ${ketQua === 'dung' ? 'toan-an-mung border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}>
            <p className="font-black text-slate-900">{ketQua === 'dung' ? '🎉 Đúng rồi!' : '💡 Chưa đúng'}</p>
            <p className="mt-1 text-sm leading-6 text-slate-700">
              {dang === 'doc'
                ? giaiThich(doc)
                : 'Cột nào đỏ là chưa đúng chiều cao. Đọc số trong bảng rồi kéo cột lên đúng vạch đó — mỗi vạch trên trục dọc là một đơn vị.'}
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
