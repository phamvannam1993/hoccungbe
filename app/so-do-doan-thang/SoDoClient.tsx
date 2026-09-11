'use client';

import { useCallback, useEffect, useState } from 'react';
import SoDo from './SoDo';
import {
  BAI_MO_MAN, DANG_THEO_LOP, TEN_DANG, dapAnNhieu, raBaiToan, type BaiToan, type Dang, type MucDo,
} from '../lib/soDoDoanThang';
import { speakText, stopSpeaking, unlockAudio } from '../components/edu/utils/speech';
import PhaoAnMung from '../components/edu/PhaoAnMung';

// Học theo HAI BƯỚC, đúng thứ tự mà trẻ hay bỏ qua:
//   Bước 1 — CHỌN PHÉP TÍNH. Nhìn sơ đồ rồi quyết định cộng, trừ, nhân hay
//            chia. Đây mới là chỗ trẻ tắc; tính toán chỉ là phần sau.
//   Bước 2 — TÍNH RA SỐ.
//
// Làm rời hai bước để biết bé sai ở đâu: chọn nhầm phép tính là chưa hiểu đề,
// còn tính sai thì chỉ là nhầm số.

const KHOA_LUU = 'bhh_so_do';
const PHEP = ['+', '−', '×', ':'] as const;
type Phep = typeof PHEP[number];

const xao = <T,>(ds: T[]) => {
  const a = [...ds];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};

/** Phép tính chính của bài — lấy từ chuỗi phép tính đã sinh sẵn. */
function phepChinh(b: BaiToan): Phep {
  if (b.phepTinh.includes('×')) return '×';
  if (b.phepTinh.includes(':')) return ':';
  if (b.phepTinh.includes('−')) return '−';
  return '+';
}

