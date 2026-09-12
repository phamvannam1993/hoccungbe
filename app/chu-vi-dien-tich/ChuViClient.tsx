'use client';

import { useCallback, useEffect, useState } from 'react';
import LuoiKeo from './LuoiKeo';
import {
  MUC_DO, TEN_HINH, congThuc, giaiThich, raBaiKeo, raBaiTinh,
  type BaiKeo, type BaiTinh, type MucDo,
} from '../lib/chuViDienTich';
import { speakText, stopSpeaking, unlockAudio } from '../components/edu/utils/speech';
import PhaoAnMung from '../components/edu/PhaoAnMung';

// Hai dạng:
//   🖐️ Kéo hình — dựng hình chữ nhật đạt đúng chu vi hoặc diện tích yêu cầu.
//      Nhiều đáp án đúng, và đó là điểm hay: bé thấy cùng một chu vi có nhiều
//      hình khác nhau.
//   📐 Tính     — cho số đo, chọn kết quả. Đáp án sai đặt theo lỗi lẫn công thức.

type Dang = 'keo' | 'tinh';
const KHOA_LUU = 'bhh_chu_vi';

const KEO_MO_MAN: BaiKeo = { theo: 'dien-tich', muc: 12, toiDa: 10 };
const TINH_MO_MAN: BaiTinh = { loai: 'chu-nhat', kt: { dai: 5, rong: 3 }, hoi: 'dien-tich', dapAn: 15, chon: [15, 16, 8, 30] };

