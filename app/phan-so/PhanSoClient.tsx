'use client';

import { useCallback, useEffect, useState } from 'react';
import HinhPhanSo, { ChuPhanSo } from './HinhPhanSo';
import {
  MUC_DO, bangNhau, dapAnNhieu, docPhanSo, giaTri, raCapSoSanh, raPhanSo, raPhepTinh,
  rutGon, toiGian, type MucDo, type PhanSo,
} from '../lib/phanSo';
import { speakText, stopSpeaking, unlockAudio } from '../components/edu/utils/speech';
import PhaoAnMung from '../components/edu/PhaoAnMung';

// Bốn dạng bài, mỗi dạng gắn với một việc bé thật sự phải làm:
//   🎨 Tô màu  — cho phân số, bé bấm tô đúng số phần. Hiểu bằng tay.
//   👀 Đọc     — nhìn hình, chọn phân số. Ngược chiều dạng 1.
//   ⚖️ So sánh — hai hình cạnh nhau, chọn lớn hơn / bé hơn / bằng nhau.
//   ➕ Tính    — cộng trừ cùng mẫu, có hình minh hoạ kết quả (lớp 5).

type Dang = 'to' | 'doc' | 'sosanh' | 'tinh';
const KHOA_LUU = 'bhh_phan_so';

const DANG: { id: Dang; ten: string; emoji: string; tuLop: MucDo }[] = [
  { id: 'to', ten: 'Tô màu', emoji: '🎨', tuLop: 2 },
  { id: 'doc', ten: 'Đọc phân số', emoji: '👀', tuLop: 2 },
  { id: 'sosanh', ten: 'So sánh', emoji: '⚖️', tuLop: 3 },
  { id: 'tinh', ten: 'Cộng trừ', emoji: '➕', tuLop: 5 },
];

const xao = <T,>(ds: T[]) => {
  const a = [...ds];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};

