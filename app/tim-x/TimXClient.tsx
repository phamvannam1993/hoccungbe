'use client';

import { useCallback, useEffect, useState } from 'react';
import CanTimX from './CanTimX';
import {
  MUC_DO, QUY_TAC, TEN_THANH_PHAN, giaiThich, raBaiTimX, veDuocCan,
  type BaiTimX, type MucDo,
} from '../lib/timX';
import { speakText, stopSpeaking, unlockAudio } from '../components/edu/utils/speech';
import PhaoAnMung from '../components/edu/PhaoAnMung';

const KHOA_LUU = 'bhh_tim_x';

/** Đề mở màn cố định — random ở state khởi tạo thì HTML hai bên lệch nhau. */
const MO_MAN: BaiTimX = {
  dang: 'cong', a: 7, b: 12, x: 5, de: 'x + 7 = 12', cach: '12 − 7', chon: [5, 19, 4, 7],
};

export default function TimXClient() {
  const [lop, setLop] = useState<MucDo>(3);
  const [bai, setBai] = useState<BaiTimX>(MO_MAN);
  const [daBam, setDaBam] = useState<number | null>(null);
  const [hienGoiY, setHienGoiY] = useState(false);
  const [diem, setDiem] = useState(0);
  const [tong, setTong] = useState(0);

  const raDe = useCallback(() => {
    setBai(raBaiTimX(lop));
    setDaBam(null);
    setHienGoiY(false);
  }, [lop]);

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

  function traLoi(n: number) {
    if (daBam !== null) return;
    setDaBam(n);
    const ok = n === bai.x;
    setTong((t) => t + 1);
    if (ok) setDiem((d) => d + 1);
    unlockAudio();
    stopSpeaking();
    speakText(ok ? `Đúng rồi. x bằng ${bai.x}` : `Chưa đúng. x bằng ${bai.x}`);
  }

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-black text-slate-500">Bé học lớp</span>
        {MUC_DO.map((m) => (
          <button key={m.lop} onClick={() => doiLop(m.lop)} title={m.moTa}
                  className={`h-11 w-11 rounded-2xl border-2 text-lg font-black transition active:translate-y-0.5 ${
                    lop === m.lop
                      ? 'border-violet-700 bg-gradient-to-b from-violet-400 to-violet-600 text-white shadow-[0_4px_0_#6d28d9]'
                      : 'border-slate-200 bg-white text-slate-600 shadow-[0_3px_0_#e2e8f0]'}`}>
            {m.lop}
          </button>
        ))}
        <span key={diem} className="toan-sao-nay ml-auto rounded-full bg-gradient-to-b from-amber-200 to-amber-300 px-3.5 py-1.5 text-sm font-black text-amber-800 shadow-[0_3px_0_#fbbf24]">
          ⭐ {diem}/{tong}
        </span>
      </div>
      <p className="mt-1.5 text-xs text-slate-500">{MUC_DO.find((m) => m.lop === lop)!.moTa}</p>

      <div className="toan-nen relative mt-5 rounded-3xl border-2 border-violet-100 bg-gradient-to-br from-violet-50 to-fuchsia-50/60 p-4 sm:p-6">
        {daBam === bai.x && <PhaoAnMung khoa={`${bai.de}-${tong}`} />}

        <div className="flex flex-col items-center">
          <p className="flex items-center gap-3 text-center text-lg font-black text-slate-900">
            <button onClick={() => { unlockAudio(); stopSpeaking(); speakText(`Tìm x, biết ${bai.de.replace('×', 'nhân').replace(':', 'chia').replace('−', 'trừ')}`); }}
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-b from-sky-400 to-blue-600 text-lg text-white shadow-[0_4px_0_#1e40af] transition active:translate-y-1 active:shadow-none"
                    aria-label="Nghe đọc đề bài">🔊</button>
            Tìm <span className="text-violet-700">x</span>, biết:
          </p>
          <p className="mt-2 text-4xl font-black tracking-wide text-slate-900 sm:text-5xl">{bai.de}</p>

          {veDuocCan(bai.dang) && (
            <div className="mt-4 rounded-2xl bg-white/70 p-2">
              <CanTimX bai={bai} xThu={daBam} />
            </div>
          )}

          {/* Gợi ý: nhắc tên thành phần và quy tắc, chưa nói đáp án */}
          {!daBam && (
            <button onClick={() => setHienGoiY((v) => !v)}
                    className="mt-3 rounded-full border-2 border-violet-200 bg-white px-4 py-1.5 text-sm font-black text-violet-700">
              {hienGoiY ? 'Ẩn gợi ý' : '💡 Gợi ý'}
            </button>
          )}
          {hienGoiY && daBam === null && (
            <p className="mt-2 max-w-md rounded-2xl bg-white px-4 py-3 text-center text-sm leading-6 text-slate-700">
              Ở đây <b>x</b> là <b>{TEN_THANH_PHAN[bai.dang]}</b>. {QUY_TAC[bai.dang]}
            </p>
          )}

          <div className="mt-4 grid w-full max-w-md grid-cols-2 gap-2.5 sm:grid-cols-4">
            {bai.chon.map((n) => {
              const dung = n === bai.x;
              let k = 'border-slate-200 bg-white text-slate-800';
              if (daBam !== null) {
                if (dung) k = 'border-emerald-400 bg-emerald-50 text-emerald-700';
                else if (daBam === n) k = 'border-rose-300 bg-rose-50 text-rose-600';
                else k = 'border-slate-100 bg-slate-50 text-slate-400';
              }
              return (
                <button key={n} disabled={daBam !== null} onClick={() => traLoi(n)}
                        className={`rounded-2xl border-2 py-5 text-2xl font-black shadow-[0_4px_0_rgba(15,23,42,.08)] transition active:translate-y-1 active:shadow-none disabled:active:translate-y-0 ${k}`}>
                  {n}
                </button>
              );
            })}
          </div>
        </div>

        {daBam !== null && (
          <div className={`mt-5 rounded-2xl border-2 p-4 ${daBam === bai.x ? 'toan-an-mung border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}>
            <p className="font-black text-slate-900">{daBam === bai.x ? '🎉 Đúng rồi!' : '💡 Chưa đúng'}</p>
            <p className="mt-1 text-sm leading-6 text-slate-700">{giaiThich(bai)}</p>
            <button onClick={raDe} className="mt-3 rounded-full bg-slate-900 px-6 py-2.5 text-sm font-black text-white shadow-[0_4px_0_#0f172a55] transition active:translate-y-1 active:shadow-none">
              Bài tiếp →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
