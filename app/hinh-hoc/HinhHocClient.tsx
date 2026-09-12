'use client';

import { useCallback, useEffect, useState } from 'react';
import VeHinh, { VeKhoi } from './VeHinh';
import {
  HINH_PHANG, MUC_DO, raBaiDoiXung, raBaiHinh, raBaiKhoi,
  type BaiDoiXung, type BaiHinh, type BaiKhoi, type MucDo,
} from '../lib/hinhHoc';
import { speakText, stopSpeaking, unlockAudio } from '../components/edu/utils/speech';
import PhaoAnMung from '../components/edu/PhaoAnMung';

// Ba dạng:
//   🔷 Nhận hình  — nhìn hình, chọn tên. Hình vẽ hơi xoay để bé nhận bằng số
//      cạnh chứ không bằng tư thế quen mắt.
//   🪞 Đối xứng   — nửa trái tô sẵn, bé tô nửa phải cho đối xứng. Chấm từng ô.
//   🧊 Khối 3D    — nhận tên khối, và từ lớp 4 đếm mặt – đỉnh.

type Dang = 'hinh' | 'doi-xung' | 'khoi';
const KHOA_LUU = 'bhh_hinh_hoc';

const DANG: { id: Dang; ten: string; emoji: string; tuLop: MucDo }[] = [
  { id: 'hinh', ten: 'Nhận hình', emoji: '🔷', tuLop: 1 },
  { id: 'doi-xung', ten: 'Đối xứng', emoji: '🪞', tuLop: 2 },
  { id: 'khoi', ten: 'Khối 3D', emoji: '🧊', tuLop: 1 },
];

const HINH_MO_MAN: BaiHinh = {
  hinh: HINH_PHANG[2],
  chon: [HINH_PHANG[2], HINH_PHANG[3], HINH_PHANG[1], HINH_PHANG[0]],
};