export default function PhanSoClient() {
  const [lop, setLop] = useState<MucDo>(3);
  const [dang, setDang] = useState<Dang>('to');
  const [kieu, setKieu] = useState<'tron' | 'thanh'>('tron');

  const [de, setDe] = useState<PhanSo>({ tu: 1, mau: 4 });
  const [cap, setCap] = useState<[PhanSo, PhanSo]>([{ tu: 1, mau: 2 }, { tu: 1, mau: 3 }]);
  const [tinh, setTinh] = useState<{ a: PhanSo; b: PhanSo; dau: '+' | '−'; kq: PhanSo }>(
    () => ({ a: { tu: 1, mau: 4 }, b: { tu: 2, mau: 4 }, dau: '+', kq: { tu: 3, mau: 4 } }),
  );
  const [chonDs, setChonDs] = useState<PhanSo[]>([]);
  const [toDs, setToDs] = useState<number[]>([]);
  const [ketQua, setKetQua] = useState<'dung' | 'sai' | null>(null);
  const [daBam, setDaBam] = useState<string | null>(null);
  const [diem, setDiem] = useState(0);
  const [tong, setTong] = useState(0);

  const raDe = useCallback(() => {
    setKetQua(null);
    setDaBam(null);
    setToDs([]);
    if (dang === 'sosanh') { setCap(raCapSoSanh(lop)); return; }
    if (dang === 'tinh') { setTinh(raPhepTinh(lop)); return; }
    const p = raPhanSo(lop);
    setDe(p);
    if (dang === 'doc') setChonDs(xao([p, ...dapAnNhieu(p, lop)]));
  }, [lop, dang]);

  // Đặt state thẳng trong useEffect: bọc rAF/microtask thì nó có thể chạy
  // trước khi React hydrate xong, làm HTML hai bên lệch nhau.
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
    // Dạng bài chưa học tới lớp này thì lùi về dạng đầu, khỏi ra đề quá sức.
    const d = DANG.find((x) => x.id === dang);
    if (d && l < d.tuLop) setDang('to');
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

  return (
    <div className="mt-6">
      {/* Chọn lớp + điểm */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-black text-slate-500">Bé học lớp</span>
        {MUC_DO.map((m) => (
          <button key={m.lop} onClick={() => doiLop(m.lop)} title={m.moTa}
                  className={`h-11 w-11 rounded-2xl border-2 text-lg font-black transition active:translate-y-0.5 ${
                    lop === m.lop
                      ? 'border-orange-600 bg-gradient-to-b from-orange-400 to-orange-600 text-white shadow-[0_4px_0_#c2410c]'
                      : 'border-slate-200 bg-white text-slate-600 shadow-[0_3px_0_#e2e8f0]'}`}>
            {m.lop}
          </button>
        ))}
        <button onClick={() => setKieu(kieu === 'tron' ? 'thanh' : 'tron')}
                className="rounded-full border-2 border-slate-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-600">
          {kieu === 'tron' ? '🍕 Bánh tròn' : '🍫 Thanh dài'}
        </button>
        <span key={diem} className="toan-sao-nay ml-auto rounded-full bg-gradient-to-b from-amber-200 to-amber-300 px-3.5 py-1.5 text-sm font-black text-amber-800 shadow-[0_3px_0_#fbbf24]">⭐ {diem}/{tong}</span>
      </div>
      <p className="mt-1.5 text-xs text-slate-500">{MUC_DO.find((m) => m.lop === lop)!.moTa}</p>

      {/* Chọn dạng bài */}
      <div className="mt-4 flex gap-2 rounded-full bg-slate-100 p-1">
        {dangCo.map((d) => (
          <button key={d.id} onClick={() => { stopSpeaking(); setDang(d.id); }}
                  className={`flex-1 rounded-full px-2 py-2 text-xs font-black transition sm:text-sm ${
                    dang === d.id ? 'bg-white text-slate-900 shadow' : 'text-slate-500'}`}>
            {d.emoji} {d.ten}
          </button>
        ))}
      </div>

      <div className="toan-nen relative mt-5 rounded-3xl border-2 border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50/60 p-4 sm:p-6">
        {ketQua === 'dung' && <PhaoAnMung khoa={`${de.tu}/${de.mau}-${tong}`} />}
        {/* 🎨 TÔ MÀU */}
        {dang === 'to' && (
          <div className="flex flex-col items-center">
            <p className="flex items-center justify-center gap-3 text-center text-lg font-black text-slate-900">
              <button
                onClick={() => { unlockAudio(); stopSpeaking(); speakText(`Tô màu ${docPhanSo(de)} của hình`); }}
                className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-b from-sky-400 to-blue-600 text-lg text-white shadow-[0_4px_0_#1e40af] transition active:translate-y-1 active:shadow-none"
                aria-label="Nghe đọc đề bài"
              >
                🔊
              </button>
              Tô màu <ChuPhanSo p={de} /> của hình
            </p>
            <p className="mt-1 text-sm text-slate-500">Bấm vào từng phần để tô — đọc là “{docPhanSo(de)}”</p>
            <div className="mt-4">
              <HinhPhanSo
                phanSo={de} kieu={kieu} toDs={toDs} bamDuoc={!ketQua}
                onBam={(i) => setToDs((t) => (t.includes(i) ? t.filter((x) => x !== i) : [...t, i]))}
              />
            </div>
            <p className="mt-2 text-sm font-bold text-slate-600">Đã tô {toDs.length}/{de.mau} phần</p>
            <button
              onClick={() => cham(toDs.length === de.tu, `${docPhanSo(de)} là tô ${de.tu} trên ${de.mau} phần`)}
              disabled={!!ketQua}
              className="mt-3 rounded-2xl bg-gradient-to-b from-orange-400 to-orange-600 px-8 py-3.5 text-base font-black text-white shadow-[0_5px_0_#c2410c] transition active:translate-y-1 active:shadow-[0_1px_0_#c2410c] disabled:opacity-50">
              Kiểm tra
            </button>
          </div>
        )}

        {/* 👀 ĐỌC PHÂN SỐ */}
        {dang === 'doc' && (
          <div className="flex flex-col items-center">
            <p className="flex items-center gap-3 text-lg font-black text-slate-900">
              <button
                onClick={() => { unlockAudio(); stopSpeaking(); speakText('Hình này là phân số nào?'); }}
                className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-b from-sky-400 to-blue-600 text-lg text-white shadow-[0_4px_0_#1e40af] transition active:translate-y-1 active:shadow-none"
                aria-label="Nghe đọc đề bài"
              >
                🔊
              </button>
              Hình này là phân số nào?
            </p>
            <div className="mt-4"><HinhPhanSo phanSo={de} kieu={kieu} /></div>
            <div className="mt-4 grid w-full max-w-md grid-cols-2 gap-2.5 sm:grid-cols-4">
              {chonDs.map((c) => {
                const laDung = bangNhau(c, de);
                const bam = daBam === `${c.tu}/${c.mau}`;
                let kieuNut = 'border-slate-200 bg-white text-slate-800';
                if (ketQua) {
                  if (laDung) kieuNut = 'border-emerald-400 bg-emerald-50 text-emerald-700';
                  else if (bam) kieuNut = 'border-rose-300 bg-rose-50 text-rose-600';
                  else kieuNut = 'border-slate-100 bg-slate-50 text-slate-400';
                }
                return (
                  <button key={`${c.tu}/${c.mau}`} disabled={!!ketQua}
                          onClick={() => { setDaBam(`${c.tu}/${c.mau}`); cham(laDung, `${docPhanSo(de)}`); }}
                          className={`grid place-items-center rounded-2xl border-2 py-5 shadow-[0_4px_0_rgba(15,23,42,.08)] transition active:translate-y-1 active:shadow-none disabled:active:translate-y-0 ${kieuNut}`}>
                    <ChuPhanSo p={c} />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ⚖️ SO SÁNH */}
        {dang === 'sosanh' && (
          <div className="flex flex-col items-center">
            <p className="text-lg font-black text-slate-900">Phân số nào lớn hơn?</p>
            <div className="mt-4 flex w-full items-center justify-center gap-4 sm:gap-8">
              {cap.map((p, i) => (
                <div key={i} className="flex flex-col items-center">
                  <HinhPhanSo phanSo={p} kieu={kieu} cao={150} mau={i === 0 ? '#f97316' : '#8b5cf6'} />
                  <span className={i === 0 ? 'mt-2 text-orange-600' : 'mt-2 text-violet-600'}><ChuPhanSo p={p} /></span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2.5">
              {([['>', 'Bên trái lớn hơn'], ['=', 'Bằng nhau'], ['<', 'Bên phải lớn hơn']] as const).map(([d, ten]) => {
                const dung = giaTri(cap[0]) > giaTri(cap[1]) ? '>' : giaTri(cap[0]) < giaTri(cap[1]) ? '<' : '=';
                const laDung = d === dung;
                const bam = daBam === d;
                let k = 'border-slate-200 bg-white text-slate-800';
                if (ketQua) {
                  if (laDung) k = 'border-emerald-400 bg-emerald-50 text-emerald-700';
                  else if (bam) k = 'border-rose-300 bg-rose-50 text-rose-600';
                  else k = 'border-slate-100 bg-slate-50 text-slate-400';
                }
                return (
                  <button key={d} disabled={!!ketQua} title={ten}
                          onClick={() => { setDaBam(d); cham(laDung, giaiThichSoSanh(cap)); }}
                          className={`rounded-2xl border-2 px-8 py-5 text-3xl font-black shadow-[0_4px_0_rgba(15,23,42,.08)] transition active:translate-y-1 active:shadow-none disabled:active:translate-y-0 ${k}`}>
                    {d}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ➕ CỘNG TRỪ */}
        {dang === 'tinh' && (
          <div className="flex flex-col items-center">
            <p className="flex items-center gap-3 text-lg font-black text-slate-900">
              <ChuPhanSo p={tinh.a} /> <span className="text-2xl">{tinh.dau}</span> <ChuPhanSo p={tinh.b} />
              <span className="text-2xl">=</span> <span className="text-2xl">?</span>
            </p>
            <div className="mt-3 flex items-center gap-3">
              <HinhPhanSo phanSo={tinh.a} kieu="thanh" cao={110} />
              <span className="text-xl font-black text-slate-500">{tinh.dau}</span>
              <HinhPhanSo phanSo={tinh.b} kieu="thanh" cao={110} mau="#8b5cf6" />
            </div>
            <div className="mt-4 grid w-full max-w-md grid-cols-2 gap-2.5 sm:grid-cols-4">
              {xaoCoDinh(tinh.kq, lop).map((c) => {
                const laDung = bangNhau(c, tinh.kq);
                const bam = daBam === `${c.tu}/${c.mau}`;
                let k = 'border-slate-200 bg-white text-slate-800';
                if (ketQua) {
                  if (laDung) k = 'border-emerald-400 bg-emerald-50 text-emerald-700';
                  else if (bam) k = 'border-rose-300 bg-rose-50 text-rose-600';
                  else k = 'border-slate-100 bg-slate-50 text-slate-400';
                }
                return (
                  <button key={`${c.tu}/${c.mau}`} disabled={!!ketQua}
                          onClick={() => { setDaBam(`${c.tu}/${c.mau}`); cham(laDung, giaiThichTinh(tinh)); }}
                          className={`grid place-items-center rounded-2xl border-2 py-4 transition ${k}`}>
                    <ChuPhanSo p={c} />
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
            <p className="mt-1 text-sm leading-6 text-slate-700">
              {dang === 'sosanh' ? giaiThichSoSanh(cap)
                : dang === 'tinh' ? giaiThichTinh(tinh)
                : giaiThichPhanSo(de)}
            </p>
            <button onClick={raDe} className="mt-3 rounded-full bg-slate-900 px-5 py-2 text-sm font-black text-white">
              Câu tiếp →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/** Bốn đáp án cho dạng cộng trừ: kết quả đúng + ba lỗi hay gặp. */
function xaoCoDinh(kq: PhanSo, lop: MucDo): PhanSo[] {
  const ds = [kq, ...dapAnNhieu(kq, lop)];
  // Không xáo ngẫu nhiên mỗi lần vẽ lại — xáo trong render thì mỗi lần bấm
  // đáp án lại nhảy chỗ. Xếp cố định theo giá trị.
  return ds.sort((a, b) => a.tu / a.mau - b.tu / b.mau);
}

function giaiThichPhanSo(p: PhanSo): string {
  const g = rutGon(p);
  const them = !toiGian(p) ? ` Rút gọn lại thì ${p.tu}/${p.mau} = ${g.tu}/${g.mau}.` : '';
  return `Hình chia thành ${p.mau} phần bằng nhau, tô ${p.tu} phần, nên là ${p.tu}/${p.mau} — đọc là "${docPhanSo(p)}". Số dưới là số phần chia ra, số trên là số phần được tô.${them}`;
}

function giaiThichSoSanh([a, b]: [PhanSo, PhanSo]): string {
  if (a.mau === b.mau) {
    return `Hai phân số cùng mẫu số ${a.mau} nên chỉ cần so tử số: ${a.tu} với ${b.tu}. Vậy ${a.tu}/${a.mau} ${a.tu > b.tu ? 'lớn hơn' : 'bé hơn'} ${b.tu}/${b.mau}.`;
  }
  return `Khác mẫu số thì quy về cùng mẫu: ${a.tu}/${a.mau} = ${a.tu * b.mau}/${a.mau * b.mau} và ${b.tu}/${b.mau} = ${b.tu * a.mau}/${a.mau * b.mau}. So tử số ${a.tu * b.mau} với ${b.tu * a.mau} là ra.`;
}

function giaiThichTinh(t: { a: PhanSo; b: PhanSo; dau: '+' | '−'; kq: PhanSo }): string {
  const g = rutGon(t.kq);
  const them = !toiGian(t.kq) ? ` Rút gọn: ${t.kq.tu}/${t.kq.mau} = ${g.tu}/${g.mau}.` : '';
  return `Cùng mẫu số ${t.a.mau} thì GIỮ NGUYÊN mẫu, chỉ ${t.dau === '+' ? 'cộng' : 'trừ'} tử số: ${t.a.tu} ${t.dau} ${t.b.tu} = ${t.kq.tu}. Vậy kết quả là ${t.kq.tu}/${t.kq.mau}.${them}`;
}
