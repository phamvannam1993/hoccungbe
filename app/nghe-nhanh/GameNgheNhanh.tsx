'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { CAC_LOP, type Lop } from '../lib/vongTuVung';
import { MAU_LOP, raDeNghe, type CauNghe } from '../lib/deNghe';
import { khoaAnhTuVung } from '../lib/anhTuVung';
import { speakEnglish, stopSpeaking, unlockAudio } from '../components/edu/utils/speech';
import HinhTu from '../vong-tron-am/HinhTu';

// GAME NGHE NHANH — 60 giây, trả lời được bao nhiêu câu thì trả lời.
//
// Khác hai game kia ở chỗ KHÔNG dừng lại giảng giải khi sai: sai thì nháy đỏ rồi
// sang câu mới ngay. Đây là game luyện PHẢN XẠ — dừng lại phân tích là mất nhịp,
// và bé cũng không còn thời gian mà nghe kỹ.
//
// Có chuỗi đúng liên tiếp: đúng 3 câu liền được nhân đôi điểm. Thưởng cho việc
// giữ nhịp chứ không chỉ thưởng số câu.

const KEY = 'bhh_nghe_nhanh_v1';
const GIAY = 60;
const SO_DAP_AN = 4;
const DE_MOI_VAN = 40;      // ra dư, chơi hết 60 giây cũng không cạn câu

