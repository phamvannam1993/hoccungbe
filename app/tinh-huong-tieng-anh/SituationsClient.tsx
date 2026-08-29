'use client';

import { useEffect, useMemo, useState } from 'react';
import { SITUATION_TOPICS, type SituationTopic } from '../lib/situations';
import { SITUATION_IPA } from '../lib/situationsIpa';
import { speakEnglish, speakEnglishSlow, speakText, unlockAudio, stopSpeaking } from '../components/edu/utils/speech';

// Icon vẽ theo key của chủ đề (không dùng emoji để nét đồng bộ).
function TopicIcon({ name, color }: { name: string; color: string }) {
  const p = { fill: 'none', stroke: color, strokeWidth: 2.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (name) {
    case 'sun':
      return <svg width="24" height="24" viewBox="0 0 24 24" {...p}><circle cx="12" cy="12" r="4.5" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" /></svg>;
    case 'meal':
      return <svg width="24" height="24" viewBox="0 0 24 24" {...p}><path d="M4 3v7a3 3 0 0 0 3 3v8M7 3v6M18 3c-1.5 0-3 2-3 5s1.5 4 3 4v6" /></svg>;
    case 'bath':
      return <svg width="24" height="24" viewBox="0 0 24 24" {...p}><path d="M6 12V6a3 3 0 0 1 6 0M4 12h16l-1 6a3 3 0 0 1-3 2H8a3 3 0 0 1-3-2z" /></svg>;
    case 'play':
      return <svg width="24" height="24" viewBox="0 0 24 24" {...p}><circle cx="12" cy="12" r="9" /><path d="M12 3v18M3 12h18" /></svg>;
    case 'walk':
      return <svg width="24" height="24" viewBox="0 0 24 24" {...p}><path d="M3 12h4l3-8 4 16 3-8h4" /></svg>;
    case 'star':
      return <svg width="24" height="24" viewBox="0 0 24 24" {...p}><path d="M12 3l2.5 5 5.5.8-4 3.9 1 5.5L12 16l-5 2.9 1-5.5-4-3.9 5.5-.8z" /></svg>;
    case 'heart':
      return <svg width="24" height="24" viewBox="0 0 24 24" {...p}><circle cx="12" cy="12" r="9" /><path d="M8.5 14.5a4 4 0 0 0 7 0M9 9.5h.01M15 9.5h.01" /></svg>;
    case 'moon':
      return <svg width="24" height="24" viewBox="0 0 24 24" {...p}><path d="M12 3a6 6 0 0 0-6 6c0 3 2 4 2 7h8c0-3 2-4 2-7a6 6 0 0 0-6-6zM9 22h6" /></svg>;
    case 'shield':
      return <svg width="24" height="24" viewBox="0 0 24 24" {...p}><path d="M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6z" /><path d="M12 9v3.5M12 16h.01" /></svg>;
    case 'manners':
      return <svg width="24" height="24" viewBox="0 0 24 24" {...p}><path d="M4 5h16v10H9l-4 4v-4H4z" /><path d="M12 8.4c-1-1.4-3-.6-3 .9 0 1.3 3 2.9 3 2.9s3-1.6 3-2.9c0-1.5-2-2.3-3-.9z" /></svg>;
    case 'health':
      return <svg width="24" height="24" viewBox="0 0 24 24" {...p}><path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.5-7 10-7 10z" /><path d="M7.5 11h2l1-2 1.6 4 1-2h2.4" /></svg>;
    case 'school':
      return <svg width="24" height="24" viewBox="0 0 24 24" {...p}><path d="M12 4L2 9l10 5 10-5-10-5z" /><path d="M6 11v4c0 1.5 2.7 3 6 3s6-1.5 6-3v-4" /></svg>;
    case 'home':
      return <svg width="24" height="24" viewBox="0 0 24 24" {...p}><path d="M4 11l8-7 8 7" /><path d="M6 10v9h12v-9" /><path d="M10 19v-5h4v5" /></svg>;
    case 'cart':
      return <svg width="24" height="24" viewBox="0 0 24 24" {...p}><circle cx="9" cy="20" r="1.4" /><circle cx="17" cy="20" r="1.4" /><path d="M3 4h2l2.2 11h11l1.8-8H6" /></svg>;
    case 'cloud':
      return <svg width="24" height="24" viewBox="0 0 24 24" {...p}><circle cx="16" cy="8" r="3.5" /><path d="M6 19a4 4 0 0 1 .5-8 5 5 0 0 1 9.5 1 3.5 3.5 0 0 1-.5 7z" /></svg>;
    case 'gift':
      return <svg width="24" height="24" viewBox="0 0 24 24" {...p}><path d="M4 11h16v9H4z" /><path d="M4 7h16v4H4zM12 7v13" /><path d="M12 7C10 7 8 6 8 4.5 8 3 10 3 12 7c2-4 4-4 4-2.5C16 6 14 7 12 7z" /></svg>;
    case 'family':
      return <svg width="24" height="24" viewBox="0 0 24 24" {...p}><circle cx="8" cy="7" r="3" /><circle cx="17" cy="8" r="2.4" /><path d="M2.5 20v-3a4 4 0 0 1 4-4h3a4 4 0 0 1 4 4v3M15 20v-3a3 3 0 0 1 3-3h.5a3 3 0 0 1 3 3v3" /></svg>;
    case 'car':
      return <svg width="24" height="24" viewBox="0 0 24 24" {...p}><path d="M4 13l1.6-4.5A2 2 0 0 1 7.5 7h9a2 2 0 0 1 1.9 1.5L20 13v5h-2v-2H6v2H4z" /><circle cx="7.5" cy="16" r="1.3" /><circle cx="16.5" cy="16" r="1.3" /></svg>;
    default:
      return null;
  }
}

const TOTAL = SITUATION_TOPICS.reduce((s, t) => s + t.situations.length, 0);
const DONE_KEY = 'bhh_situations_done_v1';
function readDone(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(DONE_KEY) || '{}'); } catch { return {}; }
}

