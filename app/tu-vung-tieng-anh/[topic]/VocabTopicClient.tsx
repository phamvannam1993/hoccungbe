'use client';

import { useCallback, useEffect, useState } from 'react';
import type { VocabWord } from '../../lib/vocab';
import { speakEnThenVi, unlockAudio, stopSpeaking } from '../../components/edu/utils/speech';
import { useVocabImages, isImageUrl } from '../../components/edu/utils/vocabImages';

// Ảnh admin upload cho một từ (nếu có) — key "{slug}:{en}". Không có → dùng emoji.
function wordImageUrl(map: Record<string, string>, slug: string, en: string): string | null {
  const u = map[`${slug}:${en}`];
  return isImageUrl(u) ? u : null;
}

// Bảng màu pastel xoay vòng cho từng thẻ → lưới từ vựng rực rỡ, hợp mắt trẻ.
// Dùng chuỗi class Tailwind đầy đủ để không bị purge.
const CARD_COLORS = [
  { card: 'border-pink-200 bg-pink-50', chip: 'bg-pink-100 text-pink-700', accent: 'text-pink-600', emoji: 'bg-pink-100' },
  { card: 'border-sky-200 bg-sky-50', chip: 'bg-sky-100 text-sky-700', accent: 'text-sky-600', emoji: 'bg-sky-100' },
  { card: 'border-amber-200 bg-amber-50', chip: 'bg-amber-100 text-amber-700', accent: 'text-amber-600', emoji: 'bg-amber-100' },
  { card: 'border-emerald-200 bg-emerald-50', chip: 'bg-emerald-100 text-emerald-700', accent: 'text-emerald-600', emoji: 'bg-emerald-100' },
  { card: 'border-violet-200 bg-violet-50', chip: 'bg-violet-100 text-violet-700', accent: 'text-violet-600', emoji: 'bg-violet-100' },
  { card: 'border-orange-200 bg-orange-50', chip: 'bg-orange-100 text-orange-700', accent: 'text-orange-600', emoji: 'bg-orange-100' },
];

// Phát âm bằng giọng riêng của app (/api/tts) — GIỐNG phần làm bài tập/quiz.
// Đọc TIẾNG ANH trước rồi TỰ ĐỘNG đọc luôn NGHĨA TIẾNG VIỆT.
function play(en: string, vi: string) {
  unlockAudio();
  speakEnThenVi(en, vi);
}

function SpeakButton({ en, vi, big = false }: { en: string; vi: string; big?: boolean }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); play(en, vi); }}
      aria-label={`Nghe ${en}`}
      title="Nghe tiếng Anh, rồi nghĩa tiếng Việt"
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-white text-sky-500 shadow ring-1 ring-sky-100 transition hover:bg-sky-500 hover:text-white active:scale-90 ${big ? 'h-14 w-14' : 'h-9 w-9'}`}
    >
      <svg width={big ? 26 : 18} height={big ? 26 : 18} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M3 10v4a1 1 0 0 0 1 1h3l4 4V5L7 9H4a1 1 0 0 0-1 1Z" />
        <path d="M16 8.5a4 4 0 0 1 0 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M18.5 6a7 7 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </button>
  );
}

export function VocabTopicClient({ words, heading, slug }: { words: VocabWord[]; heading: string; slug: string }) {
  const [mode, setMode] = useState<'grid' | 'flashcard'>('grid');
  const vocabImages = useVocabImages();

  useEffect(() => () => stopSpeaking(), []);

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-full bg-white p-1 shadow-sm ring-1 ring-slate-100">
          <button
            type="button"
            onClick={() => { unlockAudio(); setMode('grid'); }}
            className={`rounded-full px-5 py-2 text-sm font-black transition ${mode === 'grid' ? 'bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow' : 'text-slate-500 hover:text-slate-700'}`}
          >
            📋 Danh sách
          </button>
          <button
            type="button"
            onClick={() => { unlockAudio(); setMode('flashcard'); }}
            className={`rounded-full px-5 py-2 text-sm font-black transition ${mode === 'flashcard' ? 'bg-gradient-to-r from-violet-500 to-sky-500 text-white shadow' : 'text-slate-500 hover:text-slate-700'}`}
          >
            🃏 Thẻ ghi nhớ
          </button>
        </div>
        <span className="text-xs font-semibold text-slate-400">🔊 Bấm loa: nghe tiếng Anh rồi nghĩa tiếng Việt</span>
      </div>

      {mode === 'grid' ? (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {words.map((w, i) => {
            const c = CARD_COLORS[i % CARD_COLORS.length];
            return (
              <li
                key={w.en}
                className={`group flex flex-col gap-2 rounded-3xl border-2 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${c.card}`}
              >
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => play(w.en, w.vi)}
                    className={`grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl text-4xl shadow-inner transition hover:scale-105 active:scale-95 ${c.emoji}`}
                    aria-label={`Nghe ${w.en}`}
                  >
                    {wordImageUrl(vocabImages, slug, w.en) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={wordImageUrl(vocabImages, slug, w.en)!} alt={w.en} className="h-full w-full object-cover" />
                    ) : (
                      w.emoji || '🔤'
                    )}
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`truncate text-xl font-black ${c.accent}`}>{w.en}</span>
                      <SpeakButton en={w.en} vi={w.vi} />
                    </div>
                    <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-bold ${c.chip}`}>{w.ipa}</span>
                    <div className="mt-1 font-bold text-slate-700">{w.vi}</div>
                  </div>
                </div>
                {w.example && (
                  <div className="mt-1 rounded-2xl bg-white/70 px-3 py-2 text-sm">
                    <span className="font-semibold text-slate-700">{w.example}</span>
                    {w.exampleVi && <span className="block text-slate-500">{w.exampleVi}</span>}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <Flashcards words={words} heading={heading} slug={slug} />
      )}
    </div>
  );
}

