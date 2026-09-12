'use client';

import { useCallback, useEffect, useState } from 'react';
import ThuocKe from './ThuocKe';
import CanDia from './CanDia';
import {
  MUC_DO, canBang, donVi, giaiQuyDoi, raBaiCan, raBaiQuyDoi, raBaiThuoc, vietSo,
  type BaiCan, type BaiQuyDoi, type BaiThuoc, type MucDo,
} from '../lib/doLuong';
import { speakText, stopSpeaking, unlockAudio } from '../components/edu/utils/speech';
import PhaoAnMung from '../components/edu/PhaoAnMung';

// Ba dạng, mỗi dạng một việc bé phải tự làm:
//   📏 Đo thước — đọc độ dài đoạn thẳng, có bài đặt lệch vạch 0.
//   ⚖️ Cân      — đặt quả cân cho cán cân thăng bằng.
//   🔄 Quy đổi  — đổi đơn vị, giải thích theo bậc chứ không nêu mỗi kết quả.

type Dang = 'thuoc' | 'can' | 'quy-doi';
const KHOA_LUU = 'bhh_do_luong';

const DANG: { id: Dang; ten: string; emoji: string; tuLop: MucDo }[] = [
  { id: 'thuoc', ten: 'Đo thước', emoji: '📏', tuLop: 1 },
  { id: 'can', ten: 'Cân', emoji: '⚖️', tuLop: 2 },
  { id: 'quy-doi', ten: 'Đổi đơn vị', emoji: '🔄', tuLop: 2 },
];

/** Đề mở màn CỐ ĐỊNH — random ở state khởi tạo thì HTML hai bên lệch nhau. */
const THUOC_MO_MAN: BaiThuoc = { mm: 70, maDonVi: 'cm', dapAn: 7, batDauMm: 0, chon: [7, 8, 6, 70] };
const CAN_MO_MAN: BaiCan = { gam: 1500, quaCan: [500, 1000, 2000], ten: 'túi gạo', emoji: '🌾' };
const DOI_MO_MAN: BaiQuyDoi = { tu: 1, maTu: 'm', maDen: 'dm', dapAn: 10, nhom: 'dai', chon: [10, 100, 1, 1000] };

