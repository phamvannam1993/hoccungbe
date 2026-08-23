'use client';

import { useEffect, useState } from 'react';
import { TAP_LAM_VAN } from '../lib/tapLamVan';
import { speakText, speakSequence, unlockAudio, stopSpeaking } from '../components/edu/utils/speech';

export default function TapLamVanClient() {
  const [ti, setTi] = useState(0);
  const [text, setText] = useState('');
  const t = TAP_LAM_VAN[ti];
  const KEY = `tlv-${t.slug}`;

  useEffect(() => () => stopSpeaking(), []);
  // Nạp bài viết đã lưu khi đổi đề.
  useEffect(() => {
    try { setText(localStorage.getItem(KEY) || ''); } catch { setText(''); }
  }, [KEY]);

  const onChange = (v: string) => {
    setText(v);
    try { localStorage.setItem(KEY, v); } catch { /* noop */ }
  };
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const readAll = () => { unlockAudio(); speakSequence(t.baiMau.map((c) => ({ text: c, lang: 'vi' as const }))); };

  return (
    <div className="mt-6">
      {/* Chọn đề */}
      <div className="flex flex-wrap gap-2">
        {TAP_LAM_VAN.map((x, i) => (
          <button
            key={x.slug}
            type="button"
            onClick={() => { unlockAudio(); stopSpeaking(); setTi(i); }}
            className={`rounded-full border-2 px-4 py-2 text-sm font-black transition ${
              i === ti ? 'border-transparent bg-gradient-to-r from-emerald-500 to-sky-500 text-white shadow' : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300'
            }`}
          >
            {x.emoji} {x.title}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-3xl border-2 border-emerald-100 bg-white p-5 shadow-sm">
        <p className="text-sm font-black uppercase tracking-wide text-emerald-600">Đề bài</p>
        <h2 className="mt-0.5 text-xl font-black text-slate-900 kid-display">{t.emoji} {t.title}</h2>
      </div>

      {/* Dàn ý */}
      <div className="mt-4 rounded-3xl border-2 border-sky-100 bg-sky-50/60 p-5">
        <h3 className="text-lg font-black text-slate-900 kid-display">🧭 Dàn ý gợi ý</h3>
        <div className="mt-2 space-y-2 text-slate-700">
          <p><span className="font-black text-sky-700">Mở bài: </span>{t.danY.moBai}</p>
          <div>
            <span className="font-black text-sky-700">Thân bài:</span>
            <ul className="mt-1 list-disc pl-6">
              {t.danY.thanBai.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          </div>
          <p><span className="font-black text-sky-700">Kết bài: </span>{t.danY.ketBai}</p>
        </div>
      </div>

      {/* Từ gợi ý */}
      <div className="mt-4">
        <h3 className="mb-2 text-lg font-black text-slate-900 kid-display">✨ Từ ngữ gợi ý (bấm để nghe)</h3>
        <div className="flex flex-wrap gap-2">
          {t.tuGoiY.map((w) => (
            <button key={w} type="button" onClick={() => { unlockAudio(); speakText(w); }} className="rounded-full border-2 border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-700 transition hover:-translate-y-0.5">
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* Bài văn mẫu */}
      <div className="mt-4 overflow-hidden rounded-3xl border-2 border-violet-100 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 p-4 text-white">
          <h3 className="text-lg font-black">📄 Bài văn mẫu</h3>
          <button type="button" onClick={readAll} className="rounded-full bg-white px-4 py-2 text-sm font-black text-violet-700 shadow ring-1 ring-black/5">🔊 Nghe bài mẫu</button>
        </div>
        <div className="p-5 leading-8 text-slate-800">
          {t.baiMau.map((c, i) => (
            <span key={i} role="button" tabIndex={0} onClick={() => { unlockAudio(); speakText(c); }} className="cursor-pointer rounded hover:bg-violet-50" title="Bấm nghe câu">
              {c}{' '}
            </span>
          ))}
        </div>
      </div>

      {/* Ô cho bé tự viết */}
      <div className="mt-4 rounded-3xl border-2 border-emerald-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 kid-display">✍️ Em tự viết bài của mình</h3>
          <span className="text-sm font-bold text-slate-400">{wordCount} từ</span>
        </div>
        <p className="mt-1 text-sm text-slate-500">Dựa vào dàn ý và từ gợi ý, em hãy viết bài văn của riêng mình nhé. Bài viết được tự động lưu trên máy.</p>
        <textarea
          value={text}
          onChange={(e) => onChange(e.target.value)}
          rows={8}
          placeholder="Em bắt đầu viết ở đây…"
          className="mt-3 w-full rounded-2xl border-2 border-slate-200 p-3 text-base leading-7 text-slate-800 outline-none focus:border-emerald-400"
        />
        <div className="mt-2 flex gap-2">
          <button type="button" onClick={() => { unlockAudio(); if (text.trim()) speakText(text.slice(0, 190)); }} className="rounded-full border-2 border-emerald-200 px-4 py-1.5 text-sm font-black text-emerald-700">🔊 Nghe bài em viết</button>
          <button type="button" onClick={() => { if (confirm('Xóa bài viết của em?')) onChange(''); }} className="rounded-full border-2 border-slate-200 px-4 py-1.5 text-sm font-black text-slate-500">🗑 Xóa</button>
        </div>
      </div>
    </div>
  );
}
