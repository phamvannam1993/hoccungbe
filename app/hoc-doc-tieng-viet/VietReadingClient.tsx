'use client';

import { useEffect, useState } from 'react';
import { VN_LETTERS, THANH_DEMOS, DANH_VAN, VAN_GROUPS } from '../lib/vietReading';
import { speakText, speakSequence, unlockAudio, stopSpeaking } from '../components/edu/utils/speech';

type Mode = 'chu-cai' | 'danh-van' | 'van';

const LC = [
  'border-pink-200 bg-pink-50 text-pink-600',
  'border-sky-200 bg-sky-50 text-sky-600',
  'border-amber-200 bg-amber-50 text-amber-600',
  'border-emerald-200 bg-emerald-50 text-emerald-600',
  'border-violet-200 bg-violet-50 text-violet-600',
  'border-orange-200 bg-orange-50 text-orange-600',
];

function say(text: string) {
  unlockAudio();
  speakText(text);
}
function danhVan(pieces: string[]) {
  unlockAudio();
  speakSequence(pieces.map((p) => ({ text: p, lang: 'vi' as const })));
}

// Đánh vần một VẦN thành MỘT câu liền mạch: [âm chính] [âm cuối] [vần]. Ví dụ "ăm" = "ă mờ ăm".
// Đọc liền mạch nghe tự nhiên hơn đọc rời, và tách nguyên âm đôi (iê→i ê) cho rõ.
const END_MAP: Record<string, string> = { ng: 'ngờ', nh: 'nhờ', ch: 'chờ', c: 'cờ', n: 'nờ', m: 'mờ', p: 'pờ', t: 'tờ' };
const DIPH: Record<string, string> = {
  iê: 'i ê', yê: 'i ê', uô: 'u ô', ươ: 'ư ơ', ia: 'i a', ua: 'u a', ưa: 'ư a',
  oa: 'o a', oe: 'o e', uê: 'u ê', uy: 'u i', oai: 'o a i', oay: 'o a i',
};
// Thêm dấu SẮC vào nguyên âm cuối của âm chính (vần trắc mới đọc được: ưc→ức, uôc→uốc).
const SAC: Record<string, string> = { a: 'á', ă: 'ắ', â: 'ấ', e: 'é', ê: 'ế', i: 'í', o: 'ó', ô: 'ố', ơ: 'ớ', u: 'ú', ư: 'ứ', y: 'ý' };
const STOP = ['ch', 'c', 't', 'p']; // âm cuối tắc → vần trắc
function addSac(s: string): string {
  const last = s[s.length - 1];
  return SAC[last] ? s.slice(0, -1) + SAC[last] : s;
}
function vanReadString(van: string): string {
  let endLetters = '';
  let endRead = '';
  let main = van;
  for (const e of ['ng', 'nh', 'ch', 'c', 'n', 'm', 'p', 't']) {
    if (van.endsWith(e) && van.length > e.length) {
      endLetters = e;
      endRead = END_MAP[e];
      main = van.slice(0, van.length - e.length);
      break;
    }
  }
  if (!endRead) {
    // Vần chỉ có nguyên âm (ai, ưa, uê, oai…): đánh vần từng nguyên âm rồi cả vần (a i ai).
    const tokens = van.split('').map((c) => (c === 'y' ? 'i' : c)).join(' ');
    return `${tokens} ${van}`;
  }
  const mainRead = DIPH[main] || main;
  // Vần trắc (âm cuối c/ch/t/p) đọc tiếng cuối có dấu sắc; vần bằng giữ nguyên vần.
  const finalTieng = STOP.includes(endLetters) ? addSac(main) + endLetters : van;
  return `${mainRead} ${endRead} ${finalTieng}`;
}
function readVan(van: string) {
  unlockAudio();
  speakText(vanReadString(van));
}

