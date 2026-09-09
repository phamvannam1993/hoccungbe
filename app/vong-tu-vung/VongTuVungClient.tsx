'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
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
    <div className="mx-auto w-full max-w-3xl overflow-x-hidden px-3 pb-4 pt-3 sm:px-4">
      {/* Chọn LỚP */}
      <div className="mb-3 flex flex-wrap items-center justify-center gap-1.5">
        <span className="text-xs font-black uppercase tracking-wide text-slate-400">Lớp</span>
        {CAC_LOP.map((l) => (
          <button
            key={l}
            onClick={() => { setLop(l); setMaVong(null); setChon(null); setMoThe(false); stopSpeaking(); }}
            className={`h-9 w-9 rounded-xl text-sm font-black transition-all ${
              l === lop ? 'scale-105 text-white' : 'bg-white text-slate-600 shadow-[0_3px_0_rgba(148,163,184,.22)] hover:-translate-y-0.5'
            }`}
            style={l === lop ? { background: vong.mau, boxShadow: `0 3px 0 ${vong.mau}80` } : undefined}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Chọn CHỦ ĐỀ — lưới 2 cột trên điện thoại.
          Trước đây in luôn nút số phần của MỌI chủ đề ngay tại đây; riêng "Động
          vật" đã 25 phần, cộng 10 chủ đề thành hơn 60 nút chen nhau, màn hình
          nhỏ vỡ hẳn. Giờ tách làm hai bước: chọn chủ đề trước, chọn phần sau. */}
      <div className="mb-2 grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-5">
        {chuDe.map(({ chuDe: c, vong: ds }) => {
          const dangO = c.slug === vong.chuDe.slug;
          return (
            <button
              key={c.slug}
              onClick={() => { setMaVong(ds[0].ma); setChon(null); setMoThe(false); stopSpeaking(); }}
              className={`flex min-w-0 items-center gap-1 rounded-xl px-2 py-2 text-left text-[11px] font-black transition-all sm:text-xs ${
                dangO ? 'text-white' : 'bg-white text-slate-600 shadow-[0_3px_0_rgba(148,163,184,.20)] hover:-translate-y-0.5'
              }`}
              style={dangO ? { background: vong.mau } : undefined}
            >
              <span className="shrink-0 text-base" aria-hidden>{c.emoji}</span>
              <span className="truncate">{c.heading}</span>
            </button>
          );
        })}
      </div>

      {/* Chọn PHẦN trong chủ đề — chỉ hiện khi chủ đề bị cắt thành nhiều vòng.
          Cho cuộn ngang vì chủ đề lớn có tới 25 phần. */}
      {vong.tongVong > 1 && (
        <div className="-mx-3 mb-3 flex items-center gap-1 overflow-x-auto px-3 pb-1 sm:mx-0 sm:px-0">
          <span className="shrink-0 pr-1 text-[10px] font-black uppercase tracking-wide text-slate-400">Phần</span>
          {chuDe.find((c) => c.chuDe.slug === vong.chuDe.slug)?.vong.map((v) => (
            <button
              key={v.ma}
              onClick={() => { setMaVong(v.ma); setChon(null); setMoThe(false); stopSpeaking(); }}
              className={`h-7 w-7 shrink-0 rounded-lg text-[11px] font-black transition ${
                v.ma === vong.ma ? 'text-white' : 'bg-white text-slate-500 ring-1 ring-slate-200'
              }`}
              style={v.ma === vong.ma ? { background: vong.mau } : undefined}
            >
              {v.thuTu}
            </button>
          ))}
        </div>
      )}

      {/* Tiến độ của vòng đang học */}
      <div className="mb-3 flex items-center gap-2 sm:gap-3">
        <span className="min-w-0 shrink-0 truncate text-xs font-black text-slate-700 sm:text-sm">
          {vong.chuDe.emoji} {vong.chuDe.heading}
          {vong.tongVong > 1 && <span className="text-slate-400"> · {vong.thuTu}/{vong.tongVong}</span>}
        </span>
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full transition-all"
            style={{ width: `${(soDaHoc / vong.tu.length) * 100}%`, background: vong.mau }} />
        </div>
        <span className="shrink-0 text-xs font-black text-slate-500 sm:text-sm">{soDaHoc}/{vong.tu.length}</span>
      </div>

      {/* Lối sang game nghe: học xong một vòng thì có chỗ kiểm lại ngay. */}
      <Link
        href="/luyen-nghe"
        className="mb-3 flex items-center justify-center gap-2 rounded-2xl border-2 border-violet-200 bg-violet-50 py-2.5 text-sm font-black text-violet-600"
      >
        🎧 Chơi game luyện nghe
      </Link>

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
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/55 p-3 backdrop-blur-sm sm:p-4"
          onClick={() => { setMoThe(false); stopSpeaking(); }}>
          <div
            className="nav-bung max-h-[92dvh] w-full max-w-md overflow-hidden overflow-y-auto rounded-[32px] bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Dải màu đầu thẻ mang màu của chủ đề — mở ra là biết ngay đang ở đâu. */}
            <div className="relative px-4 pb-14 pt-3.5 sm:px-5"
              style={{ background: `linear-gradient(160deg, ${vong.mau} 0%, ${vong.mau}cc 100%)` }}>
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-white/25 text-lg">
                  {vong.chuDe.emoji}
                </span>
                <span className="min-w-0 truncate text-sm font-black text-white/90">{vong.chuDe.heading}</span>
                {daHoc.has(`${vong.chuDe.slug}:${tu.en}`) && (
                  <span className="shrink-0 rounded-full bg-white/25 px-2.5 py-1 text-[11px] font-black text-white">
                    ✓ Đã thuộc
                  </span>
                )}
                <button onClick={() => { setMoThe(false); stopSpeaking(); }}
                  aria-label="Đóng"
                  className="ml-auto grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/25 text-lg text-white transition hover:bg-white/40">
                  ✕
                </button>
              </div>
            </div>

            {/* PHẢI có relative + z-10: dải màu ở trên có `relative`, mà phần tử được
                định vị luôn vẽ đè lên phần tử thường — thiếu là ảnh bị che mất nửa trên. */}
            <div className="relative z-10 -mt-11 px-4 sm:px-5">
              <div className="mx-auto grid h-32 w-32 place-items-center rounded-[28px] border-4 border-white bg-white shadow-lg sm:h-36 sm:w-36">
                <div className="grid h-full w-full place-items-center rounded-[22px]" style={{ background: `${vong.mau}12` }}>
                  <HinhTu tu={tu.en} emoji={tu.emoji} co={144}
                    lop="h-24 w-24 text-6xl sm:h-28 sm:w-28 sm:text-7xl"
                    khoa={khoaAnhTuVung(vong.chuDe.slug, tu.en)} />
                </div>
              </div>
            </div>

            <div className="px-4 pb-5 pt-3 sm:px-5">
              <p className="chu-mau text-center text-[40px] font-black leading-none" style={{ color: vong.mau }}>
                {tu.en}
              </p>
              {/* Phiên âm trong khung riêng: đây là thứ ba mẹ đọc mẫu cho con,
                  để lẫn vào dòng chữ thường thì rất dễ lướt qua. */}
              <p className="mt-2 text-center">
                <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-500">
                  {tu.ipa}
                </span>
              </p>
              <p className="mt-2 text-center text-xl font-black text-slate-800">{tu.vi}</p>

              {tu.example && (
                <div className="mt-4 flex items-start gap-2 rounded-[22px] border-2 border-amber-200 bg-gradient-to-b from-amber-50 to-white p-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-amber-900">{tu.example}</p>
                    {tu.exampleVi && <p className="mt-1 text-xs font-bold text-amber-700">{tu.exampleVi}</p>}
                  </div>
                  {/* Nghe cả câu ví dụ, kèm nghĩa — nghe từ trong câu mới nhớ cách dùng. */}
                  <button
                    onClick={() => { stopSpeaking(); speakEnThenVi(tu.example!, tu.exampleVi ?? ''); }}
                    aria-label="Nghe câu ví dụ"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-200 text-base text-amber-800 transition active:translate-y-0.5"
                  >
                    🔊
                  </button>
                </div>
              )}

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button onClick={() => { stopSpeaking(); speakEnThenVi(tu.en, tu.vi); }}
                  className="rounded-2xl py-3 text-sm font-black text-white transition active:translate-y-0.5"
                  style={{ background: vong.mau, boxShadow: `0 4px 0 ${vong.mau}99` }}>
                  🔊 Anh + Việt
                </button>
                {/* Đọc chậm: bé mới học cần nghe rõ từng âm mới bắt chước được. */}
                <button onClick={() => { stopSpeaking(); speakEnglishSlow(tu.en); }}
                  className="rounded-2xl border-2 border-slate-200 bg-white py-3 text-sm font-black text-slate-700 transition active:translate-y-0.5"
                  style={{ boxShadow: '0 4px 0 rgba(148,163,184,.28)' }}>
                  🐢 Chậm
                </button>
                <button onClick={() => { stopSpeaking(); speakText(tu.vi); }}
                  className="rounded-2xl border-2 border-slate-200 bg-white py-3 text-sm font-black text-slate-700 transition active:translate-y-0.5"
                  style={{ boxShadow: '0 4px 0 rgba(148,163,184,.28)' }}>
                  🇻🇳 Nghĩa
                </button>
                <button onClick={() => { danhDauDaHoc(tu.en); setMoThe(false); }}
                  className="rounded-2xl border-2 border-emerald-300 bg-emerald-50 py-3 text-sm font-black text-emerald-700 transition active:translate-y-0.5"
                  style={{ boxShadow: '0 4px 0 rgba(16,185,129,.35)' }}>
                  ✓ Thuộc
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
