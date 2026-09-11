'use client';

import { useCallback, useEffect, useState } from 'react';
import MatDongHo from './MatDongHo';
import {
  MUC_DO, bang, cong, dapAnNhieu, doc24, docGio, khoangCach, raGio, type Gio, type MucDo,
} from '../lib/dongHo';
import { speakText, stopSpeaking, unlockAudio } from '../components/edu/utils/speech';
import PhaoAnMung from '../components/edu/PhaoAnMung';

// Ba dạng bài, đi từ dễ đến khó đúng cách trẻ học xem giờ:
//   1. ĐỌC GIỜ   — nhìn kim, chọn giờ. Bé làm quen mặt đồng hồ.
//   2. CHỈNH KIM — cho giờ bằng chữ, bé tự quay kim. Khó hơn hẳn dạng 1 vì
//      phải tự đặt cả hai kim, không đoán mò được.
//   3. TÍNH GIỜ  — "bây giờ 3 giờ, 20 phút nữa là mấy giờ?". Đây là dạng ra
//      trong đề thi mà trẻ hay tắc.

type Dang = 'doc' | 'chinh' | 'tinh';
const KHOA_LUU = 'bhh_dong_ho';

const DANG: { id: Dang; ten: string; emoji: string; moTa: string }[] = [
  { id: 'doc', ten: 'Đọc giờ', emoji: '👀', moTa: 'Nhìn kim rồi chọn giờ đúng' },
  { id: 'chinh', ten: 'Chỉnh kim', emoji: '🤏', moTa: 'Kéo kim cho đúng giờ đề bài' },
  { id: 'tinh', ten: 'Tính giờ', emoji: '🧮', moTa: 'Thêm hoặc bớt mấy phút thì mấy giờ' },
];

const xao = <T,>(ds: T[]) => {
  const a = [...ds];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};

