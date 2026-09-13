'use client';

import { useCallback, useEffect, useState } from 'react';
import HopBong from './HopBong';
import {
  MAU_BONG, MUC_DO, TEN_KET_LUAN, giaiThich, raBaiKhaNang, raBaiSoSanh, rutMot,
  type BaiKhaNang, type BaiSoSanh, type KetLuan, type MucDo,
} from '../lib/xacSuat';
import { speakText, stopSpeaking, unlockAudio } from '../components/edu/utils/speech';
import PhaoAnMung from '../components/edu/PhaoAnMung';

// Ba dạng:
//   🎯 Khả năng  — chắc chắn / có thể / không thể.
//   ⚖️ So sánh   — màu nào dễ lấy được hơn.
//   🎲 Rút thử   — bé bấm rút thật nhiều lần rồi TỰ thấy màu nhiều bóng hay ra
//      hơn. Đây là chỗ biến câu chữ thành trải nghiệm.

type Dang = 'kha-nang' | 'so-sanh' | 'rut-thu';
const KHOA_LUU = 'bhh_xac_suat';

const MO_MAN: BaiKhaNang = {
  hop: { bong: [{ ...MAU_BONG[0], so: 3 }, { ...MAU_BONG[1], so: 2 }], tong: 5 },
  maMau: 'do', tenMau: 'đỏ', dapAn: 'co-the',
};