export default function ChuViClient() {
  const [lop, setLop] = useState<MucDo>(3);
  const [dang, setDang] = useState<Dang>('keo');

  const [keo, setKeo] = useState<BaiKeo>(KEO_MO_MAN);
  const [dai, setDai] = useState(3);
  const [rong, setRong] = useState(2);

  const [tinh, setTinh] = useState<BaiTinh>(TINH_MO_MAN);
  const [daBam, setDaBam] = useState<number | null>(null);
  const [ketQua, setKetQua] = useState<'dung' | 'sai' | null>(null);
  const [diem, setDiem] = useState(0);
  const [tong, setTong] = useState(0);

  const raDe = useCallback(() => {
    setKetQua(null);
    setDaBam(null);
    if (dang === 'keo') { setKeo(raBaiKeo(lop)); setDai(3); setRong(2); }
    else setTinh(raBaiTinh(lop));
  }, [lop, dang]);

  // Đặt state thẳng trong effect — bọc rAF/microtask thì có thể chạy trước khi
  // hydrate xong, HTML hai bên lệch nhau.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { raDe(); }, [raDe]);

  useEffect(() => {
    try {
      const l = Number(localStorage.getItem(KHOA_LUU));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (l >= 3 && l <= 5) setLop(l as MucDo);
    } catch { /* máy chặn lưu trữ thì thôi */ }
  }, []);

  function doiLop(l: MucDo) {
    setLop(l);
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

  const cvHienTai = (dai + rong) * 2;
  const dtHienTai = dai * rong;
  const dangDat = keo.theo === 'chu-vi' ? cvHienTai : dtHienTai;

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-black text-slate-500">Bé học lớp</span>
        {MUC_DO.map((m) => (
          <button key={m.lop} onClick={() => doiLop(m.lop)} title={m.moTa}
                  className={`h-11 w-11 rounded-2xl border-2 text-lg font-black transition active:translate-y-0.5 ${
                    lop === m.lop
                      ? 'border-green-700 bg-gradient-to-b from-green-400 to-green-600 text-white shadow-[0_4px_0_#15803d]'
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
        {([['keo', '🖐️ Kéo hình'], ['tinh', '📐 Tính']] as const).map(([id, ten]) => (
          <button key={id} onClick={() => { stopSpeaking(); setDang(id); }}
                  className={`flex-1 rounded-full px-3 py-2 text-xs font-black transition sm:text-sm ${
                    dang === id ? 'bg-white text-slate-900 shadow' : 'text-slate-500'}`}>
            {ten}
          </button>
        ))}
      </div>

      <div className="toan-nen relative mt-5 rounded-3xl border-2 border-green-100 bg-gradient-to-br from-green-50 to-emerald-50/60 p-4 sm:p-6">
        {ketQua === 'dung' && <PhaoAnMung khoa={`${dang}-${tong}`} />}

        {/* 🖐️ KÉO HÌNH */}
        {dang === 'keo' && (
          <div className="flex flex-col items-center">
            <p className="flex items-center gap-3 text-center text-lg font-black text-slate-900">
              <button onClick={() => { unlockAudio(); stopSpeaking(); speakText(`Kéo hình chữ nhật sao cho ${keo.theo === 'chu-vi' ? 'chu vi' : 'diện tích'} bằng ${keo.muc}`); }}
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-b from-sky-400 to-blue-600 text-lg text-white shadow-[0_4px_0_#1e40af] transition active:translate-y-1 active:shadow-none"
                      aria-label="Nghe đọc câu hỏi">🔊</button>
              Kéo cho <span className="text-green-700">{keo.theo === 'chu-vi' ? 'chu vi' : 'diện tích'} = {keo.muc}</span>
              {keo.theo === 'chu-vi' ? ' ô' : ' ô vuông'}
            </p>

            <div className="mt-3 rounded-2xl bg-white p-2">
              <LuoiKeo toiDa={keo.toiDa} dai={dai} rong={rong}
                       onDoi={(d, r) => { if (!ketQua) { setDai(d); setRong(r); } }} />
            </div>

            <div className="mt-3 flex flex-wrap justify-center gap-2 text-sm font-black">
              <span className="rounded-full bg-white px-3 py-1.5 text-slate-700">{dai} × {rong} ô</span>
              <span className={`rounded-full px-3 py-1.5 ${keo.theo === 'chu-vi' ? 'bg-green-600 text-white' : 'bg-white text-slate-700'}`}>
                Chu vi: {cvHienTai}
              </span>
              <span className={`rounded-full px-3 py-1.5 ${keo.theo === 'dien-tich' ? 'bg-green-600 text-white' : 'bg-white text-slate-700'}`}>
                Diện tích: {dtHienTai}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">Kéo chấm tròn ở góc dưới bên phải để đổi kích thước.</p>

            <button onClick={() => cham(dangDat === keo.muc,
                      keo.theo === 'chu-vi'
                        ? `Chu vi bằng dài cộng rộng rồi nhân 2`
                        : `Diện tích bằng dài nhân rộng`)}
                    disabled={!!ketQua}
                    className="mt-3 rounded-2xl bg-gradient-to-b from-green-400 to-green-600 px-8 py-3.5 text-base font-black text-white shadow-[0_5px_0_#15803d] transition active:translate-y-1 active:shadow-[0_1px_0_#15803d] disabled:opacity-50">
              Kiểm tra
            </button>
          </div>
        )}

        {/* 📐 TÍNH */}
        {dang === 'tinh' && (
          <div className="flex flex-col items-center">
            <p className="flex items-center gap-3 text-center text-lg font-black leading-7 text-slate-900">
              <button onClick={() => { unlockAudio(); stopSpeaking(); speakText(deBai(tinh)); }}
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-b from-sky-400 to-blue-600 text-lg text-white shadow-[0_4px_0_#1e40af] transition active:translate-y-1 active:shadow-none"
                      aria-label="Nghe đọc đề bài">🔊</button>
              {deBai(tinh)}
            </p>

            <div className="mt-3 rounded-2xl bg-white p-3">
              <HinhMinhHoa bai={tinh} />
            </div>

            <p className="mt-2 rounded-full bg-white px-4 py-1.5 text-sm font-bold text-slate-600">
              Công thức: {tinh.hoi === 'chu-vi' ? congThuc[tinh.loai].cv : congThuc[tinh.loai].dt}
            </p>

            <div className="mt-4 grid w-full max-w-md grid-cols-2 gap-2.5 sm:grid-cols-4">
              {tinh.chon.map((n) => {
                const dung = n === tinh.dapAn;
                let k = 'border-slate-200 bg-white text-slate-800';
                if (ketQua) {
                  if (dung) k = 'border-emerald-400 bg-emerald-50 text-emerald-700';
                  else if (daBam === n) k = 'border-rose-300 bg-rose-50 text-rose-600';
                  else k = 'border-slate-100 bg-slate-50 text-slate-400';
                }
                return (
                  <button key={n} disabled={!!ketQua}
                          onClick={() => { setDaBam(n); cham(dung, giaiThich(tinh)); }}
                          className={`rounded-2xl border-2 py-5 text-xl font-black shadow-[0_4px_0_rgba(15,23,42,.08)] transition active:translate-y-1 active:shadow-none disabled:active:translate-y-0 ${k}`}>
                    {n}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {ketQua && (
          <div className={`mt-5 rounded-2xl border-2 p-4 ${ketQua === 'dung' ? 'toan-an-mung border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}>
            <p className="font-black text-slate-900">{ketQua === 'dung' ? '🎉 Đúng rồi!' : '💡 Chưa đúng'}</p>
            <p className="mt-1 text-sm leading-6 text-slate-700">
              {dang === 'tinh'
                ? giaiThich(tinh)
                : keo.theo === 'chu-vi'
                  ? `Hình ${dai} × ${rong} có chu vi (${dai} + ${rong}) × 2 = ${cvHienTai}, cần ${keo.muc}. Chú ý: nhiều hình khác nhau vẫn có cùng chu vi — ví dụ 4 × 2 và 5 × 1 đều có chu vi 12.`
                  : `Hình ${dai} × ${rong} có diện tích ${dai} × ${rong} = ${dtHienTai}, cần ${keo.muc}. Diện tích là số ô vuông phủ kín bên trong.`}
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

function deBai(b: BaiTinh): string {
  const t = TEN_HINH[b.loai];
  const { dai, rong, day2 } = b.kt;
  if (b.loai === 'vuong') return `${b.hoi === 'chu-vi' ? 'Chu vi' : 'Diện tích'} ${t} cạnh ${dai} cm là bao nhiêu?`;
  if (b.loai === 'thang') return `Diện tích ${t} có đáy lớn ${dai} cm, đáy bé ${day2} cm, chiều cao ${rong} cm là bao nhiêu?`;
  if (b.loai === 'tam-giac') return `Diện tích ${t} có đáy ${dai} cm, chiều cao ${rong} cm là bao nhiêu?`;
  if (b.loai === 'binh-hanh') return `Diện tích ${t} có đáy ${dai} cm, chiều cao ${rong} cm là bao nhiêu?`;
  return `${b.hoi === 'chu-vi' ? 'Chu vi' : 'Diện tích'} ${t} dài ${dai} cm, rộng ${rong} cm là bao nhiêu?`;
}

/** Hình minh hoạ có ghi số đo — bé nhìn thấy đáy và chiều cao nằm ở đâu. */
function HinhMinhHoa({ bai }: { bai: BaiTinh }) {
  const { loai, kt } = bai;
  const W = 300, H = 190;
  const w = 200, h = 110;
  const x0 = (W - w) / 2, y0 = 30;
  const mau = '#16a34a';
  const nen = '#16a34a22';
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[300px]" role="img" aria-label={TEN_HINH[loai]}>
      {loai === 'tam-giac' && (
        <>
          <path d={`M ${x0} ${y0 + h} L ${x0 + w} ${y0 + h} L ${x0 + w * 0.62} ${y0} Z`} fill={nen} stroke={mau} strokeWidth="3" strokeLinejoin="round" />
          <line x1={x0 + w * 0.62} y1={y0} x2={x0 + w * 0.62} y2={y0 + h} stroke={mau} strokeWidth="2" strokeDasharray="5 4" />
        </>
      )}
      {loai === 'binh-hanh' && (
        <>
          <path d={`M ${x0 + 34} ${y0} L ${x0 + w} ${y0} L ${x0 + w - 34} ${y0 + h} L ${x0} ${y0 + h} Z`} fill={nen} stroke={mau} strokeWidth="3" strokeLinejoin="round" />
          <line x1={x0 + 34} y1={y0} x2={x0 + 34} y2={y0 + h} stroke={mau} strokeWidth="2" strokeDasharray="5 4" />
        </>
      )}
      {loai === 'thang' && (
        <>
          <path d={`M ${x0 + 44} ${y0} L ${x0 + w - 44} ${y0} L ${x0 + w} ${y0 + h} L ${x0} ${y0 + h} Z`} fill={nen} stroke={mau} strokeWidth="3" strokeLinejoin="round" />
          <line x1={x0 + 44} y1={y0} x2={x0 + 44} y2={y0 + h} stroke={mau} strokeWidth="2" strokeDasharray="5 4" />
          <text x={W / 2} y={y0 - 8} textAnchor="middle" fontSize="13" fontWeight="800" fill="#15803d">{kt.day2} cm</text>
        </>
      )}
      {(loai === 'chu-nhat' || loai === 'vuong') && (
        <rect x={x0} y={y0} width={loai === 'vuong' ? h : w} height={h} fill={nen} stroke={mau} strokeWidth="3" />
      )}
      {/* Số đo */}
      <text x={loai === 'vuong' ? x0 + h / 2 : W / 2} y={y0 + h + 24} textAnchor="middle" fontSize="14" fontWeight="800" fill="#15803d">
        {kt.dai} cm
      </text>
      <text x={loai === 'vuong' ? x0 + h + 12 : x0 + w + 10} y={y0 + h / 2 + 5} fontSize="14" fontWeight="800" fill="#15803d">
        {loai === 'vuong' ? kt.dai : kt.rong} cm
      </text>
      {loai !== 'chu-nhat' && loai !== 'vuong' && (
        <text x={W / 2} y={H - 4} textAnchor="middle" fontSize="11" fill="#64748b">nét đứt là chiều cao</text>
      )}
    </svg>
  );
}