export default function SoDoClient() {
  const [lop, setLop] = useState<MucDo>(2);
  const [locDang, setLocDang] = useState<Dang | 'all'>('all');
  // Đề mở màn cố định — xem chú thích ở BAI_MO_MAN.
  const [bai, setBai] = useState<BaiToan>(BAI_MO_MAN);
  const [buoc, setBuoc] = useState<1 | 2>(1);
  const [chonPhep, setChonPhep] = useState<Phep | null>(null);
  const [chonSo, setChonSo] = useState<number | null>(null);
  const [dapAnDs, setDapAnDs] = useState<number[]>([]);
  const [xong, setXong] = useState(false);
  const [diem, setDiem] = useState(0);
  const [tong, setTong] = useState(0);

  /** Đọc to đề bài — bé lớp 1, lớp 2 chưa đọc trôi chữ thì nghe là hiểu. */
  const docDe = useCallback((b: BaiToan) => {
    unlockAudio();
    stopSpeaking();
    speakText(`${b.loiVan} ${b.hoi}`);
  }, []);

  const raDe = useCallback(() => {
    const b = raBaiToan(lop, locDang === 'all' ? undefined : locDang);
    setBai(b);
    setDapAnDs(xao([b.dapAn, ...dapAnNhieu(b)]));
    setBuoc(1);
    setChonPhep(null);
    setChonSo(null);
    setXong(false);
    return b;
  }, [lop, locDang]);

  // Đặt state thẳng trong effect: bọc rAF/microtask thì có thể chạy trước khi
  // React hydrate xong, HTML hai bên lệch nhau.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { raDe(); }, [raDe]);

  useEffect(() => {
    try {
      const l = Number(localStorage.getItem(KHOA_LUU));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (l >= 1 && l <= 5) setLop(l as MucDo);
    } catch { /* máy chặn lưu trữ thì thôi */ }
  }, []);

  function doiLop(l: MucDo) {
    setLop(l);
    setLocDang('all');
    try { localStorage.setItem(KHOA_LUU, String(l)); } catch { /* bỏ qua */ }
  }

  function nopPhep(p: Phep) {
    if (chonPhep) return;
    setChonPhep(p);
    const ok = p === phepChinh(bai);
    unlockAudio();
    stopSpeaking();
    speakText(ok ? 'Đúng rồi, giờ tính ra kết quả nhé' : `Chưa đúng. Nhìn sơ đồ, phép tính đúng là ${docPhep(phepChinh(bai))}`);
    setTimeout(() => setBuoc(2), 900);
  }

  function nopSo(n: number) {
    if (xong) return;
    setChonSo(n);
    setXong(true);
    const ok = n === bai.dapAn && chonPhep === phepChinh(bai);
    setTong((t) => t + 1);
    if (ok) setDiem((d) => d + 1);
    stopSpeaking();
    speakText(n === bai.dapAn ? `Đúng rồi. ${bai.phepTinh}` : `Chưa đúng. ${bai.phepTinh}`);
  }

  return (
    <div className="mt-6">
      {/* Lớp + lọc dạng */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-black text-slate-500">Bé học lớp</span>
        {([1, 2, 3, 4, 5] as MucDo[]).map((l) => (
          <button key={l} onClick={() => doiLop(l)}
                  className={`h-11 w-11 rounded-2xl border-2 text-lg font-black transition active:translate-y-0.5 ${
                    lop === l
                      ? 'border-emerald-600 bg-gradient-to-b from-emerald-400 to-emerald-600 text-white shadow-[0_4px_0_#047857]'
                      : 'border-slate-200 bg-white text-slate-600 shadow-[0_3px_0_#e2e8f0]'}`}>
            {l}
          </button>
        ))}
        <span key={diem} className="toan-sao-nay ml-auto rounded-full bg-gradient-to-b from-amber-200 to-amber-300 px-3.5 py-1.5 text-sm font-black text-amber-800 shadow-[0_3px_0_#fbbf24]">⭐ {diem}/{tong}</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button onClick={() => setLocDang('all')}
                className={`rounded-full border-2 px-3 py-1.5 text-xs font-black ${
                  locDang === 'all' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-600'}`}>
          Tất cả dạng
        </button>
        {DANG_THEO_LOP[lop].map((d) => (
          <button key={d} onClick={() => setLocDang(d)}
                  className={`rounded-full border-2 px-3 py-1.5 text-xs font-black ${
                    locDang === d ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
            {TEN_DANG[d]}
          </button>
        ))}
      </div>

      {/* Đề bài */}
      <div className="toan-vao relative mt-5 rounded-3xl border-2 border-emerald-100 bg-white p-4 sm:p-6" key={bai.loiVan}>
        {xong && chonSo === bai.dapAn && <PhaoAnMung khoa={bai.loiVan} />}
        <div className="flex items-start gap-3">
          <button
            onClick={() => docDe(bai)}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-b from-sky-400 to-blue-600 text-xl text-white shadow-[0_4px_0_#1e40af] transition active:translate-y-1 active:shadow-[0_1px_0_#1e40af]"
            aria-label="Nghe đọc đề bài"
          >
            🔊
          </button>
          <p className="text-base leading-7 text-slate-800 sm:text-lg">
            {bai.loiVan} <b className="text-emerald-700">{bai.hoi}</b>
          </p>
        </div>

        <div className="toan-nen mt-4 rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50/50 p-3 sm:p-4">
          <SoDo bai={bai} hienDapAn={xong} />
          <p className="mt-1 text-center text-xs text-slate-500">
            Ô gạch chéo có dấu <b className="text-red-600">?</b> là phần bài toán đang hỏi.
          </p>
        </div>

        {/* BƯỚC 1 — chọn phép tính */}
        <div className="mt-5">
          <p className="flex items-center gap-2 text-sm font-black text-slate-600">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-500 text-white">1</span>
            Nhìn sơ đồ, chọn phép tính
          </p>
          <div className="mt-2 grid grid-cols-4 gap-2.5">
            {PHEP.map((p) => {
              const laDung = p === phepChinh(bai);
              let k = 'border-slate-200 bg-white text-slate-800';
              if (chonPhep) {
                if (laDung) k = 'border-emerald-400 bg-emerald-50 text-emerald-700';
                else if (chonPhep === p) k = 'border-rose-300 bg-rose-50 text-rose-600';
                else k = 'border-slate-100 bg-slate-50 text-slate-400';
              }
              return (
                <button key={p} onClick={() => nopPhep(p)} disabled={!!chonPhep}
                        className={`rounded-2xl border-2 py-5 text-3xl font-black shadow-[0_4px_0_rgba(15,23,42,.08)] transition active:translate-y-1 active:shadow-none disabled:active:translate-y-0 ${k}`}>
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* BƯỚC 2 — chọn kết quả */}
        {buoc === 2 && (
          <div className="mt-5">
            <p className="flex items-center gap-2 text-sm font-black text-slate-600">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-sky-500 text-white">2</span>
              Tính ra kết quả
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {dapAnDs.map((n) => {
                const laDung = n === bai.dapAn;
                let k = 'border-slate-200 bg-white text-slate-800';
                if (xong) {
                  if (laDung) k = 'border-emerald-400 bg-emerald-50 text-emerald-700';
                  else if (chonSo === n) k = 'border-rose-300 bg-rose-50 text-rose-600';
                  else k = 'border-slate-100 bg-slate-50 text-slate-400';
                }
                return (
                  <button key={n} onClick={() => nopSo(n)} disabled={xong}
                          className={`rounded-2xl border-2 py-5 text-2xl font-black shadow-[0_4px_0_rgba(15,23,42,.08)] transition active:translate-y-1 active:shadow-none disabled:active:translate-y-0 ${k}`}>
                    {n} <span className="text-sm font-bold text-slate-400">{bai.donVi}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Chấm bài */}
        {xong && (
          <div className={`mt-5 rounded-2xl border-2 p-4 ${chonSo === bai.dapAn ? 'toan-an-mung border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}>
            <p className="font-black text-slate-900">
              {chonSo === bai.dapAn ? '🎉 Đúng rồi!' : '💡 Chưa đúng'} — {bai.phepTinh} {bai.donVi}
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-700">{bai.giaiThich}</p>
            <p className="mt-2 rounded-xl bg-white/70 px-3 py-2 text-sm text-slate-600">
              <b>Dạng bài:</b> {TEN_DANG[bai.dang]}
            </p>
            <button onClick={() => { const b = raDe(); docDe(b); }}
                    className="mt-3 rounded-full bg-slate-900 px-6 py-2.5 text-sm font-black text-white shadow-[0_4px_0_#0f172a55] transition active:translate-y-1 active:shadow-none">
              Bài tiếp →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const docPhep = (p: Phep) => (p === '+' ? 'phép cộng' : p === '−' ? 'phép trừ' : p === '×' ? 'phép nhân' : 'phép chia');