export default function VietReadingClient() {
  const [mode, setMode] = useState<Mode>('chu-cai');

  useEffect(() => () => stopSpeaking(), []);

  const TABS: { k: Mode; label: string }[] = [
    { k: 'chu-cai', label: '🔤 Bảng chữ cái' },
    { k: 'danh-van', label: '🔨 Đánh vần & dấu thanh' },
    { k: 'van', label: '🧩 Bảng vần' },
  ];

  return (
    <div className="mt-6">
      <div className="inline-flex flex-wrap gap-1 rounded-2xl bg-white p-1 shadow-sm ring-1 ring-slate-100">
        {TABS.map((t) => (
          <button
            key={t.k}
            type="button"
            onClick={() => { unlockAudio(); stopSpeaking(); setMode(t.k); }}
            className={`rounded-xl px-4 py-2 text-sm font-black transition ${mode === t.k ? 'bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 1) BẢNG CHỮ CÁI */}
      {mode === 'chu-cai' && (
        <>
          <p className="mt-3 rounded-2xl bg-pink-50 px-4 py-2 text-sm font-semibold text-pink-700">
            Bấm chữ để nghe <b>tên chữ</b>, bấm “âm” để nghe âm khi ghép vần, bấm từ mẫu để nghe cả từ. 29 chữ cái tiếng Việt.
          </p>
          <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {VN_LETTERS.map((l, i) => (
              <li key={l.char} className={`flex flex-col gap-2 rounded-3xl border-2 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${LC[i % LC.length]}`}>
                <div className="flex items-center justify-between">
                  <button type="button" onClick={() => say(l.ten.replace(/-/g, ' '))} className="text-4xl font-black leading-none transition hover:scale-110" aria-label={`Nghe tên chữ ${l.char}`}>
                    {l.char.toUpperCase()}{l.char}
                  </button>
                  <span className="text-right text-xs font-bold text-slate-500">
                    <span className="block">tên: {l.ten}</span>
                    <button type="button" onClick={() => say(l.am)} className="rounded-full bg-white/70 px-2 py-0.5 font-black text-slate-600 shadow-sm ring-1 ring-slate-100 transition hover:bg-white" aria-label={`Nghe âm ${l.am}`}>
                      🔊 âm: {l.am}
                    </button>
                  </span>
                </div>
                <button type="button" onClick={() => say(l.word)} className="flex items-center gap-2 rounded-2xl bg-white/70 px-3 py-2 text-left transition hover:bg-white" aria-label={`Nghe từ ${l.word}`}>
                  <span className="text-2xl" aria-hidden>{l.emoji}</span>
                  <span className="font-black text-slate-800">{l.word}</span>
                  <span className="ml-auto text-sky-400" aria-hidden>🔊</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* 2) ĐÁNH VẦN & DẤU THANH */}
      {mode === 'danh-van' && (
        <>
          <p className="mt-3 rounded-2xl bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
            6 dấu thanh làm đổi nghĩa của tiếng. Bấm từng tiếng để nghe, so sánh các thanh.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {THANH_DEMOS.map((d) => (
              <div key={d.base} className="rounded-3xl border-2 border-amber-100 bg-white p-4 shadow-sm">
                <h3 className="mb-2 font-black text-slate-800 kid-display">Tiếng gốc: “{d.base}” + 6 thanh</h3>
                <ul className="grid grid-cols-3 gap-2">
                  {d.items.map((it) => (
                    <li key={it.tieng}>
                      <button type="button" onClick={() => say(it.tieng)} className="w-full rounded-2xl border-2 border-amber-200 bg-amber-50 px-2 py-2 text-center transition hover:-translate-y-0.5" aria-label={`Nghe ${it.tieng}`}>
                        <span className="block text-2xl font-black text-amber-700">{it.tieng}</span>
                        <span className="block text-[11px] font-semibold text-slate-500">{it.vi}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <h3 className="mt-6 text-lg font-black text-slate-900 kid-display">🔨 Tập đánh vần</h3>
          <p className="mb-3 text-sm font-semibold text-slate-500">Bấm 🐢 để nghe đánh vần từng bước, bấm tiếng để nghe đọc trơn.</p>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {DANH_VAN.map((w) => (
              <li key={w.tieng} className="flex flex-col gap-2 rounded-3xl border-2 border-sky-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <button type="button" onClick={() => say(w.tieng)} className="flex flex-col items-center gap-1" aria-label={`Nghe ${w.tieng}`}>
                  <span className="text-4xl" aria-hidden>{w.emoji}</span>
                  <span className="text-3xl font-black text-slate-800">{w.tieng}</span>
                  <span className="text-sm font-bold text-emerald-600">{w.vi}</span>
                </button>
                <div className="text-center text-xs font-semibold text-slate-400">{w.pieces.join(' – ')}</div>
                <button type="button" onClick={() => danhVan(w.pieces)} className="mt-auto rounded-full bg-gradient-to-r from-amber-400 to-orange-400 px-3 py-1.5 text-sm font-black text-white shadow transition hover:brightness-105 active:scale-95">
                  🐢 Đánh vần
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* 3) BẢNG VẦN */}
      {mode === 'van' && (
        <>
          <p className="mt-3 rounded-2xl bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700">
            Bấm vần để nghe <b>đánh vần</b> (ví dụ: ă – mờ – ăm), bấm từ để nghe cả từ. Vần thường gặp ở lớp 1.
          </p>
          <div className="mt-4 space-y-4">
            {VAN_GROUPS.map((g) => (
              <div key={g.label} className="rounded-3xl border-2 border-violet-100 bg-white p-4 shadow-sm">
                <h3 className="mb-3 font-black text-violet-700 kid-display">{g.label}</h3>
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  {g.items.map((it) => (
                    <li key={it.van} className="rounded-2xl border-2 border-violet-200 bg-violet-50/50 p-3 text-center">
                      <button type="button" onClick={() => readVan(it.van)} className="text-2xl font-black text-violet-700 transition hover:scale-110" aria-label={`Đánh vần ${it.van}`}>
                        {it.van}
                      </button>
                      <button type="button" onClick={() => say(it.word)} className="mt-1 flex w-full items-center justify-center gap-1 rounded-xl bg-white px-2 py-1 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50" aria-label={`Nghe từ ${it.word}`}>
                        <span aria-hidden>{it.emoji}</span> {it.word} <span className="text-sky-400" aria-hidden>🔊</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