export default function HinhHocClient() {
  const [lop, setLop] = useState<MucDo>(2);
  const [dang, setDang] = useState<Dang>('hinh');

  const [bh, setBh] = useState<BaiHinh>(HINH_MO_MAN);
  const [bk, setBk] = useState<BaiKhoi | null>(null);
  const [bd, setBd] = useState<BaiDoiXung | null>(null);
  const [daTo, setDaTo] = useState<number[]>([]);

  const [daBam, setDaBam] = useState<string | null>(null);
  const [ketQua, setKetQua] = useState<'dung' | 'sai' | null>(null);
  const [diem, setDiem] = useState(0);
  const [tong, setTong] = useState(0);

  const raDe = useCallback(() => {
    setKetQua(null);
    setDaBam(null);
    setDaTo([]);
    if (dang === 'hinh') setBh(raBaiHinh(lop));
    else if (dang === 'khoi') setBk(raBaiKhoi(lop));
    else setBd(raBaiDoiXung(lop));
  }, [lop, dang]);

  // Đặt state thẳng trong effect — bọc rAF/microtask thì có thể chạy trước khi
  // hydrate xong, HTML hai bên lệch nhau.
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
    const d = DANG.find((x) => x.id === dang);
    if (d && l < d.tuLop) setDang('hinh');
    try { localStorage.setItem(KHOA_LUU, String(l)); } catch { /* bỏ qua */ }
  }

  function cham(ok: boolean, doc: string) {
    setKetQua(ok ? 'dung' : 'sai');
    setTong((t) => t + 1);
    if (ok) setDiem((d) => d + 1);
    unlockAudio();
    stopSpeaking();
    speakText(ok ? `Đúng rồi. ${doc}` : `Chưa đúng. ${doc}`);
  }

  const dangCo = DANG.filter((d) => lop >= d.tuLop);
  const nut = (dung: boolean, bam: boolean) => {
    if (!ketQua) return 'border-slate-200 bg-white text-slate-800';
    if (dung) return 'border-emerald-400 bg-emerald-50 text-emerald-700';
    if (bam) return 'border-rose-300 bg-rose-50 text-rose-600';
    return 'border-slate-100 bg-slate-50 text-slate-400';
  };

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-black text-slate-500">Bé học lớp</span>
        {MUC_DO.map((m) => (
          <button key={m.lop} onClick={() => doiLop(m.lop)} title={m.moTa}
                  className={`h-11 w-11 rounded-2xl border-2 text-lg font-black transition active:translate-y-0.5 ${
                    lop === m.lop
                      ? 'border-cyan-700 bg-gradient-to-b from-cyan-400 to-cyan-600 text-white shadow-[0_4px_0_#0e7490]'
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
            {d.emoji} {d.ten}
          </button>
        ))}
      </div>

      <div className="toan-nen relative mt-5 rounded-3xl border-2 border-cyan-100 bg-gradient-to-br from-cyan-50 to-sky-50/60 p-4 sm:p-6">
        {ketQua === 'dung' && <PhaoAnMung khoa={`${dang}-${tong}`} />}

        {/* 🔷 NHẬN HÌNH */}
        {dang === 'hinh' && (
          <div className="flex flex-col items-center">
            <p className="flex items-center gap-3 text-lg font-black text-slate-900">
              <button onClick={() => { unlockAudio(); stopSpeaking(); speakText('Đây là hình gì?'); }}
                      className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-b from-sky-400 to-blue-600 text-lg text-white shadow-[0_4px_0_#1e40af] transition active:translate-y-1 active:shadow-none"
                      aria-label="Nghe đọc câu hỏi">🔊</button>
              Đây là hình gì?
            </p>
            <div className="mt-3"><VeHinh ma={bh.hinh.ma} /></div>
            <div className="mt-4 grid w-full max-w-md grid-cols-2 gap-2.5">
              {bh.chon.map((c) => (
                <button key={c.ma} disabled={!!ketQua}
                        onClick={() => { setDaBam(c.ma); cham(c.ma === bh.hinh.ma, `Đây là ${bh.hinh.ten.toLowerCase()}`); }}
                        className={`rounded-2xl border-2 py-4 text-base font-black shadow-[0_4px_0_rgba(15,23,42,.08)] transition active:translate-y-1 active:shadow-none disabled:active:translate-y-0 ${nut(c.ma === bh.hinh.ma, daBam === c.ma)}`}>
                  {c.ten}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 🪞 ĐỐI XỨNG */}
        {dang === 'doi-xung' && bd && (
          <div className="flex flex-col items-center">
            <p className="flex items-center gap-3 text-center text-lg font-black text-slate-900">
              <button onClick={() => { unlockAudio(); stopSpeaking(); speakText('Tô nửa bên phải sao cho hình đối xứng qua đường kẻ đứng ở giữa'); }}
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-b from-sky-400 to-blue-600 text-lg text-white shadow-[0_4px_0_#1e40af] transition active:translate-y-1 active:shadow-none"
                      aria-label="Nghe đọc câu hỏi">🔊</button>
              Tô nửa phải cho <span className="text-cyan-700">đối xứng</span> qua đường kẻ giữa
            </p>
            <div className="relative mt-4 rounded-2xl bg-white p-3">
              <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${bd.n}, minmax(0, 1fr))` }}>
                {Array.from({ length: bd.n * bd.n }, (_, i) => {
                  const nuaTrai = i % bd.n < bd.n / 2;
                  const coSan = bd.mau.includes(i);
                  const beTo = daTo.includes(i);
                  const dungO = bd.dapAn.includes(i);
                  let kieu = 'bg-slate-100';
                  if (coSan) kieu = 'bg-cyan-500';
                  else if (beTo) kieu = ketQua ? (dungO ? 'bg-emerald-500' : 'bg-rose-400') : 'bg-cyan-400';
                  else if (ketQua && dungO) kieu = 'bg-emerald-200 ring-2 ring-emerald-500';
                  return (
                    <button
                      key={i}
                      disabled={nuaTrai || !!ketQua}
                      onClick={() => setDaTo((ds) => (ds.includes(i) ? ds.filter((x) => x !== i) : [...ds, i]))}
                      className={`h-8 w-8 rounded ${kieu} ${nuaTrai ? 'cursor-default' : 'cursor-pointer hover:opacity-80'}`}
                      style={{ width: bd.n > 6 ? 26 : 32, height: bd.n > 6 ? 26 : 32 }}
                      aria-label={`Ô hàng ${Math.floor(i / bd.n) + 1} cột ${(i % bd.n) + 1}`}
                    />
                  );
                })}
              </div>
              {/* Trục đối xứng */}
              <div className="pointer-events-none absolute inset-y-3 left-1/2 w-0.5 -translate-x-1/2 bg-rose-400" />
            </div>
            <p className="mt-2 text-sm font-bold text-slate-600">Đã tô {daTo.length}/{bd.dapAn.length} ô</p>
            <button onClick={() => cham(
                      daTo.length === bd.dapAn.length && daTo.every((x) => bd.dapAn.includes(x)),
                      'Mỗi ô bên trái phải có một ô đối diện bên phải, cách trục đúng bằng nhau')}
                    disabled={!!ketQua || daTo.length === 0}
                    className="mt-3 rounded-2xl bg-gradient-to-b from-cyan-400 to-cyan-600 px-8 py-3.5 text-base font-black text-white shadow-[0_5px_0_#0e7490] transition active:translate-y-1 active:shadow-[0_1px_0_#0e7490] disabled:opacity-50">
              Kiểm tra
            </button>
          </div>
        )}

        {/* 🧊 KHỐI 3D */}
        {dang === 'khoi' && bk && (
          <div className="flex flex-col items-center">
            <p className="flex items-center gap-3 text-center text-lg font-black text-slate-900">
              <button onClick={() => { unlockAudio(); stopSpeaking(); speakText(cauHoiKhoi(bk)); }}
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-b from-sky-400 to-blue-600 text-lg text-white shadow-[0_4px_0_#1e40af] transition active:translate-y-1 active:shadow-none"
                      aria-label="Nghe đọc câu hỏi">🔊</button>
              {cauHoiKhoi(bk)}
            </p>
            <div className="mt-3"><VeKhoi ma={bk.khoi.ma} /></div>
            <div className="mt-4 grid w-full max-w-md grid-cols-2 gap-2.5">
              {bk.chon.map((c) => (
                <button key={c} disabled={!!ketQua}
                        onClick={() => { setDaBam(c); cham(c === bk.dapAn, giaiKhoi(bk)); }}
                        className={`rounded-2xl border-2 py-4 text-base font-black shadow-[0_4px_0_rgba(15,23,42,.08)] transition active:translate-y-1 active:shadow-none disabled:active:translate-y-0 ${nut(c === bk.dapAn, daBam === c)}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {ketQua && (
          <div className={`mt-5 rounded-2xl border-2 p-4 ${ketQua === 'dung' ? 'toan-an-mung border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}>
            <p className="font-black text-slate-900">{ketQua === 'dung' ? '🎉 Đúng rồi!' : '💡 Chưa đúng'}</p>
            <p className="mt-1 text-sm leading-6 text-slate-700">
              {dang === 'hinh' && `${bh.hinh.ten}: ${bh.hinh.dacDiem}.`}
              {dang === 'doi-xung' && 'Hai nửa phải giống hệt nhau khi gấp đôi theo đường kẻ đỏ: ô nào cách trục mấy cột thì ô đối diện cũng cách đúng bấy nhiêu cột, và phải cùng hàng.'}
              {dang === 'khoi' && bk && giaiKhoi(bk)}
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

const cauHoiKhoi = (b: BaiKhoi) =>
  b.hoi === 'ten' ? 'Đây là khối gì?' : b.hoi === 'mat' ? 'Khối này có mấy mặt?' : 'Khối này có mấy đỉnh?';

function giaiKhoi(b: BaiKhoi): string {
  const k = b.khoi;
  if (b.hoi === 'ten') return `Đây là ${k.ten.toLowerCase()} — giống ${k.viDu}.`;
  if (b.hoi === 'mat') return `${k.ten} có ${k.mat} mặt. Đếm mặt trên, mặt dưới rồi các mặt xung quanh, đừng quên mặt bị khuất phía sau.`;
  return `${k.ten} có ${k.dinh} đỉnh và ${k.canh} cạnh. Đỉnh là chỗ các cạnh gặp nhau — nhớ đếm cả các đỉnh bị khuất.`;
}
