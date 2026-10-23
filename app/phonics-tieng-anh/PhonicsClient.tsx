'use client';

import { useEffect, useState } from 'react';
import { PHONICS_GROUPS } from '../lib/phonics';
import { ENGLISH_ALPHABET } from '../lib/englishAlphabet';
import WordFamilyFlower from './WordFamilyFlower';
import CvcCard from './CvcCard';
import PhonicsPic, { PhonicsImagesProvider } from './PhonicsPic';
import type { VocabFallback } from '../lib/phonicsWords';
import PhonicsQuiz from './PhonicsQuiz';
import DigraphCards from './DigraphCards';
import { speakEnThenVi, speakEnglish, unlockAudio, stopSpeaking } from '../components/edu/utils/speech';

const LETTER_COLORS = [
  { card: 'border-pink-200 bg-pink-50', big: 'text-pink-600', chip: 'bg-pink-100 text-pink-700' },
  { card: 'border-sky-200 bg-sky-50', big: 'text-sky-600', chip: 'bg-sky-100 text-sky-700' },
  { card: 'border-amber-200 bg-amber-50', big: 'text-amber-600', chip: 'bg-amber-100 text-amber-700' },
  { card: 'border-emerald-200 bg-emerald-50', big: 'text-emerald-600', chip: 'bg-emerald-100 text-emerald-700' },
  { card: 'border-violet-200 bg-violet-50', big: 'text-violet-600', chip: 'bg-violet-100 text-violet-700' },
  { card: 'border-orange-200 bg-orange-50', big: 'text-orange-600', chip: 'bg-orange-100 text-orange-700' },
];

export default function PhonicsClient({ imageFallback }: { imageFallback: VocabFallback }) {
  const [view, setView] = useState<'letters' | 'blend' | 'family' | 'digraph'>('letters');
  const [gi, setGi] = useState(0);
  const group = PHONICS_GROUPS[gi];

  useEffect(() => () => stopSpeaking(), []);

  return (
    <PhonicsImagesProvider fallback={imageFallback}>
    <div className="mt-6">
      {/* Chuyển chế độ: âm chữ cái ↔ ghép vần */}
      <div className="inline-flex flex-wrap rounded-3xl bg-white p-1 shadow-sm ring-1 ring-slate-100">
        <button
          type="button"
          onClick={() => { unlockAudio(); setView('letters'); }}
          className={`rounded-full px-5 py-2 text-sm font-black transition ${view === 'letters' ? 'bg-gradient-to-r from-violet-500 to-sky-500 text-white shadow' : 'text-slate-500 hover:text-slate-700'}`}
        >
          🔤 Âm 26 chữ cái
        </button>
        <button
          type="button"
          onClick={() => { unlockAudio(); setView('blend'); }}
          className={`rounded-full px-5 py-2 text-sm font-black transition ${view === 'blend' ? 'bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow' : 'text-slate-500 hover:text-slate-700'}`}
        >
          🧩 Ghép vần (CVC)
        </button>
        <button
          type="button"
          onClick={() => { unlockAudio(); setView('family'); }}
          className={`rounded-full px-5 py-2 text-sm font-black transition ${view === 'family' ? 'bg-gradient-to-r from-emerald-500 to-lime-500 text-white shadow' : 'text-slate-500 hover:text-slate-700'}`}
        >
          🌸 Họ từ (Word Family)
        </button>
        <button
          type="button"
          onClick={() => { unlockAudio(); setView('digraph'); }}
          className={`rounded-full px-5 py-2 text-sm font-black transition ${view === 'digraph' ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow' : 'text-slate-500 hover:text-slate-700'}`}
        >
          🐳 Âm ghép & nhóm âm
        </button>
      </div>

      {view === 'digraph' ? (
        <DigraphCards />
      ) : view === 'family' ? (
        <WordFamilyFlower />
      ) : view === 'letters' ? (
        <>
          <div className="mt-3 rounded-2xl bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700">
            Mỗi chữ cái có một <b>âm</b> riêng khi đọc. Bấm chữ để nghe <b>âm + từ mẫu</b> (ví dụ B → /b/ như trong “ball”).
          </div>
          <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {ENGLISH_ALPHABET.map((l, i) => {
              const c = LETTER_COLORS[i % LETTER_COLORS.length];
              return (
                <li key={l.upper} className={`flex flex-col gap-2 rounded-3xl border-2 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${c.card}`}>
                  <button
                    type="button"
                    onClick={() => { unlockAudio(); speakEnThenVi(l.word, l.vi); }}
                    className="flex flex-col items-center gap-1"
                    aria-label={`Nghe âm chữ ${l.upper} và từ ${l.word}`}
                  >
                    <span className={`text-5xl font-black leading-none ${c.big}`}>{l.upper}{l.lower}</span>
                    <span className={`mt-1 rounded-full px-2.5 py-0.5 text-xs font-black ${c.chip}`}>âm {l.sound}</span>
                    <span className="mt-1 text-3xl" aria-hidden><PhonicsPic word={l.word} emoji={l.emoji} /></span>
                    <span className="font-black text-slate-800">{l.word}</span>
                    <span className="text-sm font-semibold text-emerald-600">{l.vi}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { unlockAudio(); speakEnglish(l.word); }}
                    className="mt-auto rounded-full bg-white/70 px-3 py-1 text-xs font-black text-violet-600 shadow-sm ring-1 ring-violet-100 transition hover:bg-white"
                  >
                    🔊 Nghe lại
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <>
          {/* Chọn nhóm nguyên âm ngắn */}
          <div className="mt-4 flex flex-wrap gap-2">
            {PHONICS_GROUPS.map((g, i) => (
              <button
                key={g.slug}
                type="button"
                onClick={() => { unlockAudio(); setGi(i); }}
                className={`rounded-full border-2 px-4 py-2 text-sm font-black transition ${i === gi ? 'border-transparent bg-gradient-to-r from-violet-500 to-sky-500 text-white shadow' : 'border-slate-200 bg-white text-slate-600 hover:border-violet-300'}`}
              >
                {g.emoji} {g.vowel.toUpperCase()} {g.sound}
              </button>
            ))}
          </div>

          <div className="mt-3 rounded-2xl bg-pink-50 px-4 py-2 text-sm font-semibold text-pink-700">
            {group.label} · {group.sound} · {group.words.length} từ — bấm <b>🔡 Đánh vần</b> để thấy từng âm tiếng Anh (/s/ – /ʌ/ – /n/) rồi ghép thành từ. Phiên
            âm theo <b>giọng Anh-Mỹ</b>, giống giọng đọc.
          </div>

          <ul className="mt-5 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {group.words.filter((w) => !w.adv).map((w) => (
              <CvcCard key={w.word} w={w} />
            ))}
          </ul>

          {/* Từ khó minh họa bằng hình (fed, got, but…): học sau, không vào quiz */}
          <h3 className="mt-8 text-lg font-black text-slate-800">
            🚀 Nâng cao <span className="text-sm font-bold text-slate-400">· {group.words.filter((w) => w.adv).length} từ khó vẽ thành hình — bé đọc theo âm là chính</span>
          </h3>
          <ul className="mt-3 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {group.words.filter((w) => w.adv).map((w) => (
              <CvcCard key={w.word} w={w} />
            ))}
          </ul>

          <PhonicsQuiz key={group.slug} group={group} />
        </>
      )}
    </div>
    </PhonicsImagesProvider>
  );
}
