'use client';

import { useCallback, useEffect, useState } from 'react';
import ThanhThapPhan from './ThanhThapPhan';
import {
  MUC_DO, docSo, giaiDoc, giaiSoSanh, raBaiDoc, raBaiDoi, raBaiSoSanh, viet,
  type BaiDoc, type BaiDoi, type BaiSoSanh, type MucDo,
} from '../lib/soThapPhan';
import { speakText, stopSpeaking, unlockAudio } from '../components/edu/utils/speech';
import PhaoAnMung from '../components/edu/PhaoAnMung';

// Ba dạng:
//   👀 Đọc số   — nhìn hình tô, viết ra số thập phân.
//   ⚖️ So sánh  — hai thanh cạnh nhau, thấy ngay 0,5 lớn hơn 0,45.
//   🔄 Đổi      — phân số thập phân sang số thập phân.

type Dang = 'doc' | 'so-sanh' | 'doi';
const KHOA_LUU = 'bhh_thap_phan';

const DOC_MO_MAN: BaiDoc = { o: 3, tong: 10, gia: 0.3, soLe: 1, dapAn: '0,3', chon: ['0,3', '3', '0,03', '0,4'] };
const SS_MO_MAN: BaiSoSanh = { a: 0.5, b: 0.45, soLe: 2, dapAn: '>' };
const DOI_MO_MAN: BaiDoi = { tu: 7, mau: 10, dapAn: '0,7', chon: ['0,7', '7', '0,07', '0,8'] };

