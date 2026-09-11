'use client';

import { useCallback, useEffect, useState } from 'react';
import ToTienHinh from './ToTienHinh';
import {
  MUC_DO, docTien, nhieuSoTien, raBaiMua, raSoTien, toTheoLop, traTien, vietTien,
  type BaiMua, type MucDo,
} from '../lib/tienViet';
import { speakText, stopSpeaking, unlockAudio } from '../components/edu/utils/speech';
import PhaoAnMung from '../components/edu/PhaoAnMung';

// Ba dạng, đi đúng thứ tự bé gặp ngoài đời:
//   👀 Nhận biết — thấy tờ tiền, đọc ra bao nhiêu.
//   💰 Trả tiền  — chọn các tờ cho đủ số tiền phải trả.
//   🧾 Tiền thối — mua hàng, đưa tiền, tính còn được trả lại bao nhiêu.

type Dang = 'nhan-biet' | 'tra-tien' | 'thoi-tien';
const KHOA_LUU = 'bhh_tien_viet';

const DANG: { id: Dang; ten: string; emoji: string; tuLop: MucDo }[] = [
  { id: 'nhan-biet', ten: 'Nhận biết', emoji: '👀', tuLop: 1 },
  { id: 'tra-tien', ten: 'Trả tiền', emoji: '💰', tuLop: 2 },
  { id: 'thoi-tien', ten: 'Tiền thối', emoji: '🧾', tuLop: 3 },
];

const xao = <T,>(ds: T[]) => {
  const a = [...ds];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};

/** Bài mở màn cố định — state khởi tạo mà random thì HTML máy chủ khác trình duyệt. */
const MUA_MO_MAN: BaiMua = {
  mon: [{ ten: 'quyển vở', emoji: '📓', gia: 7000 }],
  phaiTra: 7000, dua: 10000, thoi: 3000,
};