export default function GameNgheNhanh() {
  const [lop, setLop] = useState<Lop>(1);
  const [de, setDe] = useState<CauNghe[]>([]);
  const [so, setSo] = useState(0);
  const [nhay, setNhay] = useState<'dung' | 'sai' | null>(null);
  const [diem, setDiem] = useState(0);
  const [chuoi, setChuoi] = useState(0);
  const [conLai, setConLai] = useState(GIAY);
  const [dangChoi, setDangChoi] = useState(false);
  const [xong, setXong] = useState(false);
  const [kyLuc, setKyLuc] = useState<number | null>(null);

  const cau = de[so] ?? null;
  const mau = MAU_LOP[lop];
  const dongHo = useRef<number | null>(null);

  const dungLai = useCallback(() => {
    if (dongHo.current != null) { window.clearInterval(dongHo.current); dongHo.current = null; }
  }, []);

  const batDau = useCallback((l: Lop) => {
    stopSpeaking();
    setDe(raDeNghe(l, DE_MOI_VAN, SO_DAP_AN));
    setSo(0); setNhay(null); setDiem(0); setChuoi(0);
    setConLai(GIAY); setXong(false); setDangChoi(true);
  }, []);

  useEffect(() => {
    const mo = () => unlockAudio();
    window.addEventListener('pointerdown', mo, { once: true });
    return () => window.removeEventListener('pointerdown', mo);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setKyLuc(JSON.parse(raw).kyLuc ?? null);
    } catch { /* trình duyệt chặn lưu thì bỏ qua */ }
  }, []);

  // Đồng hồ đếm ngược.
  useEffect(() => {
    if (!dangChoi) return;
    dongHo.current = window.setInterval(() => {
      setConLai((t) => {
        if (t <= 1) { setDangChoi(false); setXong(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return dungLai;
  }, [dangChoi, dungLai]);

  // Lưu kỷ lục khi hết giờ.
  useEffect(() => {
    if (!xong) return;
    const moi = kyLuc == null ? diem : Math.max(kyLuc, diem);
    if (moi !== kyLuc) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setKyLuc(moi);
      try { localStorage.setItem(KEY, JSON.stringify({ kyLuc: moi })); } catch { /* bỏ qua */ }
    }
    stopSpeaking();
  }, [xong, diem, kyLuc]);

  // Đọc từ mỗi khi sang câu mới.
  useEffect(() => {
    if (!cau || !dangChoi) return;
    const t = window.setTimeout(() => speakEnglish(cau.dung.en), 200);
    return () => window.clearTimeout(t);
  }, [cau, dangChoi]);

  function tra(en: string) {
    if (!cau || nhay || !dangChoi) return;
    const dung = en === cau.dung.en;
    setNhay(dung ? 'dung' : 'sai');
    if (dung) {
      const c = chuoi + 1;
      setChuoi(c);
      // Chuỗi từ 3 câu trở lên: mỗi câu ăn 2 điểm.
      setDiem((d) => d + (c >= 3 ? 2 : 1));
    } else {
      setChuoi(0);
    }
    window.setTimeout(() => {
      setNhay(null);
      setSo((n) => (n + 1 < de.length ? n + 1 : 0));
    }, dung ? 350 : 550);
  }

  // ── Màn mở đầu / kết thúc ─────────────────────────────────────────────────
  if (!dangChoi) {
    return (
      <div className="mx-auto max-w-md px-4 py-8 text-center">
        {xong ? (
          <>
            <div className="relative mx-auto grid h-36 w-36 place-items-center">
              <div className="absolute inset-0 rounded-full blur-2xl"
                style={{ background: `radial-gradient(circle, ${mau}66 0%, transparent 70%)` }} />
              <div className="nav-troi relative text-7xl" aria-hidden>⏱️</div>
            </div>
            <h2 className="chu-mau mt-2 text-3xl font-black text-slate-800">Hết giờ!</h2>
            <p className="mt-2 text-lg font-black text-slate-600">
              Được <span style={{ color: mau }}>{diem}</span> điểm trong {GIAY} giây
            </p>
            {kyLuc != null && <p className="mt-1 text-sm font-bold text-slate-400">Kỷ lục của bé: {kyLuc} ⭐</p>}
          </>
        ) : (
          <>
            <div className="nav-troi text-7xl" aria-hidden>⚡</div>
            <h2 className="chu-mau mt-2 text-3xl font-black text-slate-800">Nghe nhanh 60 giây</h2>
            <p className="mt-2 text-sm font-bold text-slate-500">
              Nghe từ, chọn hình thật nhanh. Đúng liền <b>3 câu</b> trở lên thì mỗi câu ăn <b>2 điểm</b>.
            </p>
          </>
        )}

        <div className="mt-5 flex items-center justify-center gap-1.5">
          <span className="text-xs font-black uppercase tracking-wide text-slate-400">Lớp</span>
          {CAC_LOP.map((l) => (
            <button key={l} onClick={() => setLop(l)}
              className={`h-9 w-9 rounded-xl text-sm font-black transition ${l === lop ? 'text-white' : 'bg-white/80 text-slate-600 ring-1 ring-slate-200'}`}
              style={l === lop ? { background: mau, boxShadow: `0 3px 0 ${mau}80` } : undefined}>{l}</button>
          ))}
        </div>

        <button onClick={() => batDau(lop)}
          className="mt-5 w-full rounded-3xl py-4 text-lg font-black text-white transition active:translate-y-1"
          style={{ background: `linear-gradient(180deg, ${mau} 0%, ${mau}cc 100%)`, boxShadow: `0 6px 0 ${mau}80` }}>
          {xong ? '🔁 Chơi lại' : '▶️ Bắt đầu'}
        </button>
        <Link href="/luyen-nghe"
          className="mt-3 block rounded-3xl border-2 border-white bg-white/70 py-3 text-sm font-black text-slate-600 backdrop-blur">
          🎧 Các game luyện nghe khác
        </Link>
      </div>
    );
  }

  if (!cau) return null;
  const gap = conLai <= 10;

  return (
    <div className="mx-auto w-full max-w-2xl overflow-x-hidden px-3 pb-8 pt-3 sm:px-4">
      <div className="mb-4 rounded-[22px] border-2 border-white bg-white/70 p-2.5 shadow-lg shadow-violet-100 backdrop-blur sm:p-3">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Đồng hồ đổi sang đỏ và nhấp nháy ở 10 giây cuối. */}
          <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-lg font-black ${gap ? 'nav-bung text-white' : 'text-slate-700'}`}
            style={{ background: gap ? '#ef4444' : '#f1f5f9' }}>
            {conLai}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] font-black uppercase tracking-wide text-slate-400 sm:text-xs">
              {cau.chuDe.emoji} {cau.chuDe.heading}
              {chuoi >= 3 && <span className="ml-1 text-amber-500">· 🔥 chuỗi {chuoi} · x2 điểm</span>}
            </p>
            <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full transition-all"
                style={{ width: `${(conLai / GIAY) * 100}%`, background: gap ? '#ef4444' : mau }} />
            </div>
          </div>
          <span className="shrink-0 rounded-2xl bg-amber-100 px-3 py-1.5 text-center">
            <span className="block text-lg font-black leading-none text-amber-600">{diem}</span>
            <span className="block text-[10px] font-black uppercase text-amber-500">điểm</span>
          </span>
        </div>
      </div>

      <div className="mb-4 flex justify-center">
        <button onClick={() => { stopSpeaking(); speakEnglish(cau.dung.en); }} aria-label="Nghe lại từ"
          className="grid h-16 w-16 place-items-center rounded-full text-3xl text-white transition active:scale-95"
          style={{ background: `linear-gradient(160deg, ${mau} 0%, ${mau}bb 100%)`, boxShadow: `0 5px 0 ${mau}70` }}>
          🔊
        </button>
      </div>

      <ul className="grid grid-cols-2 gap-2 sm:gap-3">
        {cau.dapAn.map((w) => {
          const laDung = w.en === cau.dung.en;
          const sang = nhay === 'dung' && laDung;
          const do_ = nhay === 'sai' && !laDung ? false : nhay === 'sai' && laDung;
          return (
            <li key={w.en} className={sang ? 'nav-bung' : ''}>
              <button onClick={() => tra(w.en)} disabled={nhay != null}
                className={`flex w-full flex-col items-center rounded-3xl border-2 p-3 transition-all ${
                  sang || do_ ? 'border-emerald-400 bg-emerald-50 shadow-[0_4px_0_#6ee7b7]'
                    : 'border-white bg-white/85 shadow-[0_4px_0_rgba(148,163,184,.28)] hover:-translate-y-0.5'
                }`}>
                <span className="grid h-24 w-24 place-items-center overflow-hidden rounded-2xl sm:h-28 sm:w-28"
                  style={{ background: `${mau}12` }}>
                  <HinhTu tu={w.en} emoji={w.emoji} co={128}
                    lop="h-20 w-20 text-5xl sm:h-24 sm:w-24 sm:text-6xl"
                    khoa={khoaAnhTuVung(cau.chuDe.slug, w.en)} />
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-center text-[11px] font-bold text-slate-400 sm:text-xs">
        Sai không sao — sang câu mới ngay, cứ nghe tiếp
      </p>
    </div>
  );
}
