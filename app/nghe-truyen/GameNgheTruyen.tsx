'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { CAC_LOP, type Lop } from '../lib/vongTuVung';
import { MAU_LOP, xao } from '../lib/deNghe';
import { truyenTheoLop, type Truyen } from '../lib/truyenNghe';
import { speakEnglish, speakSequence, speakText, stopSpeaking, unlockAudio } from '../components/edu/utils/speech';

// GAME NGHE TRUYỆN — nghe rồi trả lời câu hỏi.
//
// Chia làm hai chặng rõ ràng: NGHE trước, TRẢ LỜI sau.
//
// Ở chặng nghe, chữ tiếng Anh được che đi. Nếu cho đọc chữ thì bé sẽ đọc chứ
// không nghe, mà nghe hiểu mới là thứ đang luyện. Bé nghe bao nhiêu lần cũng
// được — nghe lại không bị trừ điểm, vì mục tiêu là hiểu chứ không phải nhớ.
//
// Bản dịch tiếng Việt chỉ mở ra khi bé tự bấm, và bấm rồi thì có ghi nhận. Sang
// chặng trả lời thì hiện hết cả hai thứ tiếng để bé đối chiếu.

const KEY = 'bhh_nghe_truyen_v1';

type Cau = { hoi: string; hoiVi: string; dung: string; dapAn: string[] };

function raDe(t: Truyen): Cau[] {
  return t.hoi.map((h) => ({
    hoi: h.hoi, hoiVi: h.hoiVi,
    dung: h.dapAn[0],          // phần tử đầu luôn là đáp án đúng
    dapAn: xao(h.dapAn),
  }));
}

