'use client';

import { useCallback, useEffect, useState } from 'react';
import BangDatTinh from './BangDatTinh';
import BangChiaDoc from './BangChiaDoc';
import { MUC_DO, nhacCot, raPhep, type Dau, type MucDo, type PhepDat } from '../lib/datTinh';
import { nhacBuoc, raPhepChia, type MucDo as MucDoChia, type PhepChia } from '../lib/datTinhChia';
import { speakText, stopSpeaking, unlockAudio } from '../components/edu/utils/speech';
import PhaoAnMung from '../components/edu/PhaoAnMung';

// Bé điền từng chữ số bằng BÀN PHÍM SỐ trên màn hình (không dùng ô nhập của
// trình duyệt): bàn phím máy tính bảng hay che mất bảng tính, mà trẻ cũng gõ
// nhầm sang chữ. Điền xong một ô thì tự nhảy sang ô bên trái, đúng chiều làm
// bài trên giấy.

const KHOA_LUU = 'bhh_dat_tinh';

/** Phép mở màn CỐ ĐỊNH — state khởi tạo mà random thì máy chủ và trình duyệt
 *  dựng hai đề khác nhau, React báo lệch HTML ngay khi vào trang. */
const PHEP_MO_MAN: PhepDat = {
  dau: '+', a: 47, b: 25, kq: 72, chuSoKq: [2, 7], nho: [1, 0], soCot: 2,
};

