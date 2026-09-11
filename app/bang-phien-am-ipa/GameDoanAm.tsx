'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IPA, type AmIpa } from '../lib/ipa';
import { speakEnglish, speakEnglishSlow, stopSpeaking, unlockAudio } from '../components/edu/utils/speech';

// Trò chơi: nghe một từ rồi chọn xem từ đó chứa âm nào.
//
// Chọn cách chơi này vì nó ép bé NGHE RA âm trong từ thật, thay vì thuộc lòng
// ký hiệu rời. Ba đáp án nhiễu lấy trong CÙNG NHÓM (nguyên âm với nguyên âm)
// và ưu tiên âm cặp đôi hữu/vô thanh — những cặp bé hay lẫn — chứ không bốc
// ngẫu nhiên, vì bốc ngẫu nhiên thì đoán mò cũng trúng.

const SO_CAU = 10;

type Cau = { am: AmIpa; tu: { en: string; ipa: string; vi: string }; chon: AmIpa[] };

const xao = <T,>(ds: T[]) => {
  const a = [...ds];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

function raDe(): Cau[] {
  return xao(IPA).slice(0, SO_CAU).map((am) => {
    const cungNhom = IPA.filter((x) => x.nhom === am.nhom && x.am !== am.am);
    // Âm "gần giống" trước: cùng hữu/vô thanh ngược nhau, hoặc số đo khẩu hình
    // gần nhau. Nhiễu càng giống thì nghe càng phải kỹ.
    const nhieu = xao(cungNhom).slice(0, 3);
    return { am, tu: am.viDu[Math.floor(Math.random() * am.viDu.length)], chon: xao([am, ...nhieu]) };
  });
}

export default function GameDoanAm({ onXong }: { onXong?: (am: string, dung: boolean) => void }) {
  const [de, setDe] = useState<Cau[]>([]);
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<string | null>(null);
  const [diem, setDiem] = useState(0);
  const [chuoi, setChuoi] = useState(0);
  const [chuoiDai, setChuoiDai] = useState(0);
  const doc = useRef(false);

  // Đề bốc ngẫu nhiên nên phải dựng ở trình duyệt, không dựng sẵn ở máy chủ —
  // dựng sẵn thì máy chủ và trình duyệt ra hai bộ đề khác nhau.
  useEffect(() => {
    const id = requestAnimationFrame(() => setDe(raDe()));
    return () => cancelAnimationFrame(id);
  }, []);

  const cau = de[i];

  const nghe = useCallback((cham = false) => {
    if (!cau) return;
    unlockAudio();
    stopSpeaking();
    (cham ? speakEnglishSlow : speakEnglish)(cau.tu.en);
  }, [cau]);

  // Sang câu mới thì đọc luôn, bé không phải bấm thêm.
  useEffect(() => {
    if (!cau || doc.current) return;
    doc.current = true;
    const t = setTimeout(() => { nghe(); doc.current = false; }, 250);
    return () => clearTimeout(t);
  }, [cau, nghe]);

  function chon(am: string) {
    if (pick || !cau) return;
    setPick(am);
    const dung = am === cau.am.am;
    if (dung) {
      setDiem((d) => d + 1);
      setChuoi((c) => { const n = c + 1; setChuoiDai((m) => Math.max(m, n)); return n; });
    } else {
      setChuoi(0);
    }
    onXong?.(cau.am.am, dung);
  }

  function tiep() {
    setPick(null);
    if (i + 1 >= de.length) { setDe(raDe()); setI(0); setDiem(0); setChuoi(0); }
    else setI(i + 1);
  }

  const vach = useMemo(() => (de.length ? ((i + (pick ? 1 : 0)) / de.length) * 100 : 0), [i, pick, de.length]);

  if (!cau) return <div className="h-40 animate-pulse rounded-3xl bg-slate-100" />;

  return (
    <div>
      {/* Thanh tiến độ + điểm */}
      <div className="flex items-center gap-3">
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-sky-500 transition-all duration-500"
               style={{ width: `${vach}%` }} />
        </div>
        <span className="shrink-0 text-sm font-black text-slate-700">Câu {i + 1}/{de.length}</span>
        <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-sm font-black text-amber-700">⭐ {diem}</span>
        {chuoi >= 2 && (
          <span className="shrink-0 rounded-full bg-orange-100 px-3 py-1 text-sm font-black text-orange-600 kid-bounce">
            🔥 {chuoi}
          </span>
        )}
      </div>

      {/* Nút nghe */}
      <div className="mt-5 flex flex-col items-center gap-3">
        <button
          onClick={() => nghe()}
          className="grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 text-4xl text-white shadow-lg transition active:scale-95"
          aria-label="Nghe lại từ"
        >
          🔊
        </button>
        <button onClick={() => nghe(true)} className="rounded-full border-2 border-slate-200 bg-white px-4 py-1.5 text-sm font-black text-slate-600">
          🐢 Nghe chậm
        </button>
        <p className="text-sm font-bold text-slate-500">Từ này chứa âm nào?</p>
      </div>

      {/* Bốn đáp án */}
      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {cau.chon.map((c) => {
          const dung = c.am === cau.am.am;
          const daChon = pick === c.am;
          let kieu = 'border-slate-200 bg-white text-slate-800';
          if (pick) {
            if (dung) kieu = 'border-emerald-400 bg-emerald-50 text-emerald-700';
            else if (daChon) kieu = 'border-rose-300 bg-rose-50 text-rose-600';
            else kieu = 'border-slate-100 bg-slate-50 text-slate-400';
          }
          return (
            <button
              key={c.am}
              onClick={() => chon(c.am)}
              disabled={!!pick}
              className={`rounded-2xl border-2 px-3 py-4 text-xl font-black transition ${kieu} ${!pick ? 'hover:-translate-y-0.5' : ''}`}
            >
              /{c.am}/
            </button>
          );
        })}
      </div>

      {/* Giải thích sau khi chọn */}
      {pick && (
        <div className={`mt-4 rounded-2xl border-2 p-4 ${pick === cau.am.am ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}>
          <p className="font-black text-slate-900">
            {pick === cau.am.am ? '🎉 Đúng rồi!' : '💡 Chưa đúng'} — <b>{cau.tu.en}</b> {cau.tu.ipa} ({cau.tu.vi})
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-700">
            Âm <b>/{cau.am.am}/</b> — {cau.am.cachDoc}. {cau.am.luuY}
          </p>
          <button onClick={tiep} className="mt-3 rounded-full bg-slate-900 px-5 py-2 text-sm font-black text-white">
            {i + 1 >= de.length ? 'Chơi lượt mới →' : 'Câu tiếp →'}
          </button>
          {i + 1 >= de.length && (
            <p className="mt-2 text-sm font-bold text-slate-600">
              Lượt này đúng {diem}/{de.length} câu · chuỗi dài nhất 🔥 {chuoiDai}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