export default function GameNgheTruyen() {
  const [lop, setLop] = useState<Lop>(1);
  const [truyen, setTruyen] = useState<Truyen | null>(null);
  const [chang, setChang] = useState<'nghe' | 'hoi' | 'xong'>('nghe');
  const [dangDoc, setDangDoc] = useState<number | null>(null);
  const [hienDich, setHienDich] = useState(false);
  const [de, setDe] = useState<Cau[]>([]);
  const [so, setSo] = useState(0);
  const [chon, setChon] = useState<string | null>(null);
  const [diem, setDiem] = useState(0);
  const [daLam, setDaLam] = useState<Set<string>>(new Set());

  const mau = MAU_LOP[lop];
  const ds = truyenTheoLop(lop);
  const hen = useRef<number | null>(null);

  const chonTruyen = useCallback((t: Truyen) => {
    stopSpeaking();
    if (hen.current != null) window.clearTimeout(hen.current);
    setTruyen(t); setChang('nghe'); setDangDoc(null); setHienDich(false);
    setDe(raDe(t)); setSo(0); setChon(null); setDiem(0);
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
      if (raw) setDaLam(new Set(JSON.parse(raw) as string[]));
    } catch { /* trình duyệt chặn lưu thì bỏ qua */ }
  }, []);

  useEffect(() => () => { if (hen.current != null) window.clearTimeout(hen.current); }, []);

  /** Đọc cả truyện, tô sáng câu đang đọc để bé bám theo. */
  function docTruyen() {
    if (!truyen) return;
    stopSpeaking();
    speakSequence(
      truyen.cau.map((c) => ({ text: c.en, lang: 'en' as const })),
      (i) => setDangDoc(i),
      () => setDangDoc(null),
    );
  }

  function tra(dapAn: string) {
    if (chon || !de[so]) return;
    setChon(dapAn);
    const dung = dapAn === de[so].dung;
    if (dung) setDiem((d) => d + 1);
    stopSpeaking();
    speakEnglish(dung ? 'Correct' : de[so].dung);

    hen.current = window.setTimeout(() => {
      if (so + 1 >= de.length) {
        setChang('xong');
        if (truyen) {
          const s = new Set(daLam); s.add(truyen.ma);
          setDaLam(s);
          try { localStorage.setItem(KEY, JSON.stringify([...s])); } catch { /* bỏ qua */ }
        }
      } else { setSo((n) => n + 1); setChon(null); }
    }, dung ? 900 : 1700);
  }

  // ── Chọn truyện ───────────────────────────────────────────────────────────
  if (!truyen) {
    return (
      <div className="mx-auto w-full max-w-2xl px-3 pb-8 pt-3 sm:px-4">
        <div className="mb-4 flex items-center justify-center gap-1.5">
          <span className="text-xs font-black uppercase tracking-wide text-slate-400">Lớp</span>
          {CAC_LOP.map((l) => (
            <button key={l} onClick={() => setLop(l)}
              className={`h-9 w-9 rounded-xl text-sm font-black transition ${l === lop ? 'text-white' : 'bg-white/80 text-slate-600 ring-1 ring-slate-200'}`}
              style={l === lop ? { background: MAU_LOP[l], boxShadow: `0 3px 0 ${MAU_LOP[l]}80` } : undefined}>{l}</button>
          ))}
        </div>
        <ul className="grid gap-2.5 sm:grid-cols-2">
          {ds.map((t) => (
            <li key={t.ma}>
              <button onClick={() => chonTruyen(t)}
                className="flex w-full items-center gap-3 rounded-[26px] border-2 border-white bg-white/85 p-3 text-left shadow-[0_5px_0_rgba(148,163,184,.25)] transition hover:-translate-y-0.5">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-3xl" style={{ background: `${mau}18` }} aria-hidden>
                  {t.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="chu-mau block truncate text-base font-black text-slate-800">{t.ten}</span>
                  <span className="block truncate text-xs font-bold text-slate-500">{t.tenVi}</span>
                  <span className="mt-0.5 block text-[11px] font-black uppercase tracking-wide text-slate-400">
                    {t.cau.length} câu · {t.hoi.length} câu hỏi
                  </span>
                </span>
                {daLam.has(t.ma) && <span className="shrink-0 text-lg" aria-hidden>✓</span>}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // ── Màn kết ───────────────────────────────────────────────────────────────
  if (chang === 'xong') {
    const sao = diem >= de.length ? 3 : diem >= de.length * 0.7 ? 2 : diem >= de.length * 0.4 ? 1 : 0;
    return (
      <div className="mx-auto max-w-md px-4 py-10 text-center">
        <div className="relative mx-auto grid h-36 w-36 place-items-center">
          <div className="absolute inset-0 rounded-full blur-2xl"
            style={{ background: `radial-gradient(circle, ${mau}66 0%, transparent 70%)` }} />
          <div className="nav-troi relative text-7xl" aria-hidden>{truyen.emoji}</div>
        </div>
        <div className="mt-1 flex justify-center gap-1 text-4xl" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span key={i} className={i < sao ? 'nav-bung' : 'opacity-25 grayscale'} style={{ animationDelay: `${i * 120}ms` }}>⭐</span>
          ))}
        </div>
        <h2 className="chu-mau mt-3 text-2xl font-black text-slate-800">{truyen.ten}</h2>
        <p className="mt-2 text-lg font-black text-slate-600">
          Trả lời đúng <span style={{ color: mau }}>{diem}</span> / {de.length} câu
        </p>
        <button onClick={() => chonTruyen(truyen)}
          className="mt-6 w-full rounded-3xl py-4 text-lg font-black text-white transition active:translate-y-1"
          style={{ background: `linear-gradient(180deg, ${mau} 0%, ${mau}cc 100%)`, boxShadow: `0 6px 0 ${mau}80` }}>
          🔁 Nghe lại truyện này
        </button>
        <button onClick={() => { stopSpeaking(); setTruyen(null); }}
          className="mt-3 block w-full rounded-3xl border-2 border-white bg-white/70 py-3 text-sm font-black text-slate-600 backdrop-blur">
          📚 Chọn truyện khác
        </button>
        <Link href="/luyen-nghe" className="mt-3 block text-xs font-black text-slate-400">🎧 Các game luyện nghe khác</Link>
      </div>
    );
  }

  // ── Chặng NGHE và chặng TRẢ LỜI ───────────────────────────────────────────
  const cau = de[so];
  return (
    <div className="mx-auto w-full max-w-2xl overflow-x-hidden px-3 pb-8 pt-3 sm:px-4">
      <div className="mb-3 flex items-center gap-2 rounded-[22px] border-2 border-white bg-white/70 p-2.5 shadow-lg shadow-amber-100 backdrop-blur">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-2xl" style={{ background: `${mau}1a` }} aria-hidden>
          {truyen.emoji}
        </span>
        <span className="min-w-0 flex-1">
          <span className="chu-mau block truncate text-sm font-black text-slate-800">{truyen.ten}</span>
          <span className="block truncate text-[11px] font-bold text-slate-500">{truyen.tenVi}</span>
        </span>
        <button onClick={() => { stopSpeaking(); setTruyen(null); }}
          className="shrink-0 rounded-xl bg-slate-100 px-2.5 py-1.5 text-[11px] font-black text-slate-500">Đổi truyện</button>
      </div>

      {chang === 'nghe' ? (
        <>
          <div className="mb-3 flex flex-col items-center gap-2">
            <button onClick={docTruyen} aria-label="Nghe cả truyện"
              className="grid h-20 w-20 place-items-center rounded-full text-4xl text-white transition active:scale-95"
              style={{ background: `linear-gradient(160deg, ${mau} 0%, ${mau}bb 100%)`, boxShadow: `0 6px 0 ${mau}70` }}>
              ▶️
            </button>
            <p className="text-xs font-bold text-slate-500">Nghe bao nhiêu lần cũng được</p>
          </div>

          {/* Chặng nghe: CHE chữ tiếng Anh. Cho đọc thì bé sẽ đọc chứ không nghe. */}
          <ul className="mb-3 grid gap-1.5">
            {truyen.cau.map((c, i) => (
              <li key={i}
                className={`flex items-center gap-2 rounded-2xl border-2 p-2.5 transition ${
                  dangDoc === i ? 'border-transparent text-white' : 'border-white bg-white/85'
                }`}
                style={dangDoc === i ? { background: mau } : undefined}>
                <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg text-[11px] font-black ${
                  dangDoc === i ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'
                }`}>{i + 1}</span>
                <span className={`flex-1 text-sm font-bold ${dangDoc === i ? 'text-white' : 'text-slate-300'}`}>
                  {hienDich ? c.vi : '• • • • •'}
                </span>
                <button onClick={() => { stopSpeaking(); speakEnglish(c.en); setDangDoc(i); }}
                  aria-label={`Nghe câu ${i + 1}`}
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl text-sm ${
                    dangDoc === i ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>🔊</button>
              </li>
            ))}
          </ul>

          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setHienDich((v) => !v)}
              className="rounded-2xl border-2 border-slate-200 bg-white/80 py-3 text-sm font-black text-slate-600">
              {hienDich ? '🙈 Ẩn nghĩa' : '🇻🇳 Xem nghĩa'}
            </button>
            <button onClick={() => { stopSpeaking(); setChang('hoi'); }}
              className="rounded-2xl py-3 text-sm font-black text-white"
              style={{ background: mau, boxShadow: `0 4px 0 ${mau}80` }}>
              Trả lời câu hỏi →
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Chặng trả lời: hiện cả hai thứ tiếng để bé đối chiếu khi cần. */}
          <details className="mb-3 rounded-2xl border-2 border-white bg-white/70 p-3">
            <summary className="cursor-pointer text-xs font-black text-slate-500">📖 Xem lại truyện</summary>
            <ul className="mt-2 grid gap-1">
              {truyen.cau.map((c, i) => (
                <li key={i} className="text-sm">
                  <span className="font-bold text-slate-700">{c.en}</span>
                  <span className="ml-1 text-xs font-bold text-slate-400">{c.vi}</span>
                </li>
              ))}
            </ul>
          </details>

          <div className="mb-3 flex gap-0.5">
            {de.map((_, i) => (
              <span key={i} className="h-2.5 flex-1 rounded-full transition-all"
                style={{ background: i < so ? '#34d399' : i === so ? mau : '#e2e8f0' }} />
            ))}
          </div>

          <div className="mb-3 rounded-[26px] border-2 border-white bg-white/85 p-4 text-center shadow-lg">
            <p className="chu-mau text-lg font-black text-slate-800">{cau.hoi}</p>
            <p className="mt-1 text-xs font-bold text-slate-400">{cau.hoiVi}</p>
            <button onClick={() => { stopSpeaking(); speakText(cau.hoi); }}
              className="mt-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black text-slate-500">🔊 Nghe câu hỏi</button>
          </div>

          <ul className="grid gap-2">
            {cau.dapAn.map((d) => {
              const daChon = chon === d;
              const laDung = d === cau.dung;
              const hienDung = chon != null && laDung;
              const hienSai = daChon && !laDung;
              return (
                <li key={d} className={hienSai ? 'nav-rung' : hienDung ? 'nav-bung' : ''}>
                  <button onClick={() => tra(d)} disabled={chon != null}
                    className={`w-full rounded-2xl border-2 px-3 py-3.5 text-left text-sm font-black transition-all ${
                      hienDung ? 'border-emerald-400 bg-emerald-50 text-emerald-700 shadow-[0_4px_0_#6ee7b7]'
                        : hienSai ? 'border-rose-400 bg-rose-50 text-rose-600 shadow-[0_4px_0_#fda4af]'
                          : 'border-white bg-white/85 text-slate-700 shadow-[0_4px_0_rgba(148,163,184,.28)] hover:-translate-y-0.5'
                    }`}>
                    {d}
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
