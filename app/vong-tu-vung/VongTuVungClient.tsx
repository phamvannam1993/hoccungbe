'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { CAC_LOP, chuDeTheoLop, type Lop, type VongTu } from '../lib/vongTuVung';
import { khoaAnhTuVung } from '../lib/anhTuVung';
import { speakEnThenVi, speakEnglishSlow, speakText, stopSpeaking, unlockAudio } from '../components/edu/utils/speech';
import Wheel from '../vong-tron-am/Wheel';
import HinhTu from '../vong-tron-am/HinhTu';
import type { VongAm } from '../lib/vongTronAm';

// Vòng tròn TỪ VỰNG TIẾNG ANH — cùng lối chơi với vòng tròn âm vần, đổi nội dung.
//
// Dùng lại nguyên `Wheel`: bánh xe, cách quay, ảnh trong múi đều giống hệt, chỉ
// khác chữ hiển thị. Viết lại một bánh xe thứ hai là tự chuốc hai chỗ phải sửa
// mỗi khi đổi giao diện.

const KEY = 'bhh_vong_tu_vung_v1';

export default function VongTuVungClient() {
  const [lop, setLop] = useState<Lop>(1);
  const [maVong, setMaVong] = useState<string | null>(null);
  const [chon, setChon] = useState<number | null>(null);
  const [moThe, setMoThe] = useState(false);
  const [daHoc, setDaHoc] = useState<Set<string>>(new Set());

  const chuDe = useMemo(() => chuDeTheoLop(lop), [lop]);
  const vong: VongTu | null = useMemo(() => {
    const tatCa = chuDe.flatMap((c) => c.vong);
    return tatCa.find((v) => v.ma === maVong) ?? tatCa[0] ?? null;
  }, [chuDe, maVong]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setDaHoc(new Set(JSON.parse(raw) as string[]));
    } catch { /* trình duyệt chặn lưu thì bỏ qua */ }
  }, []);

  useEffect(() => {
    const mo = () => unlockAudio();
    window.addEventListener('pointerdown', mo, { once: true });
    return () => window.removeEventListener('pointerdown', mo);
  }, []);

  const luu = useCallback((s: Set<string>) => {
    setDaHoc(s);
    try { localStorage.setItem(KEY, JSON.stringify([...s])); } catch { /* bỏ qua */ }
  }, []);

  if (!vong) return null;
  const tu = chon != null ? vong.tu[chon] : null;

  // `Wheel` nhận dạng dữ liệu của vòng tròn âm vần; bọc lại cho khớp.
  // Múi bánh xe hiện TỪ TIẾNG ANH — đó là thứ bé cần nhận mặt.
  const choWheel: VongAm = {
    am: vong.chuDe.emoji,
    doc: vong.chuDe.heading,
    nhom: 'don',
    mau: vong.mau,
    tu: vong.tu.map((w) => ({ tu: w.en, emoji: w.emoji, cau: w.vi })),
  };

  function chonTu(i: number) {
    setChon(i);
    setMoThe(true);
    stopSpeaking();
    // Đọc TIẾNG ANH rồi tới NGHĨA TIẾNG VIỆT: bé chưa đọc được chữ vẫn hiểu từ
    // vừa nghe là gì, không phải đoán qua hình.
    const w = vong!.tu[i];
    speakEnThenVi(w.en, w.vi);
  }

  function danhDauDaHoc(en: string) {
    const s = new Set(daHoc);
    s.add(`${vong!.chuDe.slug}:${en}`);
    luu(s);
  }

  const soDaHoc = vong.tu.filter((w) => daHoc.has(`${vong.chuDe.slug}:${w.en}`)).length;

  return (
    <div className="mx-auto w-full max-w-3xl px-3 pb-4 pt-4 sm:px-4">
      {/* Chọn LỚP */}
      <div className="mb-3 flex flex-wrap items-center justify-center gap-1.5">
        <span className="text-xs font-black uppercase tracking-wide text-slate-400">Lớp</span>
        {CAC_LOP.map((l) => (
          <button
            key={l}
            onClick={() => { setLop(l); setMaVong(null); setChon(null); setMoThe(false); stopSpeaking(); }}
            className={`h-9 w-9 rounded-xl text-sm font-black transition ${
              l === lop ? 'text-white' : 'bg-slate-100 text-slate-600'
            }`}
            style={l === lop ? { background: vong.mau, boxShadow: `0 3px 0 ${vong.mau}80` } : undefined}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Chọn CHỦ ĐỀ và vòng trong chủ đề */}
      <div className="mb-4 flex flex-wrap justify-center gap-1.5">
        {chuDe.map(({ chuDe: c, vong: ds }) => {
          const dangO = c.slug === vong.chuDe.slug;
          return ds.length === 1 ? (
            <button
              key={c.slug}
              onClick={() => { setMaVong(ds[0].ma); setChon(null); setMoThe(false); stopSpeaking(); }}
              className={`rounded-xl px-2.5 py-1.5 text-xs font-black transition ${
                dangO ? 'text-white' : 'bg-slate-100 text-slate-600'
              }`}
              style={dangO ? { background: vong.mau } : undefined}
            >
              {c.emoji} {c.heading}
            </button>
          ) : (
            <span key={c.slug} className={`inline-flex items-center gap-0.5 rounded-xl px-1 py-0.5 ${dangO ? 'bg-slate-100' : ''}`}>
              <span className="px-1 text-xs font-black text-slate-600">{c.emoji} {c.heading}</span>
              {/* Chủ đề nhiều từ được cắt thành nhiều vòng 10 từ; đánh số cho bé chọn. */}
              {ds.map((v) => (
                <button
                  key={v.ma}
                  onClick={() => { setMaVong(v.ma); setChon(null); setMoThe(false); stopSpeaking(); }}
                  className={`h-6 w-6 rounded-lg text-[11px] font-black transition ${
                    v.ma === vong.ma ? 'text-white' : 'bg-white text-slate-500 ring-1 ring-slate-200'
                  }`}
                  style={v.ma === vong.ma ? { background: vong.mau } : undefined}
                >
                  {v.thuTu}
                </button>
              ))}
            </span>
          );
        })}
      </div>

      {/* Tiến độ của vòng đang học */}
      <div className="mb-3 flex items-center gap-3">
        <span className="text-sm font-black text-slate-700">
          {vong.chuDe.emoji} {vong.chuDe.heading}
          {vong.tongVong > 1 && <span className="text-slate-400"> · phần {vong.thuTu}/{vong.tongVong}</span>}
        </span>
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full transition-all"
            style={{ width: `${(soDaHoc / vong.tu.length) * 100}%`, background: vong.mau }} />
        </div>
        <span className="text-sm font-black text-slate-500">{soDaHoc}/{vong.tu.length}</span>
      </div>

      <Wheel
        vong={choWheel}
        chon={chon}
        daHoc={new Set(vong.tu.filter((w) => daHoc.has(`${vong.chuDe.slug}:${w.en}`)).map((w) => w.en))}
        onChonTu={chonTu}
        onDocAm={() => { stopSpeaking(); speakText(vong.chuDe.heading); }}
        nhanXong="✓ Đã thuộc"
        nhanChua="🔊 Nghe đọc"
        chuGiua={vong.chuDe.emoji}
        nhanGiua={`🔊 ${vong.chuDe.heading}`}
        khoaAnhCuaTu={(en) => khoaAnhTuVung(vong.chuDe.slug, en)}
      />

      {/* Thẻ từ */}
      {moThe && tu && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4"
          onClick={() => { setMoThe(false); stopSpeaking(); }}>
          <div className="max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-[28px] bg-white p-4 shadow-2xl sm:p-5"
            onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded-full px-3 py-1 text-xs font-black text-white" style={{ background: vong.mau }}>
                {vong.chuDe.emoji} {vong.chuDe.heading}
              </span>
              <button onClick={() => { setMoThe(false); stopSpeaking(); }}
                aria-label="Đóng" className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500">✕</button>
            </div>

            <div className="grid place-items-center rounded-3xl py-6" style={{ background: `${vong.mau}14` }}>
              <HinhTu tu={tu.en} emoji={tu.emoji} co={128}
                lop="h-24 w-24 text-6xl sm:h-28 sm:w-28 sm:text-7xl"
                khoa={khoaAnhTuVung(vong.chuDe.slug, tu.en)} />
            </div>

            <p className="mt-4 text-center text-4xl font-black" style={{ color: vong.mau }}>{tu.en}</p>
            <p className="mt-1 text-center text-sm font-bold text-slate-400">{tu.ipa}</p>
            <p className="mt-1 text-center text-lg font-black text-slate-700">{tu.vi}</p>

            {tu.example && (
              <div className="mt-4 flex items-start gap-2 rounded-2xl border-2 border-amber-200 bg-amber-50 p-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-amber-900">{tu.example}</p>
                  {tu.exampleVi && <p className="mt-1 text-xs font-bold text-amber-700">{tu.exampleVi}</p>}
                </div>
                {/* Nghe cả câu ví dụ, kèm nghĩa nếu có — nghe từ trong câu mới nhớ được cách dùng. */}
                <button
                  onClick={() => { stopSpeaking(); speakEnThenVi(tu.example!, tu.exampleVi ?? ''); }}
                  aria-label="Nghe câu ví dụ"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-200 text-base text-amber-800"
                >
                  🔊
                </button>
              </div>
            )}

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button onClick={() => { stopSpeaking(); speakEnThenVi(tu.en, tu.vi); }}
                className="rounded-2xl py-3 text-sm font-black text-white" style={{ background: vong.mau }}>
                🔊 Anh + Việt
              </button>
              {/* Đọc chậm: bé mới học cần nghe rõ từng âm mới bắt chước được. */}
              <button onClick={() => { stopSpeaking(); speakEnglishSlow(tu.en); }}
                className="rounded-2xl border-2 border-slate-200 py-3 text-sm font-black text-slate-700">
                🐢 Chậm
              </button>
              <button onClick={() => { stopSpeaking(); speakText(tu.vi); }}
                className="rounded-2xl border-2 border-slate-200 py-3 text-sm font-black text-slate-700">
                🇻🇳 Nghĩa
              </button>
              <button onClick={() => { danhDauDaHoc(tu.en); setMoThe(false); }}
                className="rounded-2xl border-2 border-emerald-300 bg-emerald-50 py-3 text-sm font-black text-emerald-700">
                ✓ Thuộc
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