export default function XemDongHoClient() {
  const [lop, setLop] = useState<MucDo>(2);
  const [dang, setDang] = useState<Dang>('doc');

  const [de, setDe] = useState<Gio>({ gio: 3, phut: 0 });
  const [chon, setChon] = useState<Gio[]>([]);
  const [keo, setKeo] = useState<Gio>({ gio: 12, phut: 0 });
  const [themPhut, setThemPhut] = useState(15);
  const [daChon, setDaChon] = useState<Gio | null>(null);
  const [ketQua, setKetQua] = useState<'dung' | 'sai' | null>(null);
  const [diem, setDiem] = useState(0);
  const [tong, setTong] = useState(0);

  const buoc = MUC_DO.find((m) => m.lop === lop)!.buoc;

  const raDe = useCallback(() => {
    const g = raGio(lop);
    setDe(g);
    setDaChon(null);
    setKetQua(null);
    setKeo({ gio: 12, phut: 0 });
    if (dang === 'doc') setChon(xao([g, ...dapAnNhieu(g, lop)]));
    if (dang === 'tinh') {
      const nac = buoc === 60 ? 60 : Math.max(buoc, 5);
      setThemPhut(nac * (Math.floor(Math.random() * 4) + 1) * (Math.random() < 0.3 ? -1 : 1));
      setChon([]);
    }
  }, [lop, dang, buoc]);

  // Đặt state THẲNG trong useEffect, không bọc microtask/rAF nữa: hai cách kia
  // có thể chạy TRƯỚC khi React hydrate xong, làm lần vẽ đầu ở trình duyệt
  // khác HTML của máy chủ (đã đo: React báo lệch ngay trang này). useEffect thì
  // React bảo đảm chạy sau khi hydrate.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { raDe(); }, [raDe]);

  // Nhớ lớp bé đang học để lần sau vào không phải chọn lại.
  useEffect(() => {
    try {
      const l = Number(localStorage.getItem(KHOA_LUU));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (l >= 1 && l <= 5) setLop(l as MucDo);
    } catch { /* máy chặn lưu trữ thì thôi */ }
  }, []);

  function doiLop(l: MucDo) {
    setLop(l);
    try { localStorage.setItem(KHOA_LUU, String(l)); } catch { /* bỏ qua */ }
  }

  const dapAnDung: Gio = dang === 'tinh' ? cong(de, themPhut) : de;

  function nop(g: Gio) {
    if (ketQua) return;
    const ok = bang(g, dapAnDung);
    setDaChon(g);
    setKetQua(ok ? 'dung' : 'sai');
    setTong((t) => t + 1);
    if (ok) setDiem((d) => d + 1);
    unlockAudio();
    stopSpeaking();
    speakText(ok ? `Đúng rồi. ${docGio(dapAnDung)}` : `Chưa đúng. Đáp án là ${docGio(dapAnDung)}`);
  }

  return (
    <div className="mt-6">
      {/* Chọn lớp */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-black text-slate-500">Bé học lớp</span>
        {MUC_DO.map((m) => (
          <button
            key={m.lop}
            onClick={() => doiLop(m.lop)}
            title={m.moTa}
            className={`h-11 w-11 rounded-2xl border-2 text-lg font-black transition active:translate-y-0.5 ${
              lop === m.lop
                ? 'border-blue-700 bg-gradient-to-b from-sky-400 to-blue-600 text-white shadow-[0_4px_0_#1e40af]'
                : 'border-slate-200 bg-white text-slate-600 shadow-[0_3px_0_#e2e8f0]'}`}
          >
            {m.lop}
          </button>
        ))}
        <span key={diem} className="toan-sao-nay ml-auto rounded-full bg-gradient-to-b from-amber-200 to-amber-300 px-3.5 py-1.5 text-sm font-black text-amber-800 shadow-[0_3px_0_#fbbf24]">
          ⭐ {diem}/{tong}
        </span>
      </div>
      <p className="mt-1.5 text-xs text-slate-500">{MUC_DO.find((m) => m.lop === lop)!.moTa}</p>

      {/* Chọn dạng bài */}
      <div className="mt-4 flex gap-2 rounded-full bg-slate-100 p-1">
        {DANG.map((d) => (
          <button
            key={d.id}
            onClick={() => { stopSpeaking(); setDang(d.id); }}
            className={`flex-1 rounded-full px-2 py-2 text-xs font-black transition sm:text-sm ${
              dang === d.id ? 'bg-white text-slate-900 shadow' : 'text-slate-500'}`}
          >
            {d.emoji} {d.ten}
          </button>
        ))}
      </div>

      <div className="mt-5 grid items-start gap-5 sm:grid-cols-2">
        {/* Mặt đồng hồ */}
        <div className="toan-nen relative flex flex-col items-center rounded-3xl border-2 border-blue-100 bg-gradient-to-br from-sky-50 to-blue-50/60 p-4">
          {ketQua === 'dung' && <PhaoAnMung khoa={`${de.gio}:${de.phut}-${tong}`} />}
          <MatDongHo
            gio={dang === 'chinh' ? keo : de}
            keoDuoc={dang === 'chinh'}
            buoc={buoc}
            onDoi={setKeo}
            hienPhut={lop >= 2}
          />
          {dang === 'chinh' && (
            <p className="mt-2 text-center text-sm font-bold text-slate-600">
              Kéo <span className="text-red-600">kim ngắn</span> (giờ) và{' '}
              <span className="text-sky-600">kim dài</span> (phút) — đang chỉ <b>{docGio(keo)}</b>
            </p>
          )}
        </div>

        {/* Đề bài và đáp án */}
        <div>
          {dang === 'doc' && (
            <>
              <p className="flex items-center gap-3 text-lg font-black text-slate-900">
                <button
                  onClick={() => { unlockAudio(); stopSpeaking(); speakText('Đồng hồ đang chỉ mấy giờ?'); }}
                  className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-b from-sky-400 to-blue-600 text-lg text-white shadow-[0_4px_0_#1e40af] transition active:translate-y-1 active:shadow-none"
                  aria-label="Nghe đọc câu hỏi"
                >
                  🔊
                </button>
                Đồng hồ đang chỉ mấy giờ?
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                {chon.map((c, i) => {
                  const laDung = bang(c, dapAnDung);
                  const daBam = daChon && bang(c, daChon);
                  let kieu = 'border-slate-200 bg-white text-slate-800';
                  if (ketQua) {
                    if (laDung) kieu = 'border-emerald-400 bg-emerald-50 text-emerald-700';
                    else if (daBam) kieu = 'border-rose-300 bg-rose-50 text-rose-600';
                    else kieu = 'border-slate-100 bg-slate-50 text-slate-400';
                  }
                  return (
                    <button key={i} onClick={() => nop(c)} disabled={!!ketQua}
                            className={`rounded-2xl border-2 px-3 py-5 text-base font-black shadow-[0_4px_0_rgba(15,23,42,.08)] transition active:translate-y-1 active:shadow-none disabled:active:translate-y-0 ${kieu}`}>
                      {docGio(c)}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {dang === 'chinh' && (
            <>
              <p className="flex items-center gap-3 text-lg font-black text-slate-900">
                <button
                  onClick={() => { unlockAudio(); stopSpeaking(); speakText(`Quay kim cho đúng ${docGio(de)}`); }}
                  className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-b from-sky-400 to-blue-600 text-lg text-white shadow-[0_4px_0_#1e40af] transition active:translate-y-1 active:shadow-none"
                  aria-label="Nghe đọc câu hỏi"
                >
                  🔊
                </button>
                Quay kim cho đúng:
              </p>
              <p className="mt-1 text-3xl font-black text-blue-600">{docGio(de, lop >= 3 ? 'dan-da' : 'day-du')}</p>
              {lop >= 5 && <p className="mt-1 text-sm text-slate-500">Tức là {doc24(de, true)} (buổi chiều)</p>}
              <button onClick={() => nop(keo)} disabled={!!ketQua}
                      className="mt-4 w-full rounded-2xl bg-gradient-to-b from-sky-400 to-blue-600 px-4 py-3.5 text-base font-black text-white shadow-[0_5px_0_#1e40af] transition active:translate-y-1 active:shadow-[0_1px_0_#1e40af] disabled:opacity-50">
                Kiểm tra
              </button>
            </>
          )}

          {dang === 'tinh' && (
            <>
              <p className="text-lg font-black leading-7 text-slate-900">
                Bây giờ là <span className="text-blue-600">{docGio(de)}</span>.{' '}
                {themPhut > 0 ? <>Sau <b>{themPhut} phút</b> nữa là mấy giờ?</> : <><b>{-themPhut} phút</b> trước là mấy giờ?</>}
              </p>
              <p className="mt-2 text-sm text-slate-500">Kéo kim ở đồng hồ bên cạnh rồi bấm kiểm tra.</p>
              <div className="mt-3">
                <MatDongHo gio={keo} keoDuoc buoc={buoc} onDoi={setKeo} hienPhut={lop >= 2} mau="#16a34a" />
              </div>
              <p className="mt-1 text-center text-sm font-bold text-slate-600">Đang chỉ <b>{docGio(keo)}</b></p>
              <button onClick={() => nop(keo)} disabled={!!ketQua}
                      className="mt-3 w-full rounded-2xl bg-gradient-to-b from-emerald-400 to-emerald-600 px-4 py-3.5 text-base font-black text-white shadow-[0_5px_0_#047857] transition active:translate-y-1 active:shadow-[0_1px_0_#047857] disabled:opacity-50">
                Kiểm tra
              </button>
            </>
          )}

          {/* Chấm bài + giải thích */}
          {ketQua && (
            <div className={`mt-4 rounded-2xl border-2 p-4 ${ketQua === 'dung' ? 'toan-an-mung border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}>
              <p className="font-black text-slate-900">
                {ketQua === 'dung' ? '🎉 Đúng rồi!' : '💡 Chưa đúng'} — đáp án là <b>{docGio(dapAnDung)}</b>
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-700">{giaiThich(dang, de, dapAnDung, themPhut)}</p>
              <button onClick={raDe} className="mt-3 rounded-full bg-slate-900 px-5 py-2 text-sm font-black text-white">
                Câu tiếp →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Giải thích bám vào KIM, không chỉ nhắc lại đáp án. */
function giaiThich(dang: Dang, de: Gio, dung: Gio, themPhut: number): string {
  if (dang === 'tinh') {
    const cach = khoangCach(de, dung);
    return themPhut > 0
      ? `${docGio(de)} cộng thêm ${themPhut} phút: kim phút quay tiếp ${themPhut} phút (${cach} phút trên mặt đồng hồ) thành ${docGio(dung)}.`
      : `Lùi lại ${-themPhut} phút từ ${docGio(de)} thì kim phút quay ngược về, thành ${docGio(dung)}.`;
  }
  const ke = (dung.gio % 12) + 1;
  if (dung.phut === 0) return `Kim dài chỉ đúng số 12 nên là giờ đúng; kim ngắn chỉ số ${dung.gio}.`;
  if (dung.phut === 30) return `Kim dài chỉ số 6 là 30 phút. Kim ngắn lúc này nằm giữa số ${dung.gio} và số ${ke} — vẫn đọc là ${dung.gio} giờ, đây là chỗ hay nhầm nhất.`;
  return `Kim dài chỉ ${dung.phut} phút (vạch số ${dung.phut / 5 === Math.floor(dung.phut / 5) ? dung.phut / 5 : `giữa ${Math.floor(dung.phut / 5)} và ${Math.floor(dung.phut / 5) + 1}`}), kim ngắn đã đi qua số ${dung.gio} nhưng CHƯA tới số ${ke} nên vẫn là ${dung.gio} giờ.`;
}