export default function ThapPhanClient() {
  const [lop, setLop] = useState<MucDo>(5);
  const [dang, setDang] = useState<Dang>('doc');

  const [doc, setDoc] = useState<BaiDoc>(DOC_MO_MAN);
  const [ss, setSs] = useState<BaiSoSanh>(SS_MO_MAN);
  const [doi, setDoi] = useState<BaiDoi>(DOI_MO_MAN);

  const [daBam, setDaBam] = useState<string | null>(null);
  const [ketQua, setKetQua] = useState<'dung' | 'sai' | null>(null);
  const [diem, setDiem] = useState(0);
  const [tong, setTong] = useState(0);

  const raDe = useCallback(() => {
    setKetQua(null);
    setDaBam(null);
    if (dang === 'doc') setDoc(raBaiDoc(lop));
    else if (dang === 'so-sanh') setSs(raBaiSoSanh(lop));
    else setDoi(raBaiDoi(lop));
  }, [lop, dang]);

  // Đặt state thẳng trong effect — bọc rAF/microtask thì có thể chạy trước khi
  // hydrate xong, HTML hai bên lệch nhau.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { raDe(); }, [raDe]);

  useEffect(() => {
    try {
      const l = Number(localStorage.getItem(KHOA_LUU));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (l === 4 || l === 5) setLop(l as MucDo);
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
                      ? 'border-sky-700 bg-gradient-to-b from-sky-400 to-sky-600 text-white shadow-[0_4px_0_#0369a1]'
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
        {([['doc', '👀 Đọc số'], ['so-sanh', '⚖️ So sánh'], ['doi', '🔄 Đổi phân số']] as const).map(([id, ten]) => (
          <button key={id} onClick={() => { stopSpeaking(); setDang(id); }}
                  className={`flex-1 rounded-full px-2 py-2 text-xs font-black transition sm:text-sm ${
                    dang === id ? 'bg-white text-slate-900 shadow' : 'text-slate-500'}`}>
            {ten}
          </button>
        ))}
      </div>

      <div className="toan-nen relative mt-5 rounded-3xl border-2 border-sky-100 bg-gradient-to-br from-sky-50 to-cyan-50/60 p-4 sm:p-6">
        {ketQua === 'dung' && <PhaoAnMung khoa={`${dang}-${tong}`} />}

        {/* 👀 ĐỌC SỐ */}
        {dang === 'doc' && (
          <div className="flex flex-col items-center">
            <p className="flex items-center gap-3 text-lg font-black text-slate-900">
              <button onClick={() => { unlockAudio(); stopSpeaking(); speakText('Phần đã tô là số thập phân nào?'); }}
                      className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-b from-sky-400 to-blue-600 text-lg text-white shadow-[0_4px_0_#1e40af] transition active:translate-y-1 active:shadow-none"
                      aria-label="Nghe đọc câu hỏi">🔊</button>
              Phần đã tô là số nào?
            </p>
            <div className="mt-4 flex w-full justify-center">
              <ThanhThapPhan o={doc.o} tong={doc.tong} nhan={`${doc.o} / ${doc.tong}`} />
            </div>
            <div className="mt-5 grid w-full max-w-md grid-cols-2 gap-2.5 sm:grid-cols-4">
              {doc.chon.map((c) => (
                <button key={c} disabled={!!ketQua}
                        onClick={() => { setDaBam(c); cham(c === doc.dapAn, `Đáp án là ${docSo(doc.gia, doc.soLe)}`); }}
                        className={`rounded-2xl border-2 py-5 text-xl font-black shadow-[0_4px_0_rgba(15,23,42,.08)] transition active:translate-y-1 active:shadow-none disabled:active:translate-y-0 ${nut(c === doc.dapAn, daBam === c)}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ⚖️ SO SÁNH */}
        {dang === 'so-sanh' && (
          <div className="flex flex-col items-center">
            <p className="flex items-center gap-3 text-lg font-black text-slate-900">
              <button onClick={() => { unlockAudio(); stopSpeaking(); speakText(`So sánh ${docSo(ss.a, 2)} và ${docSo(ss.b, 2)}`); }}
                      className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-b from-sky-400 to-blue-600 text-lg text-white shadow-[0_4px_0_#1e40af] transition active:translate-y-1 active:shadow-none"
                      aria-label="Nghe đọc câu hỏi">🔊</button>
              So sánh hai số
            </p>
            <p className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
              {viet(ss.a, ss.soLe)} <span className="text-sky-600">?</span> {viet(ss.b, ss.soLe)}
            </p>

            {/* Hai thanh 100 ô đặt chồng — nhìn là thấy bên nào dài hơn */}
            <div className="mt-4 grid w-full max-w-[560px] gap-3 sm:grid-cols-2">
              <div className="flex flex-col items-center rounded-2xl bg-white p-2">
                <ThanhThapPhan o={Math.round(ss.a * 100)} tong={100} mau="#0ea5e9" nhan={viet(ss.a, ss.soLe)} />
              </div>
              <div className="flex flex-col items-center rounded-2xl bg-white p-2">
                <ThanhThapPhan o={Math.round(ss.b * 100)} tong={100} mau="#a855f7" nhan={viet(ss.b, ss.soLe)} />
              </div>
            </div>

            <div className="mt-4 flex gap-2.5">
              {(['>', '=', '<'] as const).map((d) => (
                <button key={d} disabled={!!ketQua}
                        onClick={() => { setDaBam(d); cham(d === ss.dapAn, `${docSo(ss.a, 2)} ${ss.dapAn === '>' ? 'lớn hơn' : 'bé hơn'} ${docSo(ss.b, 2)}`); }}
                        className={`rounded-2xl border-2 px-8 py-5 text-3xl font-black shadow-[0_4px_0_rgba(15,23,42,.08)] transition active:translate-y-1 active:shadow-none disabled:active:translate-y-0 ${nut(d === ss.dapAn, daBam === d)}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 🔄 ĐỔI PHÂN SỐ */}
        {dang === 'doi' && (
          <div className="flex flex-col items-center">
            <p className="flex items-center gap-3 text-lg font-black text-slate-900">
              <button onClick={() => { unlockAudio(); stopSpeaking(); speakText(`${doi.tu} phần ${doi.mau} viết thành số thập phân là bao nhiêu?`); }}
                      className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-b from-sky-400 to-blue-600 text-lg text-white shadow-[0_4px_0_#1e40af] transition active:translate-y-1 active:shadow-none"
                      aria-label="Nghe đọc câu hỏi">🔊</button>
              Viết thành số thập phân
            </p>
            <p className="mt-3 flex items-center gap-3 text-3xl font-black text-slate-900">
              <span className="inline-flex flex-col items-center leading-none">
                <span>{doi.tu}</span>
                <span className="my-1 block w-full border-t-[3px] border-current" />
                <span>{doi.mau}</span>
              </span>
              <span>=</span>
              <span className="text-sky-600">?</span>
            </p>
            <div className="mt-4 flex w-full justify-center">
              <ThanhThapPhan o={doi.mau === 10 ? doi.tu : doi.tu} tong={doi.mau} mau="#0284c7" />
            </div>
            <div className="mt-5 grid w-full max-w-md grid-cols-2 gap-2.5 sm:grid-cols-4">
              {doi.chon.map((c) => (
                <button key={c} disabled={!!ketQua}
                        onClick={() => { setDaBam(c); cham(c === doi.dapAn, `${doi.tu} phần ${doi.mau} bằng ${doi.dapAn.replace(',', ' phẩy ')}`); }}
                        className={`rounded-2xl border-2 py-5 text-xl font-black shadow-[0_4px_0_rgba(15,23,42,.08)] transition active:translate-y-1 active:shadow-none disabled:active:translate-y-0 ${nut(c === doi.dapAn, daBam === c)}`}>
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
              {dang === 'doc' && giaiDoc(doc)}
              {dang === 'so-sanh' && giaiSoSanh(ss)}
              {dang === 'doi' && `Phân số có mẫu ${doi.mau} viết thành số thập phân bằng cách đặt dấu phẩy sao cho phần thập phân có ${doi.mau === 10 ? 'MỘT' : 'HAI'} chữ số: ${doi.tu}/${doi.mau} = ${doi.dapAn}.`}
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
