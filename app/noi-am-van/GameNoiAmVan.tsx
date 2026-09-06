'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { VONG_AM, type VongAm, type TuVong } from '../lib/vongTronAm';
import { buocDanhVan } from '../lib/danhVan';
import HinhTu from '../vong-tron-am/HinhTu';
import { speakText, stopSpeaking, unlockAudio } from '../components/edu/utils/speech';

// GAME NỐI ÂM VẦN
//
// Mỗi ván lấy 4 từ của CÙNG MỘT ÂM: bên trái là hình, bên phải là chữ kèm gợi ý
// đánh vần. Bé bấm một chấm bên trái rồi một chấm bên phải để nối.
//
// Vì sao 4 từ cùng một âm chứ không trộn nhiều âm: trộn thì bé chỉ cần nhìn chữ
// cái đầu là đoán ra, không phải đọc. Cùng âm thì buộc bé đọc hết phần vần mới
// nối đúng — đó mới là thứ đang luyện.

const KEY = 'bhh_noi_am_van_v1';
const SO_CAU = 5;   // số ván một lượt chơi
const SO_CAP = 4;   // số cặp mỗi ván

type Ben = 'trai' | 'phai';
type Noi = { trai: number; phai: number };

/** Xáo rồi lấy n phần tử. */
function boc<T>(arr: T[], n: number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
}

const boDau = (s: string) => s.normalize('NFD').replace(/[̣̀́̃̉]/g, '').normalize('NFC');

/** Tiếng mang âm của vòng — gợi ý đánh vần đúng tiếng đó, không phải luôn tiếng đầu. */
function tiengMangAm(tu: string, vong: VongAm): string {
  const tieng = tu.split(' ');
  if (vong.nhom === 'nguyenam')
    return tieng.find((t) => boDau(t.toLowerCase()).includes(vong.am)) ?? tieng[0];
  return tieng.find((t) => t.toLowerCase().startsWith(vong.am)) ?? tieng[0];
}

type Van = { vong: VongAm; tu: TuVong[]; trai: number[]; phai: number[] };

function taoVan(vong: VongAm): Van {
  const tu = boc(vong.tu, SO_CAP);
  const idx = tu.map((_, i) => i);
  return { vong, tu, trai: boc(idx, SO_CAP), phai: boc(idx, SO_CAP) };
}