export default function SituationsClient() {
  const [topic, setTopic] = useState<SituationTopic | null>(null);
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState<Record<string, number>>({});
  const [showVi, setShowVi] = useState(true);

  useEffect(() => () => stopSpeaking(), []);
  useEffect(() => { setDone(readDone()); }, []);

  const cur = topic ? topic.situations[idx] : null;

  // Tự đọc câu tiếng Anh khi chuyển tình huống.
  useEffect(() => {
    if (!cur) return;
    const t = setTimeout(() => speakEnglish(cur.en), 350);
    return () => clearTimeout(t);
  }, [cur]);

  const open = (t: SituationTopic) => { unlockAudio(); setTopic(t); setIdx(0); setShowVi(true); };
  const go = (d: number) => {
    if (!topic) return;
    const ni = Math.min(topic.situations.length - 1, Math.max(0, idx + d));
    setIdx(ni);
    // ghi nhận tiến độ (số câu xa nhất đã xem)
    const store = readDone();
    store[topic.slug] = Math.max(store[topic.slug] || 0, ni + 1);
    try { localStorage.setItem(DONE_KEY, JSON.stringify(store)); } catch { /* ignore */ }
    setDone(store);
  };

  const totalDone = useMemo(() => SITUATION_TOPICS.reduce((s, t) => s + (done[t.slug] || 0), 0), [done]);

  // ── Danh sách chủ đề ──
  if (!topic) {
    return (
      <div className="mt-6">
        <div className="mb-4 flex items-center justify-between rounded-2xl bg-[#FF6B9D] px-4 py-3 text-white shadow-md">
          <div>
            <p className="text-[11px] font-black uppercase tracking-wider opacity-90">Tổng cộng</p>
            <p className="text-lg font-black">{TOTAL} tình huống · {SITUATION_TOPICS.length} chủ đề</p>
          </div>
          <div className="rounded-full bg-white/20 px-3 py-1 text-sm font-black">{totalDone}/{TOTAL} đã xem</div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SITUATION_TOPICS.map((t) => {
            const d = done[t.slug] || 0;
            return (
              <button key={t.slug} type="button" onClick={() => open(t)} className="flex flex-col gap-2 rounded-2xl border-2 border-slate-100 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <span className="grid h-11 w-11 place-items-center rounded-xl" style={{ background: t.bg }}><TopicIcon name={t.icon} color={t.color} /></span>
                <span className="text-sm font-black leading-tight text-slate-800">{t.name}</span>
                <span className="text-xs font-bold text-slate-400">{d > 0 ? `${d}/20 câu` : '20 câu'}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Xem một tình huống ──
  const n = topic.situations.length;
  return (
    <div className="mx-auto mt-6 max-w-lg">
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => { stopSpeaking(); setTopic(null); }} className="text-sm font-black text-[#E85486]">← Đổi chủ đề</button>
        <span className="rounded-full px-3 py-1 text-xs font-black" style={{ background: topic.bg, color: topic.color }}>{idx + 1} / {n}</span>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: topic.bg }}><TopicIcon name={topic.icon} color={topic.color} /></span>
        <h2 className="text-lg font-black text-slate-800">{topic.name}</h2>
      </div>

      {/* Thanh tiến độ */}
      <div className="mt-3 flex gap-1">
        {topic.situations.map((_, i) => (
          <div key={i} className="h-1.5 flex-1 rounded-full" style={{ background: i <= idx ? topic.color : '#EDE7DD' }} />
        ))}
      </div>

      {/* Thẻ câu tiếng Anh */}
      {cur && (
        <div className="mt-5 rounded-3xl border-2 border-[#FFE5F1] bg-white p-6 text-center shadow-md">
          <p className="text-[11px] font-black uppercase tracking-wider text-[#FF6B9D]">Ba mẹ nói với con</p>
          <p className="mt-3 text-2xl font-black leading-snug text-slate-800 sm:text-3xl">{cur.en}</p>
          {SITUATION_IPA[cur.en] && <p className="mt-1.5 text-sm font-semibold text-slate-400">/{SITUATION_IPA[cur.en]}/</p>}

          <div className="mt-5 flex items-center justify-center gap-3">
            <button type="button" onClick={() => { unlockAudio(); speakEnglish(cur.en); }} aria-label="Nghe" className="grid h-16 w-16 place-items-center rounded-2xl bg-[#4ECDC4] text-white shadow-[0_4px_0_#37b3ab] transition active:translate-y-0.5">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff"><path d="M4 9v6h4l5 5V4L8 9H4z" /><path d="M16 8a5 5 0 0 1 0 8" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" /><path d="M18.5 5.5a9 9 0 0 1 0 13" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>
            </button>
            <button type="button" onClick={() => { unlockAudio(); speakEnglishSlow(cur.en); }} aria-label="Nghe chậm" className="grid h-12 w-12 place-items-center rounded-2xl bg-[#DCF6F3] text-[#37b3ab] transition active:translate-y-0.5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#37b3ab" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 13c0-2 2-3 5-3l3-3 4 2 4-1c1 2-1 4-3 4l1 4-4 1-3-2-4 3c-2 0-3-2-3-4z" /><path d="M6 13h.01" /></svg>
            </button>
          </div>
          <div className="mt-1.5 flex items-center justify-center gap-[26px] text-[11px] font-black text-slate-400"><span>Nghe</span><span>Chậm</span></div>
        </div>
      )}

      {/* Nghĩa tiếng Việt */}
      {cur && (
        <button type="button" onClick={() => { setShowVi((v) => !v); if (!showVi) speakText(cur.vi); }} className="mt-3 w-full rounded-2xl bg-[#FFE5F1] px-4 py-3 text-left">
          <span className="text-[11px] font-black uppercase text-[#E85486]">Nghĩa {showVi ? '' : '(bấm để hiện)'}</span>
          {showVi && <span className="mt-0.5 block text-base font-black text-slate-800">{cur.vi}</span>}
        </button>
      )}

      {/* Điều hướng */}
      <div className="mt-4 flex gap-2">
        <button type="button" onClick={() => go(-1)} disabled={idx === 0} className="grid h-12 w-14 place-items-center rounded-2xl border-2 border-slate-200 bg-white text-slate-500 disabled:opacity-40">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
        </button>
        {idx + 1 >= n ? (
          <button type="button" onClick={() => { stopSpeaking(); setTopic(null); }} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#57B85F] text-base font-black text-white shadow-[0_4px_0_#489b50]">Hoàn thành chủ đề ✓</button>
        ) : (
          <button type="button" onClick={() => go(1)} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#FF6B9D] text-base font-black text-white shadow-[0_4px_0_#E85486]">
            Tình huống tiếp theo
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
          </button>
        )}
      </div>
    </div>
  );
}
