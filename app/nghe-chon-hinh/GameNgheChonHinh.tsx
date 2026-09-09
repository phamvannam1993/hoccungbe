'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { CAC_LOP, type Lop } from '../lib/vongTuVung';
import { MAU_LOP, raDeNghe, type CauNghe } from '../lib/deNghe';
import { khoaAnhTuVung } from '../lib/anhTuVung';
import { speakEnThenVi, speakEnglish, speakEnglishSlow, stopSpeaking, unlockAudio } from '../components/edu/utils/speech';
import HinhTu from '../vong-tron-am/HinhTu';

// GAME NGHE — CHỌN HÌNH
//
// Nghe một từ tiếng Anh rồi chọn đúng hình trong bốn hình.
//
// Điểm mấu chốt của cách ra đề: BA HÌNH SAI LẤY CÙNG MỘT CHỦ ĐỀ với hình đúng.
// Trộn lung tung (một con vật, một màu, một cái bàn) thì bé đoán được bằng cách
// loại trừ mà không cần nghe. Cùng chủ đề thì buộc phải nghe ra đúng từ.

const KEY = 'bhh_nghe_chon_hinh_v1';
const SO_CAU = 10;
const SO_DAP_AN = 4;

export default function GameNgheChonHinh() {
  const [lop, setLop] = useState<Lop>(1);
  const [de, setDe] = useState<CauNghe[]>([]);
  const [so, setSo] = useState(0);
  const [chon, setChon] = useState<string | null>(null);
  const [diem, setDiem] = useState(0);
  const [xong, setXong] = useState(false);
  const [kyLuc, setKyLuc] = useState<number | null>(null);

  const cau = de[so] ?? null;
  const mau = MAU_LOP[lop];

  const batDau = useCallback((l: Lop) => {
    setDe(raDeNghe(l, SO_CAU, SO_DAP_AN)); setSo(0); setChon(null); setDiem(0); setXong(false);
  }, []);

  // Ra đề trong effect chứ không phải lúc khởi tạo state: đề dựng bằng số ngẫu
  // nhiên, mà máy chủ và trình duyệt random khác nhau thì lệch hydration.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    batDau(lop);
  }, [batDau, lop]);

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

  // Đọc từ ngay khi sang câu mới — đây là game NGHE, không đọc thì không có đề.
  useEffect(() => {
    if (!cau || xong) return;
    const t = window.setTimeout(() => speakEnglish(cau.dung.en), 350);
    return () => window.clearTimeout(t);
  }, [cau, xong]);

  function tra(en: string) {
    if (chon || !cau) return;
    setChon(en);
    const dung = en === cau.dung.en;
    if (dung) setDiem((d) => d + 1);
    // Sai thì đọc lại kèm nghĩa để bé biết mình vừa nghe từ gì.
    stopSpeaking();
    if (dung) speakEnglish(cau.dung.en);
    else speakEnThenVi(cau.dung.en, cau.dung.vi);

    window.setTimeout(() => {
      if (so + 1 >= de.length) {
        const cuoi = diem + (dung ? 1 : 0);
        setXong(true);
        const moi = kyLuc == null ? cuoi : Math.max(kyLuc, cuoi);
        setKyLuc(moi);
        try { localStorage.setItem(KEY, JSON.stringify({ kyLuc: moi })); } catch { /* bỏ qua */ }
      } else {
        setSo((n) => n + 1);
        setChon(null);
      }
    }, dung ? 1000 : 1900);
  }

  // ── Màn kết thúc ──────────────────────────────────────────────────────────
  if (xong) {
    const sao = diem >= SO_CAU ? 3 : diem >= SO_CAU * 0.7 ? 2 : diem >= SO_CAU * 0.4 ? 1 : 0;
    return (
      <div className="mx-auto max-w-md px-4 py-10 text-center">
        <div className="relative mx-auto grid h-40 w-40 place-items-center">
          <div className="absolute inset-0 rounded-full blur-2xl"
            style={{ background: `radial-gradient(circle, ${mau}66 0%, transparent 70%)` }} />
          <div className="nav-troi relative text-8xl" aria-hidden>{sao === 3 ? '🏆' : sao >= 2 ? '🎉' : '💪'}</div>
        </div>
        <div className="mt-1 flex justify-center gap-1 text-4xl" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span key={i} className={i < sao ? 'nav-bung' : 'opacity-25 grayscale'}
              style={{ animationDelay: `${i * 120}ms` }}>⭐</span>
          ))}
        </div>
        <h2 className="chu-mau mt-3 text-3xl font-black text-slate-800">
          {sao === 3 ? 'Tuyệt vời! Đúng hết!' : sao >= 2 ? 'Giỏi lắm!' : 'Cố lên nào!'}
        </h2>
        <p className="mt-2 text-lg font-black text-slate-600">
          Nghe đúng <span style={{ color: mau }}>{diem}</span> / {de.length} từ
        </p>
        {kyLuc != null && <p className="mt-1 text-sm font-bold text-slate-400">Kỷ lục của bé: {kyLuc} ⭐</p>}
        <button onClick={() => batDau(lop)}
          className="mt-6 w-full rounded-3xl py-4 text-lg font-black text-white transition active:translate-y-1"
          style={{ background: `linear-gradient(180deg, ${mau} 0%, ${mau}cc 100%)`, boxShadow: `0 6px 0 ${mau}80` }}>
          🔁 Chơi ván mới
        </button>
        <Link href="/vong-tu-vung"
          className="mt-3 block rounded-3xl border-2 border-white bg-white/70 py-3 text-sm font-black text-slate-600 backdrop-blur">
          🎡 Về vòng tròn từ vựng
        </Link>
      </div>
    );
  }

  if (!cau) return null;

  return (
    <div className="mx-auto w-full max-w-2xl overflow-x-hidden px-3 pb-8 pt-3 sm:px-4">
      {/* Chọn lớp */}
      <div className="mb-3 flex items-center justify-center gap-1.5">
        <span className="text-xs font-black uppercase tracking-wide text-slate-400">Lớp</span>
        {CAC_LOP.map((l) => (
          <button key={l} onClick={() => { stopSpeaking(); setLop(l); }}
            className={`h-9 w-9 rounded-xl text-sm font-black transition ${l === lop ? 'text-white' : 'bg-white/80 text-slate-600 ring-1 ring-slate-200'}`}
            style={l === lop ? { background: mau, boxShadow: `0 3px 0 ${mau}80` } : undefined}>
            {l}
          </button>
        ))}
      </div>

      {/* Tiến độ + điểm */}
      <div className="mb-4 rounded-[22px] border-2 border-white bg-white/70 p-2.5 shadow-lg shadow-sky-100 backdrop-blur sm:p-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-2xl" style={{ background: `${mau}1a` }} aria-hidden>
            {cau.chuDe.emoji}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] font-black uppercase tracking-wide text-slate-400 sm:text-xs">
              Câu {so + 1}/{de.length} · {cau.chuDe.heading}
            </p>
            <div className="mt-1.5 flex gap-0.5">
              {de.map((_, i) => (
                <span key={i} className="h-2.5 flex-1 rounded-full transition-all"
                  style={{ background: i < so ? '#34d399' : i === so ? mau : '#e2e8f0' }} />
              ))}
            </div>
          </div>
          <span className="shrink-0 rounded-2xl bg-amber-100 px-3 py-1.5 text-center">
            <span className="block text-lg font-black leading-none text-amber-600">{diem}</span>
            <span className="block text-[10px] font-black uppercase text-amber-500">đúng</span>
          </span>
        </div>
      </div>

      {/* Nút nghe — đề bài nằm ở đây, không hiện chữ tiếng Anh cho tới khi trả lời */}
      <div className="mb-4 flex flex-col items-center gap-2">
        <button onClick={() => { stopSpeaking(); speakEnglish(cau.dung.en); }}
          aria-label="Nghe lại từ"
          className="grid h-20 w-20 place-items-center rounded-full text-4xl text-white transition active:scale-95"
          style={{ background: `linear-gradient(160deg, ${mau} 0%, ${mau}bb 100%)`, boxShadow: `0 6px 0 ${mau}70` }}>
          🔊
        </button>
        <button onClick={() => { stopSpeaking(); speakEnglishSlow(cau.dung.en); }}
          className="rounded-full bg-white/80 px-3 py-1 text-xs font-black text-slate-500 ring-1 ring-slate-200">
          🐢 Nghe chậm
        </button>
        {/* Lộ chữ SAU khi trả lời: trước đó mà hiện thì thành bài đọc, không phải bài nghe. */}
        <p className="chu-mau h-7 text-2xl font-black" style={{ color: mau }}>
          {chon ? cau.dung.en : ''}
        </p>
      </div>

      {/* Bốn hình để chọn */}
      <ul className="grid grid-cols-2 gap-2 sm:gap-3">
        {cau.dapAn.map((w) => {
          const daChon = chon === w.en;
          const laDung = w.en === cau.dung.en;
          const hienDung = chon != null && laDung;
          const hienSai = daChon && !laDung;
          return (
            <li key={w.en} className={hienSai ? 'nav-rung' : hienDung ? 'nav-bung' : ''}>
              <button
                onClick={() => tra(w.en)}
                disabled={chon != null}
                className={`flex w-full flex-col items-center gap-1 rounded-3xl border-2 p-3 transition-all ${
                  hienDung ? 'border-emerald-400 bg-gradient-to-br from-emerald-50 to-white shadow-[0_4px_0_#6ee7b7]'
                    : hienSai ? 'border-rose-400 bg-rose-50 shadow-[0_4px_0_#fda4af]'
                      : 'border-white bg-white/85 shadow-[0_4px_0_rgba(148,163,184,.28)] hover:-translate-y-0.5'
                }`}
              >
                <span className="grid h-24 w-24 place-items-center overflow-hidden rounded-2xl sm:h-28 sm:w-28"
                  style={{ background: `${mau}12` }}>
                  <HinhTu tu={w.en} emoji={w.emoji} co={128}
                    lop="h-20 w-20 text-5xl sm:h-24 sm:w-24 sm:text-6xl"
                    khoa={khoaAnhTuVung(cau.chuDe.slug, w.en)} />
                </span>
                {/* Chỉ hiện tên sau khi trả lời — để bé nhìn hình mà chọn, không đọc chữ. */}
                <span className={`chu-mau block h-5 truncate text-xs font-black sm:text-sm ${
                  hienDung ? 'text-emerald-600' : hienSai ? 'text-rose-500' : 'text-transparent'
                }`}>
                  {chon ? w.en : '·'}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-center text-[11px] font-bold leading-relaxed text-slate-400 sm:text-xs">
        Bấm 🔊 để nghe lại · Chọn hình đúng với từ vừa nghe
      </p>
    </div>
  );
}