export default function GameNoiAmVan() {
  const [vanSo, setVanSo] = useState(0);
  const [van, setVan] = useState<Van | null>(null);
  const [noi, setNoi] = useState<Noi[]>([]);
  const [dangChon, setDangChon] = useState<{ ben: Ben; i: number } | null>(null);
  const [sai, setSai] = useState<Noi | null>(null);
  /** Cặp vừa nối đúng — dùng để bắn ngôi sao và cho thẻ nảy lên một nhịp. */
  const [vuaDung, setVuaDung] = useState<Noi | null>(null);
  const [diem, setDiem] = useState(0);
  const [xong, setXong] = useState(false);
  const [kyLuc, setKyLuc] = useState<number | null>(null);

  const dsVong = useRef<VongAm[]>([]);

  const batDau = useCallback(() => {
    dsVong.current = boc(VONG_AM.filter((v) => v.tu.length >= SO_CAP), SO_CAU);
    setVan(taoVan(dsVong.current[0]));
    setVanSo(0); setNoi([]); setDangChon(null); setSai(null); setDiem(0); setXong(false);
  }, []);

  useEffect(() => { batDau(); }, [batDau]);

  // Mở khoá âm thanh ở lần chạm đầu (iOS chặn phát tiếng khi chưa có thao tác).
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

  // ── Vẽ đường nối ───────────────────────────────────────────────────────────
  // Toạ độ phải ĐO trên màn hình chứ không tính được, vì thẻ cao thấp khác nhau
  // tuỳ độ dài chữ. Đo lại mỗi khi đổi ván hoặc đổi kích thước cửa sổ.
  const khung = useRef<HTMLDivElement | null>(null);
  const chamTrai = useRef<(HTMLElement | null)[]>([]);
  const chamPhai = useRef<(HTMLElement | null)[]>([]);
  const [doLai, setDoLai] = useState(0);

  useEffect(() => {
    const lam = () => setDoLai((n) => n + 1);
    window.addEventListener('resize', lam);
    const t = window.setTimeout(lam, 80); // chờ font xong mới đo
    return () => { window.removeEventListener('resize', lam); window.clearTimeout(t); };
  }, [van]);

  // Đo trong effect chứ không trong useMemo: đọc kích thước thẻ là chạm vào DOM,
  // việc đó phải làm SAU khi React vẽ xong, không phải trong lúc đang tính.
  const [duong, setDuong] = useState<{ d: string; mau: string; dai: number }[]>([]);
  useEffect(() => {
    const k = khung.current;
    const goc = k?.getBoundingClientRect();
    const tam = (el: HTMLElement | null) => {
      if (!el || !goc) return null;
      const a = el.getBoundingClientRect();
      return { x: a.left - goc.left + a.width / 2, y: a.top - goc.top + a.height / 2 };
    };
    const ds: { d: string; mau: string; dai: number }[] = [];
    const ve = (ti: number, pi: number, mau: string) => {
      const a = tam(chamTrai.current[ti]), b = tam(chamPhai.current[pi]);
      if (!a || !b) return;
      const dx = Math.max(28, Math.abs(b.x - a.x) * 0.45);
      // Độ dài xấp xỉ, đủ để đặt stroke-dasharray cho hiệu ứng vẽ dần.
      const dai = Math.hypot(b.x - a.x, b.y - a.y) * 1.25;
      ds.push({ d: `M ${a.x} ${a.y} C ${a.x + dx} ${a.y}, ${b.x - dx} ${b.y}, ${b.x} ${b.y}`, mau, dai });
    };
    for (const n of noi) ve(n.trai, n.phai, 'url(#nav-xanh)');
    if (sai) ve(sai.trai, sai.phai, '#ef4444');
    // Đặt state trong effect là ĐÚNG ở đây: toạ độ chỉ biết được sau khi React vẽ
    // xong, không thể tính ra từ props/state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDuong(ds);
  }, [noi, sai, doLai]);

  const doc = useCallback((text: string) => { stopSpeaking(); speakText(text); }, []);

  if (!van) return null;

  const daNoiTrai = (i: number) => noi.some((n) => n.trai === i);
  const daNoiPhai = (i: number) => noi.some((n) => n.phai === i);

  function vanTiep(diemMoi: number) {
    const tiep = vanSo + 1;
    if (tiep >= SO_CAU) {
      setXong(true);
      const moi = kyLuc == null ? diemMoi : Math.max(kyLuc, diemMoi);
      setKyLuc(moi);
      try { localStorage.setItem(KEY, JSON.stringify({ kyLuc: moi })); } catch { /* bỏ qua */ }
      return;
    }
    setVanSo(tiep);
    setVan(taoVan(dsVong.current[tiep]));
    setNoi([]); setDangChon(null); setSai(null);
  }

  function bam(ben: Ben, i: number) {
    if (xong || !van) return;
    if (ben === 'trai' ? daNoiTrai(i) : daNoiPhai(i)) return;

    if (!dangChon) { setDangChon({ ben, i }); setSai(null); return; }
    if (dangChon.ben === ben) { setDangChon({ ben, i }); return; }

    const trai = ben === 'trai' ? i : dangChon.i;
    const phai = ben === 'phai' ? i : dangChon.i;
    setDangChon(null);

    if (van.trai[trai] === van.phai[phai]) {
      const moi = [...noi, { trai, phai }];
      const diemMoi = diem + 1;
      setNoi(moi);
      setDiem(diemMoi);
      doc(van.tu[van.phai[phai]].tu);
      setVuaDung({ trai, phai });
      window.setTimeout(() => setVuaDung(null), 800);
      if (moi.length === SO_CAP) window.setTimeout(() => vanTiep(diemMoi), 900);
    } else {
      setSai({ trai, phai });
      window.setTimeout(() => setSai(null), 700);
    }
  }

  const mau = van.vong.mau;
  const tongCap = SO_CAU * SO_CAP;

  // ── Màn kết thúc ──────────────────────────────────────────────────────────
  if (xong) {
    const tron = diem === tongCap;
    const sao = diem >= tongCap ? 3 : diem >= tongCap * 0.75 ? 2 : diem >= tongCap * 0.5 ? 1 : 0;
    return (
      <div className="mx-auto max-w-md px-4 py-10 text-center">
        <div className="relative mx-auto grid h-40 w-40 place-items-center">
          {/* Vầng sáng sau cúp — cho cảm giác "lên bục" */}
          <div
            className="absolute inset-0 rounded-full blur-2xl"
            style={{ background: `radial-gradient(circle, ${mau}66 0%, transparent 70%)` }}
          />
          <div className="nav-troi relative text-8xl" aria-hidden>{tron ? '🏆' : sao >= 2 ? '🎉' : '💪'}</div>
        </div>

        <div className="mt-1 flex justify-center gap-1 text-4xl" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span key={i} className={i < sao ? 'nav-bung' : 'opacity-25 grayscale'} style={{ animationDelay: `${i * 120}ms` }}>⭐</span>
          ))}
        </div>

        <h2 className="chu-mau mt-3 text-3xl font-black text-slate-800">
          {tron ? 'Giỏi quá! Đúng hết!' : sao >= 2 ? 'Chơi tốt lắm!' : 'Cố lên nào!'}
        </h2>
        <p className="mt-2 text-lg font-black text-slate-600">
          Nối đúng <span style={{ color: mau }}>{diem}</span> / {tongCap} cặp
        </p>
        {kyLuc != null && <p className="mt-1 text-sm font-bold text-slate-400">Kỷ lục của bé: {kyLuc} ⭐</p>}

        <button
          onClick={batDau}
          className="mt-6 w-full rounded-3xl py-4 text-lg font-black text-white transition active:translate-y-1"
          style={{ background: `linear-gradient(180deg, ${mau} 0%, ${mau}cc 100%)`, boxShadow: `0 6px 0 ${mau}80` }}
        >
          🔁 Chơi ván mới
        </button>
        <Link
          href="/vong-tron-am"
          className="mt-3 block rounded-3xl border-2 border-white bg-white/70 py-3 text-sm font-black text-slate-600 backdrop-blur"
        >
          🎡 Về vòng tròn âm vần
        </Link>
      </div>
    );
  }

  // ── Kiểu thẻ theo trạng thái ──────────────────────────────────────────────
  const theThe = (xongCap: boolean, chon: boolean) =>
    xongCap
      ? 'border-emerald-300 bg-gradient-to-br from-emerald-50 to-white shadow-[0_4px_0_#6ee7b7]'
      : chon
        ? 'border-violet-400 bg-white shadow-[0_4px_0_#c4b5fd] -translate-y-0.5'
        : 'border-white bg-white/80 shadow-[0_4px_0_rgba(148,163,184,.28)] hover:-translate-y-0.5';

  return (
    <div className="mx-auto w-full max-w-3xl px-2 pb-8 pt-3 sm:px-4">
      {/* ── Bảng điều khiển trên cùng ───────────────────────────────────── */}
      <div className="mb-3 rounded-[22px] border-2 border-white bg-white/70 p-2.5 shadow-lg shadow-violet-100 backdrop-blur sm:mb-4 sm:rounded-[26px] sm:p-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <span
            className="chu-mau grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-2xl font-black text-white sm:h-14 sm:w-14 sm:text-3xl"
            style={{ background: `linear-gradient(160deg, ${mau} 0%, ${mau}bb 100%)`, boxShadow: `0 4px 0 ${mau}70` }}
          >
            {van.vong.am}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black uppercase tracking-wide text-slate-400 sm:text-xs">
              Ván {vanSo + 1}/{SO_CAU} · nối từ có âm này
            </p>
            {/* Thanh tiến độ: mỗi ván một ô, ô đang chơi sáng màu của vòng */}
            <div className="mt-1.5 flex gap-1">
              {Array.from({ length: SO_CAU }, (_, i) => (
                <span
                  key={i}
                  className="h-2.5 flex-1 rounded-full transition-all"
                  style={{ background: i < vanSo ? '#34d399' : i === vanSo ? mau : '#e2e8f0' }}
                />
              ))}
            </div>
          </div>
          <span className="shrink-0 rounded-2xl bg-amber-100 px-3 py-1.5 text-center">
            <span className="block text-lg font-black leading-none text-amber-600">{diem}</span>
            <span className="block text-[10px] font-black uppercase text-amber-500">đúng</span>
          </span>
        </div>
      </div>

      <div ref={khung} className="relative">
        {/* Đường nối nằm DƯỚI thẻ và không nhận chuột, để không chắn nút bấm */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <linearGradient id="nav-xanh" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <filter id="nav-sang" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="mo" />
              <feMerge><feMergeNode in="mo" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {duong.map((l, i) => (
            <path
              key={i}
              className="nav-duong"
              d={l.d}
              fill="none"
              stroke={l.mau}
              strokeWidth={6}
              strokeLinecap="round"
              filter="url(#nav-sang)"
              style={{ ['--dai' as string]: l.dai, strokeDasharray: l.dai }}
            />
          ))}
        </svg>

        <div className="grid grid-cols-2 gap-1.5 sm:gap-5">
          {/* CỘT TRÁI — hình. Tên từ chỉ hiện sau khi nối đúng, để bé phải nhìn hình mà đoán. */}
          <ul className="grid gap-2 sm:gap-3">
            {van.trai.map((tuIdx, i) => {
              const xongCap = daNoiTrai(i);
              const w = van.tu[tuIdx];
              const chon = dangChon?.ben === 'trai' && dangChon.i === i;
              return (
                <li key={i} className={sai?.trai === i ? 'nav-rung' : vuaDung?.trai === i ? 'nav-bung' : ''}>
                  <button
                    onClick={() => bam('trai', i)}
                    disabled={xongCap}
                    className={`flex w-full items-center gap-1.5 rounded-2xl border-2 p-1.5 text-left transition-all sm:gap-3 sm:rounded-3xl sm:p-2.5 ${theThe(xongCap, chon)}`}
                  >
                    <span
                      className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl sm:h-16 sm:w-16 sm:rounded-2xl"
                      style={{ background: `${mau}18` }}
                    >
                      <HinhTu tu={w.tu} emoji={w.emoji} anh={w.anh} co={64} lop="h-9 w-9 text-2xl sm:h-14 sm:w-14 sm:text-4xl" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[9px] font-black uppercase tracking-widest text-slate-300">Hình {i + 1}</span>
                      <span className={`chu-mau block break-words text-xs font-black uppercase leading-tight sm:text-lg ${xongCap ? 'text-slate-800' : 'text-slate-300'}`}>
                        {xongCap ? w.tu : '? ? ?'}
                      </span>
                    </span>
                    <span className="relative grid h-4 w-4 shrink-0 place-items-center sm:h-5 sm:w-5">
                      {chon && <span className="nav-toa absolute inset-0 rounded-full bg-violet-400" />}
                      <span
                        ref={(el) => { chamTrai.current[i] = el; }}
                        className={`relative h-3 w-3 rounded-full border-2 transition sm:h-4 sm:w-4 sm:border-[3px] ${
                          xongCap ? 'border-emerald-400 bg-emerald-400'
                            : chon ? 'border-violet-500 bg-violet-500'
                              : 'border-slate-300 bg-white'
                        }`}
                      />
                      {vuaDung?.trai === i && <span className="nav-sao absolute -right-2 -top-2 text-sm" aria-hidden>✨</span>}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* CỘT PHẢI — chữ + gợi ý đánh vần + nút nghe */}
          <ul className="grid gap-2 sm:gap-3">
            {van.phai.map((tuIdx, i) => {
              const xongCap = daNoiPhai(i);
              const w = van.tu[tuIdx];
              const chon = dangChon?.ben === 'phai' && dangChon.i === i;
              const buoc = buocDanhVan(tiengMangAm(w.tu, van.vong));
              return (
                <li key={i} className={sai?.phai === i ? 'nav-rung' : vuaDung?.phai === i ? 'nav-bung' : ''}>
                  <div className={`flex items-center gap-1.5 rounded-2xl border-2 p-1.5 transition-all sm:gap-3 sm:rounded-3xl sm:p-2.5 ${theThe(xongCap, chon)}`}>
                    <span className="relative grid h-4 w-4 shrink-0 place-items-center sm:h-5 sm:w-5">
                      {chon && <span className="nav-toa absolute inset-0 rounded-full bg-violet-400" />}
                      <span
                        ref={(el) => { chamPhai.current[i] = el; }}
                        className={`relative h-3 w-3 rounded-full border-2 transition sm:h-4 sm:w-4 sm:border-[3px] ${
                          xongCap ? 'border-emerald-400 bg-emerald-400'
                            : chon ? 'border-violet-500 bg-violet-500'
                              : 'border-slate-300 bg-white'
                        }`}
                      />
                      {vuaDung?.phai === i && <span className="nav-sao absolute -left-2 -top-2 text-sm" aria-hidden>✨</span>}
                    </span>
                    <button onClick={() => bam('phai', i)} disabled={xongCap} className="min-w-0 flex-1 py-0.5 text-right">
                      <span className="chu-mau block break-words text-xs font-black uppercase leading-tight sm:text-lg" style={{ color: xongCap ? '#0f172a' : mau }}>
                        {w.tu}
                      </span>
                      <span className="mt-0.5 block break-words text-[9px] font-bold leading-snug text-slate-400 sm:text-xs">
                        {buoc.slice(0, -1).join(' – ')} <span style={{ color: mau }}>→ {buoc[buoc.length - 1]}</span>
                      </span>
                    </button>
                    {/* Nút nghe TÁCH RIÊNG khỏi nút nối: bé nghe thử mà không lỡ nối nhầm. */}
                    <button
                      onClick={() => doc(w.tu)}
                      aria-label={`Nghe đọc từ ${w.tu}`}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-xl text-sm text-white transition active:scale-90 sm:h-10 sm:w-10 sm:rounded-2xl sm:text-lg"
                      style={{ background: `linear-gradient(160deg, ${mau} 0%, ${mau}bb 100%)` }}
                    >
                      🔊
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <p className="mt-4 text-center text-[11px] font-bold leading-relaxed text-slate-400 sm:mt-5 sm:text-xs">
        Bấm một ô bên trái rồi một ô bên phải để nối
        <span className="hidden sm:inline"> · </span>
        <span className="block sm:inline">Bấm 🔊 để nghe thử</span>
      </p>
    </div>
  );
}