export default function TienClient() {
  const [lop, setLop] = useState<MucDo>(2);
  const [dang, setDang] = useState<Dang>('nhan-biet');

  const [to, setTo] = useState(5000);
  const [soTien, setSoTien] = useState(12000);
  const [gioTo, setGioTo] = useState<number[]>([]);   // các tờ bé đã chọn để trả
  const [mua, setMua] = useState<BaiMua>(MUA_MO_MAN);
  const [chonDs, setChonDs] = useState<number[]>([]);
  const [daBam, setDaBam] = useState<number | null>(null);
  const [ketQua, setKetQua] = useState<'dung' | 'sai' | null>(null);
  const [diem, setDiem] = useState(0);
  const [tong, setTong] = useState(0);

  const raDe = useCallback(() => {
    setKetQua(null);
    setDaBam(null);
    setGioTo([]);
    if (dang === 'nhan-biet') {
      const ds = toTheoLop(lop);
      const t = ds[Math.floor(Math.random() * ds.length)].gia;
      setTo(t);
      setChonDs(xao([t, ...nhieuSoTien(t).slice(0, 3)]));
      return;
    }
    if (dang === 'tra-tien') { setSoTien(raSoTien(lop)); return; }
    const b = raBaiMua(lop);
    setMua(b);
    setChonDs(xao([b.thoi, ...nhieuSoTien(b.thoi)]));
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
    if (d && l < d.tuLop) setDang('nhan-biet');
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

  const daTra = gioTo.reduce((s, x) => s + x, 0);
  const dangCo = DANG.filter((d) => lop >= d.tuLop);

  return (
    <div className="mt-6">
      {/* Lớp */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-black text-slate-500">Bé học lớp</span>
        {MUC_DO.map((m) => (
          <button key={m.lop} onClick={() => doiLop(m.lop)} title={m.moTa}
                  className={`h-11 w-11 rounded-2xl border-2 text-lg font-black transition active:translate-y-0.5 ${
                    lop === m.lop
                      ? 'border-teal-700 bg-gradient-to-b from-teal-400 to-teal-600 text-white shadow-[0_4px_0_#0f766e]'
                      : 'border-slate-200 bg-white text-slate-600 shadow-[0_3px_0_#e2e8f0]'}`}>
            {m.lop}
          </button>
        ))}
        <span key={diem} className="toan-sao-nay ml-auto rounded-full bg-gradient-to-b from-amber-200 to-amber-300 px-3.5 py-1.5 text-sm font-black text-amber-800 shadow-[0_3px_0_#fbbf24]">
          ⭐ {diem}/{tong}
        </span>
      </div>
      <p className="mt-1.5 text-xs text-slate-500">{MUC_DO.find((m) => m.lop === lop)!.moTa}</p>

      {/* Dạng bài */}
      <div className="mt-4 flex gap-2 rounded-full bg-slate-100 p-1">
        {dangCo.map((d) => (
          <button key={d.id} onClick={() => { stopSpeaking(); setDang(d.id); }}
                  className={`flex-1 rounded-full px-2 py-2 text-xs font-black transition sm:text-sm ${
                    dang === d.id ? 'bg-white text-slate-900 shadow' : 'text-slate-500'}`}>
            {d.emoji} {d.ten}
          </button>
        ))}
      </div>

      <div className="toan-nen relative mt-5 rounded-3xl border-2 border-teal-100 bg-gradient-to-br from-teal-50 to-emerald-50/60 p-4 sm:p-6">
        {ketQua === 'dung' && <PhaoAnMung khoa={`${dang}-${tong}`} />}

        {/* 👀 NHẬN BIẾT */}
        {dang === 'nhan-biet' && (
          <div className="flex flex-col items-center">
            <p className="flex items-center gap-3 text-lg font-black text-slate-900">
              <button onClick={() => { unlockAudio(); stopSpeaking(); speakText('Tờ tiền này là bao nhiêu?'); }}
                      className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-b from-sky-400 to-blue-600 text-lg text-white shadow-[0_4px_0_#1e40af] transition active:translate-y-1 active:shadow-none"
                      aria-label="Nghe đọc câu hỏi">
                🔊
              </button>
              Tờ tiền này là bao nhiêu?
            </p>
            <div className="mt-4"><ToTienHinh gia={to} /></div>
            <div className="mt-5 grid w-full max-w-md grid-cols-2 gap-2.5">
              {chonDs.map((n) => {
                const laDung = n === to;
                let k = 'border-slate-200 bg-white text-slate-800';
                if (ketQua) {
                  if (laDung) k = 'border-emerald-400 bg-emerald-50 text-emerald-700';
                  else if (daBam === n) k = 'border-rose-300 bg-rose-50 text-rose-600';
                  else k = 'border-slate-100 bg-slate-50 text-slate-400';
                }
                return (
                  <button key={n} disabled={!!ketQua}
                          onClick={() => { setDaBam(n); cham(laDung, `Tờ này là ${docTien(to)}`); }}
                          className={`rounded-2xl border-2 py-4 text-lg font-black shadow-[0_4px_0_rgba(15,23,42,.08)] transition active:translate-y-1 active:shadow-none disabled:active:translate-y-0 ${k}`}>
                    {vietTien(n)}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 💰 TRẢ TIỀN */}
        {dang === 'tra-tien' && (
          <div>
            <p className="flex items-center gap-3 text-lg font-black text-slate-900">
              <button onClick={() => { unlockAudio(); stopSpeaking(); speakText(`Bé hãy trả đúng ${docTien(soTien)}`); }}
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-b from-sky-400 to-blue-600 text-lg text-white shadow-[0_4px_0_#1e40af] transition active:translate-y-1 active:shadow-none"
                      aria-label="Nghe đọc câu hỏi">
                🔊
              </button>
              Trả đúng <span className="text-teal-700">{vietTien(soTien)}</span>
            </p>

            {/* Ví tiền — bấm để lấy tờ ra trả */}
            <p className="mt-4 text-xs font-black uppercase tracking-wide text-slate-400">Ví của bé — bấm để lấy tờ</p>
            <div className="mt-2 flex flex-wrap gap-2.5">
              {toTheoLop(lop).map((t) => (
                <ToTienHinh key={t.gia} gia={t.gia} co="nho"
                            onBam={ketQua ? undefined : () => setGioTo((g) => [...g, t.gia])} />
              ))}
            </div>

            {/* Đã đưa ra */}
            <p className="mt-4 text-xs font-black uppercase tracking-wide text-slate-400">Bé đã đưa</p>
            <div className="mt-2 flex min-h-[96px] flex-wrap items-center gap-2.5 rounded-2xl border-2 border-dashed border-teal-200 bg-white/70 p-3">
              {gioTo.length === 0 && <span className="px-2 text-sm text-slate-400">Chưa có tờ nào</span>}
              {gioTo.map((g, i) => (
                <ToTienHinh key={`${g}-${i}`} gia={g} co="nho"
                            onBam={ketQua ? undefined : () => setGioTo((ds) => ds.filter((_, j) => j !== i))} />
              ))}
            </div>
            <p className="mt-2 text-sm font-bold text-slate-600">
              Đang đưa: <b className={daTra === soTien ? 'text-emerald-600' : 'text-slate-900'}>{vietTien(daTra)}</b>
              {daTra > 0 && daTra !== soTien && (
                <span className="ml-2 text-slate-500">
                  ({daTra < soTien ? `còn thiếu ${vietTien(soTien - daTra)}` : `thừa ${vietTien(daTra - soTien)}`})
                </span>
              )}
            </p>
            <button onClick={() => cham(daTra === soTien, `Cần đưa ${docTien(soTien)}`)}
                    disabled={!!ketQua || gioTo.length === 0}
                    className="mt-3 rounded-2xl bg-gradient-to-b from-teal-400 to-teal-600 px-8 py-3.5 text-base font-black text-white shadow-[0_5px_0_#0f766e] transition active:translate-y-1 active:shadow-[0_1px_0_#0f766e] disabled:opacity-50">
              Kiểm tra
            </button>
          </div>
        )}

        {/* 🧾 TIỀN THỐI */}
        {dang === 'thoi-tien' && (
          <div>
            <p className="flex items-start gap-3 text-base leading-7 text-slate-800 sm:text-lg">
              <button onClick={() => {
                        unlockAudio(); stopSpeaking();
                        speakText(`Bé mua ${mua.mon.map((m) => m.ten).join(' và ')} hết ${docTien(mua.phaiTra)}. Bé đưa ${docTien(mua.dua)}. Cô bán hàng trả lại bao nhiêu?`);
                      }}
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-b from-sky-400 to-blue-600 text-lg text-white shadow-[0_4px_0_#1e40af] transition active:translate-y-1 active:shadow-none"
                      aria-label="Nghe đọc đề bài">
                🔊
              </button>
              <span>
                Bé mua {mua.mon.map((m, i) => (
                  <span key={i}>{i > 0 && ' và '}{m.emoji} <b>{m.ten}</b> ({vietTien(m.gia)})</span>
                ))}, hết tất cả <b className="text-teal-700">{vietTien(mua.phaiTra)}</b>.
                Bé đưa <b>{vietTien(mua.dua)}</b>. <b className="text-teal-700">Cô bán hàng trả lại bao nhiêu?</b>
              </span>
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl bg-white/70 p-3">
              <span className="text-sm font-black text-slate-500">Bé đưa:</span>
              {traTien(mua.dua, lop).map((g, i) => <ToTienHinh key={i} gia={g} co="nho" />)}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {chonDs.map((n) => {
                const laDung = n === mua.thoi;
                let k = 'border-slate-200 bg-white text-slate-800';
                if (ketQua) {
                  if (laDung) k = 'border-emerald-400 bg-emerald-50 text-emerald-700';
                  else if (daBam === n) k = 'border-rose-300 bg-rose-50 text-rose-600';
                  else k = 'border-slate-100 bg-slate-50 text-slate-400';
                }
                return (
                  <button key={n} disabled={!!ketQua}
                          onClick={() => { setDaBam(n); cham(laDung, `${mua.dua.toLocaleString('vi-VN')} trừ ${mua.phaiTra.toLocaleString('vi-VN')} bằng ${mua.thoi.toLocaleString('vi-VN')}`); }}
                          className={`rounded-2xl border-2 py-4 text-base font-black shadow-[0_4px_0_rgba(15,23,42,.08)] transition active:translate-y-1 active:shadow-none disabled:active:translate-y-0 ${k}`}>
                    {vietTien(n)}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Chấm bài */}
        {ketQua && (
          <div className={`mt-5 rounded-2xl border-2 p-4 ${ketQua === 'dung' ? 'toan-an-mung border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}>
            <p className="font-black text-slate-900">{ketQua === 'dung' ? '🎉 Đúng rồi!' : '💡 Chưa đúng'}</p>
            <p className="mt-1 text-sm leading-6 text-slate-700">{giaiThich(dang, to, soTien, mua, lop)}</p>
            <button onClick={raDe} className="mt-3 rounded-full bg-slate-900 px-6 py-2.5 text-sm font-black text-white shadow-[0_4px_0_#0f172a55] transition active:translate-y-1 active:shadow-none">
              Bài tiếp →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function giaiThich(dang: Dang, to: number, soTien: number, mua: BaiMua, lop: MucDo): string {
  if (dang === 'nhan-biet') {
    return `Tờ này ghi ${to.toLocaleString('vi-VN')} nên đọc là ${docTien(to)}. Nhìn con số in to ở giữa tờ tiền là biết mệnh giá.`;
  }
  if (dang === 'tra-tien') {
    const cach = traTien(soTien, lop);
    return `Cách trả ít tờ nhất cho ${vietTien(soTien)} là: ${cach.map((g) => g.toLocaleString('vi-VN')).join(' + ')}. Bé có thể trả cách khác, miễn cộng lại đúng bằng số tiền.`;
  }
  return `Tiền trả lại = tiền đưa − tiền phải trả: ${mua.dua.toLocaleString('vi-VN')} − ${mua.phaiTra.toLocaleString('vi-VN')} = ${mua.thoi.toLocaleString('vi-VN')} đồng.`;
}