export default function XacSuatClient() {
  const [lop, setLop] = useState<MucDo>(3);
  const [dang, setDang] = useState<Dang>('kha-nang');

  const [kn, setKn] = useState<BaiKhaNang>(MO_MAN);
  const [ss, setSs] = useState<BaiSoSanh | null>(null);
  const [daRut, setDaRut] = useState<string[]>([]);

  const [daBam, setDaBam] = useState<string | null>(null);
  const [ketQua, setKetQua] = useState<'dung' | 'sai' | null>(null);
  const [diem, setDiem] = useState(0);
  const [tong, setTong] = useState(0);

  const raDe = useCallback(() => {
    setKetQua(null);
    setDaBam(null);
    setDaRut([]);
    if (dang === 'so-sanh') setSs(raBaiSoSanh(lop));
    else setKn(raBaiKhaNang(lop));
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
    if (l <= 2 && dang !== 'kha-nang') setDang('kha-nang');
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

  const dangCo: { id: Dang; ten: string }[] = [
    { id: 'kha-nang', ten: '🎯 Khả năng' },
    ...(lop >= 3 ? [{ id: 'so-sanh' as Dang, ten: '⚖️ So sánh' }] : []),
    ...(lop >= 4 ? [{ id: 'rut-thu' as Dang, ten: '🎲 Rút thử' }] : []),
  ];

  // Thống kê các lần đã rút
  const demRut = MAU_BONG.map((m) => ({ ...m, so: daRut.filter((x) => x === m.ma).length }))
    .filter((m) => kn.hop.bong.some((b) => b.ma === m.ma));

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
                      ? 'border-fuchsia-700 bg-gradient-to-b from-fuchsia-400 to-fuchsia-600 text-white shadow-[0_4px_0_#a21caf]'
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

      <div className="toan-nen relative mt-5 rounded-3xl border-2 border-fuchsia-100 bg-gradient-to-br from-fuchsia-50 to-pink-50/60 p-4 sm:p-6">
        {ketQua === 'dung' && <PhaoAnMung khoa={`${dang}-${tong}`} />}

        {/* 🎯 KHẢ NĂNG */}
        {dang === 'kha-nang' && (
          <div className="flex flex-col items-center">
            <p className="flex items-center gap-3 text-center text-lg font-black leading-7 text-slate-900">
              <button onClick={() => { unlockAudio(); stopSpeaking(); speakText(`Lấy ra một quả bất kỳ từ hộp. Lấy được quả màu ${kn.tenMau} là điều chắc chắn, có thể hay không thể?`); }}
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-b from-sky-400 to-blue-600 text-lg text-white shadow-[0_4px_0_#1e40af] transition active:translate-y-1 active:shadow-none"
                      aria-label="Nghe đọc câu hỏi">🔊</button>
              Lấy 1 quả bất kỳ — lấy được quả <b style={{ color: MAU_BONG.find((m) => m.ma === kn.maMau)?.mau }}>{kn.tenMau}</b> là điều gì?
            </p>
            <div className="mt-3 rounded-2xl bg-white/70 p-3">
              <HopBong hop={kn.hop} />
            </div>
            <div className="mt-4 grid w-full max-w-lg grid-cols-1 gap-2.5 sm:grid-cols-3">
              {(['chac-chan', 'co-the', 'khong-the'] as KetLuan[]).map((k) => (
                <button key={k} disabled={!!ketQua}
                        onClick={() => { setDaBam(k); cham(k === kn.dapAn, giaiThich(kn.hop, kn.tenMau, kn.dapAn)); }}
                        className={`rounded-2xl border-2 py-4 text-base font-black shadow-[0_4px_0_rgba(15,23,42,.08)] transition active:translate-y-1 active:shadow-none disabled:active:translate-y-0 ${nut(k === kn.dapAn, daBam === k)}`}>
                  {TEN_KET_LUAN[k]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ⚖️ SO SÁNH */}
        {dang === 'so-sanh' && ss && (
          <div className="flex flex-col items-center">
            <p className="flex items-center gap-3 text-center text-lg font-black text-slate-900">
              <button onClick={() => { unlockAudio(); stopSpeaking(); speakText('Lấy một quả bất kỳ, màu nào có khả năng lấy được nhiều hơn?'); }}
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-b from-sky-400 to-blue-600 text-lg text-white shadow-[0_4px_0_#1e40af] transition active:translate-y-1 active:shadow-none"
                      aria-label="Nghe đọc câu hỏi">🔊</button>
              Màu nào dễ lấy được nhất?
            </p>
            <div className="mt-3 rounded-2xl bg-white/70 p-3"><HopBong hop={ss.hop} /></div>
            <div className="mt-4 grid w-full max-w-md grid-cols-2 gap-2.5">
              {ss.chon.map((c) => (
                <button key={c} disabled={!!ketQua}
                        onClick={() => { setDaBam(c); cham(c === ss.dapAn, `Màu ${ss.dapAn} có nhiều quả nhất nên dễ lấy được nhất`); }}
                        className={`rounded-2xl border-2 py-4 text-base font-black shadow-[0_4px_0_rgba(15,23,42,.08)] transition active:translate-y-1 active:shadow-none disabled:active:translate-y-0 ${nut(c === ss.dapAn, daBam === c)}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 🎲 RÚT THỬ */}
        {dang === 'rut-thu' && (
          <div className="flex flex-col items-center">
            <p className="flex items-center gap-3 text-center text-lg font-black text-slate-900">
              <button onClick={() => { unlockAudio(); stopSpeaking(); speakText('Bấm rút thử nhiều lần rồi xem màu nào hay ra nhất'); }}
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-b from-sky-400 to-blue-600 text-lg text-white shadow-[0_4px_0_#1e40af] transition active:translate-y-1 active:shadow-none"
                      aria-label="Nghe đọc câu hỏi">🔊</button>
              Rút thử rồi tự kết luận
            </p>
            <div className="mt-3 rounded-2xl bg-white/70 p-3"><HopBong hop={kn.hop} /></div>

            <div className="mt-3 flex gap-2">
              <button onClick={() => setDaRut((ds) => [...ds, rutMot(kn.hop).ma])}
                      className="rounded-2xl bg-gradient-to-b from-fuchsia-400 to-fuchsia-600 px-6 py-3 text-sm font-black text-white shadow-[0_4px_0_#a21caf] transition active:translate-y-1 active:shadow-none">
                🎲 Rút 1 quả
              </button>
              <button onClick={() => setDaRut((ds) => [...ds, ...Array.from({ length: 10 }, () => rutMot(kn.hop).ma)])}
                      className="rounded-2xl border-2 border-fuchsia-300 bg-white px-5 py-3 text-sm font-black text-fuchsia-700">
                Rút 10 lần
              </button>
              {daRut.length > 0 && (
                <button onClick={() => setDaRut([])} className="rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-500">
                  Xoá
                </button>
              )}
            </div>

            {/* Thống kê kết quả rút — biểu đồ cột mini */}
            {daRut.length > 0 && (
              <div className="mt-4 w-full max-w-md rounded-2xl bg-white p-4">
                <p className="text-sm font-black text-slate-700">Đã rút {daRut.length} lần:</p>
                <div className="mt-2 space-y-1.5">
                  {demRut.map((m) => (
                    <div key={m.ma} className="flex items-center gap-2">
                      <span className="w-12 text-xs font-bold text-slate-600">{m.ten}</span>
                      <span className="h-4 rounded-full transition-all"
                            style={{ background: m.mau, width: `${(m.so / Math.max(1, daRut.length)) * 70}%`, minWidth: m.so ? 8 : 0 }} />
                      <span className="text-xs font-black text-slate-500">{m.so}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs leading-5 text-slate-500">
                  Trong hộp có {kn.hop.bong.map((b) => `${b.so} quả ${b.ten}`).join(', ')}. Rút càng nhiều lần thì tỉ lệ
                  các màu càng giống tỉ lệ số quả trong hộp — màu nhiều quả hơn sẽ hay ra hơn, nhưng
                  <b> không có nghĩa là lần nào cũng ra</b>.
                </p>
              </div>
            )}
          </div>
        )}

        {ketQua && (
          <div className={`mt-5 rounded-2xl border-2 p-4 ${ketQua === 'dung' ? 'toan-an-mung border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}>
            <p className="font-black text-slate-900">{ketQua === 'dung' ? '🎉 Đúng rồi!' : '💡 Chưa đúng'}</p>
            <p className="mt-1 text-sm leading-6 text-slate-700">
              {dang === 'kha-nang'
                ? giaiThich(kn.hop, kn.tenMau, kn.dapAn)
                : ss
                  ? `Hộp có ${ss.hop.bong.map((b) => `${b.so} quả ${b.ten}`).join(', ')}. Màu nào nhiều quả hơn thì khả năng lấy được cao hơn, nên đáp án là ${ss.dapAn}.`
                  : ''}
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
