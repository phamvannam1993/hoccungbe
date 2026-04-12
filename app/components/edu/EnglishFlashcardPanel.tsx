'use client';

import { useEffect, useRef, useState } from 'react';
import { englishVocabularyData } from './data/englishVocabularyData';

type Props = {
  showFlashcardMode: boolean;
  setShowFlashcardMode: (value: boolean) => void;
  flashcardIndex: number;
  setFlashcardIndex: (value: number | ((prev: number) => number)) => void;
  flashcardFlipped: boolean;
  setFlashcardFlipped: (value: boolean | ((prev: boolean) => boolean)) => void;
};

const FLASHCARD_SOUND_KEY = 'english-flashcard-sound-enabled-v1';
const FLASHCARD_SPEECH_KEY = 'english-flashcard-speech-enabled-v1';

function loadBooleanSetting(key: string, fallback = true): boolean {
  if (typeof window === 'undefined') return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function saveBooleanSetting(key: string, value: boolean) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export default function EnglishFlashcardPanel({
  showFlashcardMode,
  setShowFlashcardMode,
  flashcardIndex,
  setFlashcardIndex,
  flashcardFlipped,
  setFlashcardFlipped,
}: Props) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);

  const currentCard = englishVocabularyData[flashcardIndex];

  useEffect(() => {
    setSoundEnabled(loadBooleanSetting(FLASHCARD_SOUND_KEY, true));
    setSpeechEnabled(loadBooleanSetting(FLASHCARD_SPEECH_KEY, true));
  }, []);

  useEffect(() => {
    saveBooleanSetting(FLASHCARD_SOUND_KEY, soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    saveBooleanSetting(FLASHCARD_SPEECH_KEY, speechEnabled);
  }, [speechEnabled]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const getAudioContext = () => {
    if (typeof window === 'undefined') return null;

    if (!audioContextRef.current) {
      const AudioContextClass =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

      if (!AudioContextClass) return null;
      audioContextRef.current = new AudioContextClass();
    }

    return audioContextRef.current;
  };

  const playTone = async (
    frequency: number,
    duration = 0.14,
    type: OscillatorType = 'sine'
  ) => {
    if (!soundEnabled) return;

    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);
  };

  const playFlipSound = async () => {
    await playTone(520, 0.08, 'triangle');
  };

  const playNextSound = async () => {
    await playTone(620, 0.08, 'sine');
  };

  const playPrevSound = async () => {
    await playTone(420, 0.08, 'sine');
  };

  const speakEnglish = (text: string) => {
    if (!speechEnabled) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.85;
    utterance.pitch = 1.05;
    utterance.volume = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const speakVietnamese = (text: string) => {
    if (!speechEnabled) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.92;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const speakCurrentCard = () => {
    if (!currentCard) return;

    if (!flashcardFlipped) {
      speakEnglish(currentCard.word);
    } else {
      speakVietnamese(currentCard.meaning);
    }
  };

  const handleOpenFlashcard = () => {
    setShowFlashcardMode(true);
    setFlashcardIndex(0);
    setFlashcardFlipped(false);

    setTimeout(() => {
      if (englishVocabularyData[0]) {
        speakEnglish(englishVocabularyData[0].word);
      }
    }, 250);
  };

  const handleFlipCard = async () => {
    await playFlipSound();

    const nextFlipped = !flashcardFlipped;
    setFlashcardFlipped(nextFlipped);

    setTimeout(() => {
      if (!currentCard) return;

      if (!nextFlipped) {
        speakEnglish(currentCard.word);
      } else {
        speakVietnamese(currentCard.meaning);
      }
    }, 220);
  };

  const handlePrevCard = async () => {
    await playPrevSound();

    setFlashcardIndex((prev) => {
      const nextIndex = prev === 0 ? englishVocabularyData.length - 1 : prev - 1;

      setTimeout(() => {
        const nextCard = englishVocabularyData[nextIndex];
        if (nextCard) {
          speakEnglish(nextCard.word);
        }
      }, 220);

      return nextIndex;
    });

    setFlashcardFlipped(false);
  };

  const handleNextCard = async () => {
    await playNextSound();

    setFlashcardIndex((prev) => {
      const nextIndex = (prev + 1) % englishVocabularyData.length;

      setTimeout(() => {
        const nextCard = englishVocabularyData[nextIndex];
        if (nextCard) {
          speakEnglish(nextCard.word);
        }
      }, 220);

      return nextIndex;
    });

    setFlashcardFlipped(false);
  };

  if (!showFlashcardMode) {
    return (
      <div className="mb-6">
        <button
          onClick={handleOpenFlashcard}
          className="rounded-full bg-emerald-500 px-5 py-3 text-sm font-bold text-white"
        >
          Flashcard tự học
        </button>
      </div>
    );
  }

  return (
    <div className="mb-8 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-emerald-600">Flashcard tự học</p>
          <h2 className="text-2xl font-black text-slate-900">Ôn từ vựng nhanh</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSoundEnabled((prev) => !prev)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              soundEnabled
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {soundEnabled ? '🔊 Bật hiệu ứng' : '🔇 Tắt hiệu ứng'}
          </button>

          <button
            onClick={() => setSpeechEnabled((prev) => !prev)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              speechEnabled
                ? 'bg-sky-100 text-sky-700'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {speechEnabled ? '🗣️ Bật giọng đọc' : '🤫 Tắt giọng đọc'}
          </button>

          <button
            onClick={() => setShowFlashcardMode(false)}
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Đóng
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={speakCurrentCard}
          className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50"
        >
          {isSpeaking ? 'Đang đọc...' : '🔊 Nghe lại'}
        </button>

        <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
          Thẻ {flashcardIndex + 1}/{englishVocabularyData.length}
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={handleFlipCard}
          className="min-h-[260px] w-full max-w-md rounded-[32px] bg-emerald-50 p-8 text-center ring-1 ring-emerald-100 transition hover:bg-emerald-100"
        >
          <div className="text-6xl">{currentCard?.image}</div>

          {!flashcardFlipped ? (
            <div className="mt-4">
              <p className="text-sm font-semibold text-emerald-700">Mặt trước</p>
              <p className="mt-2 text-3xl font-black text-slate-900">
                {currentCard?.word}
              </p>
              <p className="mt-3 text-sm text-slate-500">
                Bấm vào thẻ để xem nghĩa tiếng Việt
              </p>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-sm font-semibold text-emerald-700">Mặt sau</p>
              <p className="mt-2 text-3xl font-black text-slate-900">
                {currentCard?.meaning}
              </p>
              <p className="mt-3 text-sm text-slate-500">
                Bấm vào thẻ để quay lại từ tiếng Anh
              </p>
            </div>
          )}
        </button>
      </div>

      <div className="mt-6 flex justify-center gap-3">
        <button
          onClick={handlePrevCard}
          className="rounded-full bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700"
        >
          ← Trước
        </button>

        <button
          onClick={handleNextCard}
          className="rounded-full bg-emerald-500 px-5 py-3 text-sm font-bold text-white"
        >
          Tiếp →
        </button>
      </div>
    </div>
  );
}