export default function DoLuongClient() {
  const [lop, setLop] = useState<MucDo>(2);
  const [dang, setDang] = useState<Dang>('thuoc');

  const [thuoc, setThuoc] = useState<BaiThuoc>(THUOC_MO_MAN);
  const [can, setCan] = useState<BaiCan>(CAN_MO_MAN);
  const [daDat, setDaDat] = useState<number[]>([]);
  const [doi, setDoi] = useState<BaiQuyDoi>(DOI_MO_MAN);

  const [daBam, setDaBam] = useState<number | null>(null);
  const [ketQua, setKetQua] = useState<'dung' | 'sai' | null>(null);
  const [diem, setDiem] = useState(0);
  const [tong, setTong] = useState(0);

  const raDe = useCallback(() => {
    setKetQua(null);
    setDaBam(null);
    setDaDat([]);
    if (dang === 'thuoc') setThuoc(raBaiThuoc(lop));
    else if (dang === 'can') setCan(raBaiCan(lop));
    else setDoi(raBaiQuyDoi(lop));
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
    if (d && l < d.tuLop) setDang('thuoc');
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

  const tongDat = daDat.reduce((s, x) => s + x, 0);
  const dangCo = DANG.filter((d) => lop >= d.tuLop);
  const nut = (dung: boolean, bam: boolean) => {
    if (!ketQua) return 'border-slate-200 bg-white text-slate-800';
    if (dung) return 'border-emerald-400 bg-emerald-50 text-emerald-700';
    if (bam) return 'border-rose-300 bg-rose-50 text-rose-600';
    return 'border-slate-100 bg-slate-50 text-slate-400';
  };

  return (
    <div className="mt-6">
      {/* Lớp */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-black text-slate-500">Bé học lớp</span>
        {MUC_DO.map((m) => (
          <button key={m.lop} onClick={() => doiLop(m.lop)} title={m.moTa}
                  className={`h-11 w-11 rounded-2xl border-2 text-lg font-black transition active:translate-y-0.5 ${
                    lop === m.lop
                      ? 'border-amber-600 bg-gradient-to-b from-amber-400 to-amber-600 text-white shadow-[0_4px_0_#b45309]'
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

      <div className="toan-nen relative mt-5 rounded-3xl border-2 border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50/60 p-4 sm:p-6">
        {ketQua === 'dung' && <PhaoAnMung khoa={`${dang}-${tong}`} />}

        {/* 📏 ĐO THƯỚC */}
        {dang === 'thuoc' && (
          <div>
            <p className="flex items-center gap-3 text-lg font-black text-slate-900">
              <button onClick={() => { unlockAudio(); stopSpeaking(); speakText(`Đoạn thẳng màu đỏ dài bao nhiêu ${donVi(thuoc.maDonVi).ten}?`); }}
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-b from-sky-400 to-blue-600 text-lg text-white shadow-[0_4px_0_#1e40af] transition active:translate-y-1 active:shadow-none"
                      aria-label="Nghe đọc câu hỏi">
                🔊
              </button>
              Đoạn thẳng đỏ dài bao nhiêu {thuoc.maDonVi}?
            </p>
            {thuoc.batDauMm > 0 && (
              <p className="mt-1 text-sm font-bold text-amber-700">
                Chú ý: đoạn thẳng không bắt đầu ở vạch 0 — phải lấy vạch cuối trừ vạch đầu.
              </p>
            )}
            <div className="mt-3 rounded-2xl bg-white/70 p-2">
              <ThuocKe batDauMm={thuoc.batDauMm} daiMm={thuoc.mm} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {thuoc.chon.map((n) => (
                <button key={n} disabled={!!ketQua}
                        onClick={() => { setDaBam(n); cham(n === thuoc.dapAn, `Đoạn thẳng dài ${vietSo(thuoc.dapAn)} ${thuoc.maDonVi}`); }}
                        className={`rounded-2xl border-2 py-5 text-xl font-black shadow-[0_4px_0_rgba(15,23,42,.08)] transition active:translate-y-1 active:shadow-none disabled:active:translate-y-0 ${nut(n === thuoc.dapAn, daBam === n)}`}>
                  {vietSo(n)} {thuoc.maDonVi}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ⚖️ CÂN */}
        {dang === 'can' && (
          <div className="flex flex-col items-center">
            <p className="flex items-center gap-3 text-center text-lg font-black text-slate-900">
              <button onClick={() => { unlockAudio(); stopSpeaking(); speakText(`Hãy đặt quả cân cho cân thăng bằng. ${can.ten} nặng ${can.gam >= 1000 ? `${can.gam / 1000} ki lô gam` : `${can.gam} gam`}`); }}
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-b from-sky-400 to-blue-600 text-lg text-white shadow-[0_4px_0_#1e40af] transition active:translate-y-1 active:shadow-none"
                      aria-label="Nghe đọc câu hỏi">
                🔊
              </button>
              Đặt quả cân cho thăng bằng — {can.emoji} {can.ten} nặng{' '}
              <span className="text-amber-700">{can.gam >= 1000 ? `${vietSo(can.gam / 1000)} kg` : `${can.gam} g`}</span>
            </p>
            <div className="mt-3"><CanDia gamTrai={can.gam} gamPhai={tongDat} ten={can.ten} emoji={can.emoji} /></div>

            <p className="mt-1 text-xs font-black uppercase tracking-wide text-slate-400">Quả cân — bấm để đặt lên đĩa</p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {can.quaCan.map((q) => (
                <button key={q} disabled={!!ketQua} onClick={() => setDaDat((ds) => [...ds, q])}
                        className="rounded-xl border-2 border-slate-300 bg-white px-4 py-2.5 text-sm font-black text-slate-700 shadow-[0_3px_0_#cbd5e1] transition active:translate-y-0.5 active:shadow-none disabled:opacity-50">
                  {q >= 1000 ? `${vietSo(q / 1000)} kg` : `${q} g`}
                </button>
              ))}
              {daDat.length > 0 && !ketQua && (
                <button onClick={() => setDaDat((ds) => ds.slice(0, -1))}
                        className="rounded-xl border-2 border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-black text-rose-600">
                  ⌫ Bỏ ra
                </button>
              )}
            </div>
            <button onClick={() => cham(tongDat === can.gam, `${can.ten} nặng ${can.gam >= 1000 ? `${vietSo(can.gam / 1000)} ki lô gam` : `${can.gam} gam`}`)}
                    disabled={!!ketQua || daDat.length === 0}
                    className="mt-4 rounded-2xl bg-gradient-to-b from-amber-400 to-amber-600 px-8 py-3.5 text-base font-black text-white shadow-[0_5px_0_#b45309] transition active:translate-y-1 active:shadow-[0_1px_0_#b45309] disabled:opacity-50">
              Kiểm tra
            </button>
          </div>
        )}

        {/* 🔄 QUY ĐỔI */}
        {dang === 'quy-doi' && (
          <div>
            <p className="flex items-center gap-3 text-lg font-black text-slate-900">
              <button onClick={() => { unlockAudio(); stopSpeaking(); speakText(`${vietSo(doi.tu)} ${donVi(doi.maTu).ten} bằng bao nhiêu ${donVi(doi.maDen).ten}?`); }}
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-b from-sky-400 to-blue-600 text-lg text-white shadow-[0_4px_0_#1e40af] transition active:translate-y-1 active:shadow-none"
                      aria-label="Nghe đọc câu hỏi">
                🔊
              </button>
              Đổi đơn vị
            </p>
            <p className="mt-4 text-center text-4xl font-black text-slate-900 sm:text-5xl">
              {vietSo(doi.tu)} {doi.maTu} = <span className="text-amber-600">?</span> {doi.maDen}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {doi.chon.map((n) => (
                <button key={n} disabled={!!ketQua}
                        onClick={() => { setDaBam(n); cham(n === doi.dapAn, `${vietSo(doi.tu)} ${doi.maTu} bằng ${vietSo(doi.dapAn)} ${doi.maDen}`); }}
                        className={`rounded-2xl border-2 py-5 text-xl font-black shadow-[0_4px_0_rgba(15,23,42,.08)] transition active:translate-y-1 active:shadow-none disabled:active:translate-y-0 ${nut(n === doi.dapAn, daBam === n)}`}>
                  {vietSo(n)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chấm bài */}
        {ketQua && (
          <div className={`mt-5 rounded-2xl border-2 p-4 ${ketQua === 'dung' ? 'toan-an-mung border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}>
            <p className="font-black text-slate-900">{ketQua === 'dung' ? '🎉 Đúng rồi!' : '💡 Chưa đúng'}</p>
            <p className="mt-1 text-sm leading-6 text-slate-700">{giaiThich(dang, thuoc, can, doi)}</p>
            <button onClick={raDe} className="mt-3 rounded-full bg-slate-900 px-6 py-2.5 text-sm font-black text-white shadow-[0_4px_0_#0f172a55] transition active:translate-y-1 active:shadow-none">
              Bài tiếp →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function giaiThich(dang: Dang, t: BaiThuoc, c: BaiCan, d: BaiQuyDoi): string {
  if (dang === 'thuoc') {
    if (t.batDauMm > 0) {
      return `Đoạn thẳng bắt đầu ở vạch ${vietSo(t.batDauMm / 10)} và kết thúc ở vạch ${vietSo((t.batDauMm + t.mm) / 10)}, nên độ dài là ${vietSo((t.batDauMm + t.mm) / 10)} − ${vietSo(t.batDauMm / 10)} = ${vietSo(t.mm / 10)} cm${t.maDonVi === 'mm' ? ` = ${vietSo(t.mm)} mm` : ''}.`;
    }
    return `Đoạn thẳng bắt đầu ở vạch 0 và kết thúc ở vạch ${vietSo(t.mm / 10)}, nên dài ${vietSo(t.dapAn)} ${t.maDonVi}. Mỗi ô nhỏ nhất trên thước là 1 mm, mười ô là 1 cm.`;
  }
  if (dang === 'can') {
    const cach = canBang(c.gam, c.quaCan);
    return `${c.ten} nặng ${c.gam >= 1000 ? `${vietSo(c.gam / 1000)} kg` : `${c.gam} g`}. Cách đặt ít quả cân nhất: ${cach.map((q) => (q >= 1000 ? `${vietSo(q / 1000)}kg` : `${q}g`)).join(' + ')}. Cách khác cũng được, miễn tổng đúng bằng khối lượng vật.`;
  }
  return giaiQuyDoi(d);
}