function Flashcards({ words, heading, slug }: { words: VocabWord[]; heading: string; slug: string }) {
  const vocabImages = useVocabImages();
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const w = words[i];
  const c = CARD_COLORS[i % CARD_COLORS.length];

  const go = useCallback(
    (delta: number) => {
      setFlipped(false);
      setI((prev) => (prev + delta + words.length) % words.length);
    },
    [words.length],
  );

  // Tự đọc (Anh → Việt) mỗi khi chuyển sang thẻ mới.
  useEffect(() => {
    play(w.en, w.vi);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  return (
    <div className="mt-6 flex flex-col items-center">
      <div className="flex w-full max-w-md items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-gradient-to-r from-pink-400 to-orange-400 transition-all" style={{ width: `${((i + 1) / words.length) * 100}%` }} />
        </div>
        <span className="text-sm font-bold text-slate-400">{i + 1}/{words.length}</span>
      </div>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className={`mt-4 flex aspect-[4/3] w-full max-w-md flex-col items-center justify-center rounded-[2rem] border-2 p-6 text-center shadow-lg transition hover:-translate-y-1 ${c.card}`}
        aria-label="Lật thẻ"
      >
        <span className="flex h-28 items-center justify-center text-8xl drop-shadow-sm" aria-hidden>
          {wordImageUrl(vocabImages, slug, w.en) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={wordImageUrl(vocabImages, slug, w.en)!} alt={w.en} className="h-28 w-auto max-w-full object-contain" />
          ) : (
            w.emoji || '🔤'
          )}
        </span>
        {!flipped ? (
          <>
            <span className={`mt-3 text-4xl font-black ${c.accent}`}>{w.en}</span>
            <span className="mt-1 text-lg font-bold text-slate-500">{w.ipa}</span>
            <span className="mt-3 rounded-full bg-white/70 px-3 py-1 text-xs font-bold text-slate-400">👆 Chạm để xem nghĩa</span>
          </>
        ) : (
          <>
            <span className="mt-3 text-4xl font-black text-emerald-600">{w.vi}</span>
            {w.example && <span className="mt-2 text-sm font-semibold text-slate-600">{w.example}</span>}
            <span className="mt-3 rounded-full bg-white/70 px-3 py-1 text-xs font-bold text-slate-400">👆 Chạm để xem lại từ</span>
          </>
        )}
      </button>

      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={() => go(-1)}
          className="grid h-12 w-12 place-items-center rounded-full bg-white text-xl font-black text-slate-500 shadow ring-1 ring-slate-100 transition hover:bg-slate-100"
          aria-label="Thẻ trước"
        >
          ←
        </button>
        <SpeakButton en={w.en} vi={w.vi} big />
        <button
          type="button"
          onClick={() => go(1)}
          className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-r from-sky-500 to-violet-500 text-xl font-black text-white shadow-lg transition hover:brightness-105"
          aria-label="Thẻ sau"
        >
          →
        </button>
      </div>
      <p className="mt-3 text-xs font-semibold text-slate-400">🔊 Mỗi thẻ tự đọc: tiếng Anh → nghĩa tiếng Việt</p>
    </div>
  );
}