export default function DatTinhClient() {
  const [lop, setLop] = useState<MucDo>(2);
  // ':' là phép chia — đi bảng riêng nên không nằm trong kiểu Dau.
  const [locDau, setLocDau] = useState<Dau | 'all' | ':'>('all');
  const [phep, setPhep] = useState<PhepDat>(PHEP_MO_MAN);
  const [dien, setDien] = useState<(number | null)[]>([]);
  const [nhoDien, setNhoDien] = useState<(number | null)[]>([]);
  const [o, setO] = useState(0);
  const [oNho, setONho] = useState<number | null>(null);
  const [daCham, setDaCham] = useState(false);

  // Phép chia đi một đường riêng: bảng khác, cách điền khác (mỗi bước hai ô:
  // chữ số thương và số dư), nên không nhét chung state với ba phép kia.
  const [chia, setChia] = useState<PhepChia | null>(null);
  const [dienChia, setDienChia] = useState<{ thuong: number | null; du: number | null }[]>([]);
  const [oChia, setOChia] = useState<{ buoc: number; loai: 'thuong' | 'du' }>({ buoc: 0, loai: 'thuong' });
  const [diem, setDiem] = useState(0);
  const [tong, setTong] = useState(0);

  const raDe = useCallback(() => {
    if (locDau === ':') {
      const pc = raPhepChia(Math.max(3, lop) as MucDoChia);
      setChia(pc);
      setDienChia(pc.buoc.map(() => ({ thuong: null, du: null })));
      setOChia({ buoc: 0, loai: 'thuong' });
      setDaCham(false);
      return null;
    }
    setChia(null);
    const p = raPhep(lop, locDau === 'all' ? undefined : locDau);
    setPhep(p);
    setDien(Array(p.soCot).fill(null));
    setNhoDien(Array(p.soCot).fill(null));
    setO(0);
    setONho(null);
    setDaCham(false);
    return p;
  }, [lop, locDau]);

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
    // Lớp 1, 2 chưa học nhân chia đặt cột dọc.
    if (l <= 2) setLocDau((d) => (d === '×' || d === ':' ? 'all' : d));
    try { localStorage.setItem(KHOA_LUU, String(l)); } catch { /* bỏ qua */ }
  }

  function bamSo(n: number) {
    if (daCham) return;
    if (chia) {
      setDienChia((ds) => ds.map((x, i) => (i === oChia.buoc ? { ...x, [oChia.loai]: n } : x)));
      // Điền xong thương thì nhảy sang ô dư của cùng bước; điền xong dư thì
      // sang bước kế — đúng thứ tự làm trên giấy.
      if (oChia.loai === 'thuong') setOChia({ ...oChia, loai: 'du' });
      else if (oChia.buoc < chia.buoc.length - 1) setOChia({ buoc: oChia.buoc + 1, loai: 'thuong' });
      return;
    }
    if (oNho !== null) {
      setNhoDien((ds) => ds.map((x, i) => (i === oNho ? n : x)));
      setONho(null);
      return;
    }
    setDien((ds) => ds.map((x, i) => (i === o ? n : x)));
    // Tự nhảy sang cột bên TRÁI (hàng cao hơn) — đúng chiều làm trên giấy.
    if (o < phep.soCot - 1) setO(o + 1);
  }

  function xoa() {
    if (daCham) return;
    if (chia) {
      setDienChia((ds) => ds.map((x, i) => (i === oChia.buoc ? { ...x, [oChia.loai]: null } : x)));
      return;
    }
    if (oNho !== null) { setNhoDien((ds) => ds.map((x, i) => (i === oNho ? null : x))); return; }
    setDien((ds) => ds.map((x, i) => (i === o ? null : x)));
  }

  function cham() {
    if (chia) {
      if (daCham || dienChia.some((x) => x.thuong === null || x.du === null)) return;
      setDaCham(true);
      const ok = chia.buoc.every((b, i) => dienChia[i].thuong === b.chuSoThuong && dienChia[i].du === b.du);
      setTong((t) => t + 1);
      if (ok) setDiem((d) => d + 1);
      unlockAudio();
      stopSpeaking();
      speakText(ok
        ? `Đúng rồi. ${chia.a} chia ${chia.b} bằng ${chia.thuong}${chia.du ? ` dư ${chia.du}` : ''}`
        : `Chưa đúng. Kết quả là ${chia.thuong}${chia.du ? ` dư ${chia.du}` : ''}`);
      return;
    }
    if (daCham || dien.some((x) => x === null)) return;
    setDaCham(true);
    const ok = dien.every((x, i) => x === phep.chuSoKq[i]);
    setTong((t) => t + 1);
    if (ok) setDiem((d) => d + 1);
    unlockAudio();
    stopSpeaking();
    speakText(ok ? `Đúng rồi. ${phep.a} ${phep.dau} ${phep.b} = ${phep.kq}` : `Chưa đúng. Kết quả đúng là ${phep.kq}`);
  }

  // Gõ bằng BÀN PHÍM THẬT trên máy tính: số để điền, Backspace xoá, Enter
  // chấm, mũi tên trái/phải đổi cột. Trẻ dùng máy tính bảng thì bấm bàn phím
  // trên màn hình, còn dùng máy tính thì gõ nhanh hơn nhiều.
  useEffect(() => {
    const go = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (/^[0-9]$/.test(e.key)) { e.preventDefault(); bamSo(Number(e.key)); return; }
      if (e.key === 'Backspace' || e.key === 'Delete') { e.preventDefault(); xoa(); return; }
      if (e.key === 'Enter') {
        e.preventDefault();
        if (daCham) raDe(); else cham();
        return;
      }
      if (e.key === 'ArrowLeft') { e.preventDefault(); setO((i) => Math.min(phep.soCot - 1, i + 1)); setONho(null); }
      if (e.key === 'ArrowRight') { e.preventDefault(); setO((i) => Math.max(0, i - 1)); setONho(null); }
    };
    window.addEventListener('keydown', go);
    return () => window.removeEventListener('keydown', go);
  });

  const cotSai = daCham ? dien.map((x, i) => (x === phep.chuSoKq[i] ? -1 : i)).filter((i) => i >= 0) : [];
  const dungHet = daCham && cotSai.length === 0;

  return (
    <div className="mt-6">
      {/* Lớp + phép tính */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-black text-slate-500">Bé học lớp</span>
        {MUC_DO.map((m) => (
          <button key={m.lop} onClick={() => doiLop(m.lop)} title={m.moTa}
                  className={`h-11 w-11 rounded-2xl border-2 text-lg font-black transition active:translate-y-0.5 ${
                    lop === m.lop
                      ? 'border-violet-700 bg-gradient-to-b from-violet-400 to-violet-600 text-white shadow-[0_4px_0_#5b21b6]'
                      : 'border-slate-200 bg-white text-slate-600 shadow-[0_3px_0_#e2e8f0]'}`}>
            {m.lop}
          </button>
        ))}
        <span key={diem} className="toan-sao-nay ml-auto rounded-full bg-gradient-to-b from-amber-200 to-amber-300 px-3.5 py-1.5 text-sm font-black text-amber-800 shadow-[0_3px_0_#fbbf24]">⭐ {diem}/{tong}</span>
      </div>
      <p className="mt-1.5 text-xs text-slate-500">{MUC_DO.find((m) => m.lop === lop)!.moTa}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {(['all', '+', '−', ...(lop >= 3 ? (['×', ':'] as (Dau | ':')[]) : [])] as (Dau | 'all' | ':')[]).map((d) => (
          <button key={d} onClick={() => setLocDau(d)}
                  className={`rounded-full border-2 px-4 py-1.5 text-sm font-black ${
                    locDau === d ? 'border-violet-600 bg-violet-600 text-white' : 'border-violet-200 bg-violet-50 text-violet-700'}`}>
            {d === 'all' ? 'Cộng, trừ, nhân' : d === ':' ? ': (chia)' : d}
          </button>
        ))}
      </div>

      {/* Bảng và bàn phím nằm CẠNH NHAU trong một khung, cùng lọt một màn hình
          — trước đó bàn phím rơi xuống dưới, bé phải cuộn qua lại mỗi lần điền. */}
      <div className="toan-nen relative mt-4 flex flex-wrap items-start justify-center gap-4 rounded-3xl border-2 border-violet-100 bg-gradient-to-br from-violet-50 to-fuchsia-50/60 p-4 sm:gap-6 sm:p-5">
        {dungHet && <PhaoAnMung khoa={`${phep.a}${phep.dau}${phep.b}`} />}
        <div className="flex flex-col items-center">
          <p className="mb-2 flex items-center gap-2 text-sm font-black text-slate-600">
            <button
              onClick={() => {
                unlockAudio(); stopSpeaking();
                speakText(chia ? `Đặt tính rồi tính. ${chia.a} chia ${chia.b}` : `Đặt tính rồi tính. ${phep.a} ${phep.dau} ${phep.b}`);
              }}
              className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-b from-sky-400 to-blue-600 text-white shadow-[0_3px_0_#1e40af] transition active:translate-y-0.5 active:shadow-none"
              aria-label="Nghe đọc đề bài"
            >
              🔊
            </button>
            Đặt tính rồi tính: {chia ? `${chia.a} : ${chia.b}` : `${phep.a} ${phep.dau} ${phep.b}`}
          </p>
          {chia ? (
            <>
              <BangChiaDoc
                phep={chia} dien={dienChia} oDang={oChia}
                onChonO={(buoc, loai) => setOChia({ buoc, loai })}
                daCham={daCham}
              />
              <p className="mt-2 max-w-[320px] text-center text-xs leading-5 text-slate-500">
                Mỗi bước làm bốn việc: <b>ước lượng</b> chữ số thương → máy <b>nhân</b> giúp →
                bé điền <b>số dư</b> → <b>hạ</b> chữ số tiếp theo.
              </p>
            </>
          ) : (
            <>
              <BangDatTinh
                phep={phep} dien={dien} nhoDien={nhoDien} oDangChon={o} oNho={oNho}
                onChonO={(i) => { setO(i); setONho(null); }}
                onChonNho={(i) => setONho(oNho === i ? null : i)}
                daCham={daCham}
              />
              <p className="mt-2 max-w-[280px] text-center text-xs leading-5 text-slate-500">
                Điền từ <b>hàng đơn vị</b> (ô bên phải) sang trái. Hàng ô gạch nét đứt ở trên để <b>ghi số nhớ</b> nếu cần.
              </p>
            </>
          )}
        </div>

        {/* Bàn phím số */}
        <div className="flex flex-col items-center">
          <div className="grid w-[228px] grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <button key={n} onClick={() => bamSo(n)} disabled={daCham}
                      className="h-[68px] rounded-2xl border-2 border-slate-200 bg-white text-2xl font-black text-slate-800 shadow-[0_4px_0_#e2e8f0] transition active:translate-y-1 active:shadow-none disabled:opacity-50">
                {n}
              </button>
            ))}
            <button onClick={xoa} disabled={daCham}
                    className="h-[68px] rounded-2xl border-2 border-rose-200 bg-rose-50 text-lg font-black text-rose-600 shadow-[0_4px_0_#fecdd3] transition active:translate-y-1 active:shadow-none disabled:opacity-50">
              ⌫
            </button>
            <button onClick={() => bamSo(0)} disabled={daCham}
                    className="h-[68px] rounded-2xl border-2 border-slate-200 bg-white text-2xl font-black text-slate-800 shadow-[0_4px_0_#e2e8f0] transition active:translate-y-1 active:shadow-none disabled:opacity-50">
              0
            </button>
            <button onClick={cham}
                    disabled={daCham || (chia
                      ? dienChia.some((x) => x.thuong === null || x.du === null)
                      : dien.some((x) => x === null))}
                    className="h-[68px] rounded-2xl bg-gradient-to-b from-emerald-400 to-emerald-600 text-base font-black text-white shadow-[0_4px_0_#047857] transition active:translate-y-1 active:shadow-none disabled:opacity-40">
              ✓
            </button>
          </div>

          <p className="mt-2 hidden text-center text-[11px] leading-4 text-slate-400 sm:block">
            Gõ số trên bàn phím cũng được · Enter để chấm · ⌫ xoá
          </p>

          {/* Chấm bài phép CHIA — chỉ ra sai ở bước nào, việc nào */}
          {daCham && chia && (() => {
            const sai = chia.buoc.flatMap((b, i) => [
              ...(dienChia[i].thuong !== b.chuSoThuong ? [{ i, viec: 'thuong' as const }] : []),
              ...(dienChia[i].du !== b.du ? [{ i, viec: 'du' as const }] : []),
            ]);
            return (
              <div className={`mt-4 rounded-2xl border-2 p-4 ${sai.length === 0 ? 'toan-an-mung border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}>
                <p className="font-black text-slate-900">
                  {sai.length === 0 ? '🎉 Đúng hết!' : `💡 Sai ${sai.length} chỗ`} — {chia.a} : {chia.b} = {chia.thuong}
                  {chia.du > 0 && <> dư {chia.du}</>}
                </p>
                {sai.length > 0 && (
                  <ul className="mt-2 space-y-1.5 text-sm leading-6 text-slate-700">
                    {sai.map((x, k) => <li key={k}>• {nhacBuoc(chia, x.i, x.viec)}</li>)}
                  </ul>
                )}
                {sai.length === 0 && (
                  <p className="mt-1 text-sm leading-6 text-slate-700">
                    Thử lại cho chắc: {chia.thuong} × {chia.b}{chia.du > 0 ? ` + ${chia.du}` : ''} = {chia.a}.
                  </p>
                )}
                <button onClick={() => { raDe(); }} className="mt-3 rounded-full bg-slate-900 px-6 py-2.5 text-sm font-black text-white shadow-[0_4px_0_#0f172a55] transition active:translate-y-1 active:shadow-none">
                  Bài tiếp →
                </button>
              </div>
            );
          })()}

          {/* Chấm bài: chỉ đúng cột sai và nói vì sao */}
          {daCham && !chia && (
            <div className={`mt-4 rounded-2xl border-2 p-4 ${dungHet ? 'toan-an-mung border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}>
              <p className="font-black text-slate-900">
                {dungHet ? '🎉 Đúng hết!' : `💡 Sai ${cotSai.length} cột`} — {phep.a} {phep.dau} {phep.b} = {phep.kq}
              </p>
              {!dungHet && (
                <ul className="mt-2 space-y-1.5 text-sm leading-6 text-slate-700">
                  {cotSai.map((c) => (
                    <li key={c}>• {nhacCot(phep, c, dien[c] ?? 0)}</li>
                  ))}
                </ul>
              )}
              {dungHet && phep.nho.some((n) => n > 0) && (
                <p className="mt-1 text-sm leading-6 text-slate-700">
                  Bài này có <b>{phep.nho.filter((n) => n > 0).length} lần nhớ</b> — bé làm đúng hết là rất giỏi.
                </p>
              )}
              <button onClick={() => {
                        // raDe trả về null khi đang ở phép chia (bảng riêng);
                        // nhánh này chỉ chạy với cộng/trừ/nhân nên vẫn kiểm cho chắc.
                        const moi = raDe();
                        unlockAudio(); stopSpeaking();
                        if (moi) speakText(`${moi.a} ${moi.dau} ${moi.b}`);
                      }}
                      className="mt-3 rounded-full bg-slate-900 px-6 py-2.5 text-sm font-black text-white shadow-[0_4px_0_#0f172a55] transition active:translate-y-1 active:shadow-none">
                Bài tiếp →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
