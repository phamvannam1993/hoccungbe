'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { PageKey } from './types';
import {
  englishVocabularyData,
  englishCategoryLabels,
  type EnglishCategory,
  type EnglishWordItem,
} from './data/englishVocabularyData';
import {
  englishVocabularyLevels,
  type EnglishVocabularyLevel,
} from './data/englishVocabularyLevels';

import EnglishResultCard from './EnglishResultCard';
import EnglishProfileCard from './EnglishProfileCard';
import EnglishFlashcardPanel from './EnglishFlashcardPanel';
import EnglishLeaderboard from './EnglishLeaderboard';
import Link from 'next/link';

type Props = {
  setPage: Dispatch<SetStateAction<PageKey>>;
};

type BuiltEnglishQuestion = EnglishWordItem & {
  options: string[];
  meaningOptions: string[];
};

type ThemeInfo = {
  key: EnglishCategory | 'mixed';
  label: string;
};

type StickerItem = {
  id: string;
  emoji: string;
  title: string;
  description: string;
};

type EnglishProgressMap = Record<
  string,
  {
    highScore: number;
    bestStars: number;
    playedCount: number;
    unlocked: boolean;
    bestCombo: number;
  }
>;

type EnglishHistoryItem = {
  id: string;
  createdAt: number;
  levelId: string;
  levelTitle: string;
  mode: string;
  theme: string;
  score: number;
  total: number;
  stars: number;
  combo: number;
};

type ChildProfile = {
  name: string;
  avatar: string;
};

const ENGLISH_PROGRESS_KEY = 'english-vocab-progress-v3';
const ENGLISH_STICKERS_KEY = 'english-vocab-stickers-v3';
const ENGLISH_HISTORY_KEY = 'english-vocab-history-v2';
const ENGLISH_SOUND_KEY = 'english-vocab-sound-enabled-v2';
const ENGLISH_PROFILE_KEY = 'english-vocab-profile-v1';
const ENGLISH_STREAK_KEY = 'english-vocab-study-streak-v1';
const ENGLISH_SPEECH_KEY = 'english-vocab-speech-enabled-v1';

const englishStickers: StickerItem[] = [
  {
    id: 'english-first-win',
    emoji: '🌟',
    title: 'Bắt đầu thật tốt',
    description: 'Hoàn thành một màn tiếng Anh đầu tiên.',
  },
  {
    id: 'english-perfect',
    emoji: '👑',
    title: 'Ngôi sao tiếng Anh',
    description: 'Đạt 3 sao ở một màn chơi.',
  },
  {
    id: 'english-listener',
    emoji: '🎧',
    title: 'Tai nghe siêu đỉnh',
    description: 'Hoàn thành màn nghe và chọn.',
  },
  {
    id: 'english-animals',
    emoji: '🐾',
    title: 'Bạn của muôn loài',
    description: 'Hoàn thành chủ đề con vật.',
  },
  {
    id: 'english-fruits',
    emoji: '🍓',
    title: 'Nhà thám hiểm trái cây',
    description: 'Hoàn thành chủ đề trái cây.',
  },
  {
    id: 'english-colors',
    emoji: '🎨',
    title: 'Bé yêu màu sắc',
    description: 'Hoàn thành chủ đề màu sắc.',
  },
  {
    id: 'english-matcher',
    emoji: '🧩',
    title: 'Bé ghép nghĩa giỏi',
    description: 'Hoàn thành chế độ ghép từ với nghĩa tiếng Việt.',
  },
  {
    id: 'english-streak',
    emoji: '🔥',
    title: 'Combo siêu tốt',
    description: 'Đạt chuỗi đúng liên tiếp thật ấn tượng.',
  },
  {
    id: 'english-quick',
    emoji: '⚡',
    title: 'Thần tốc tiếng Anh',
    description: 'Hoàn thành chế độ thi nhanh 30 giây.',
  },
  {
    id: 'english-speaker',
    emoji: '🎙️',
    title: 'Bé mạnh dạn phát âm',
    description: 'Thử ghi âm và nghe lại phần phát âm của mình.',
  },
  {
    id: 'english-daily-streak',
    emoji: '📅',
    title: 'Bé học đều đặn',
    description: 'Duy trì chuỗi ngày học tiếng Anh.',
  },
];

const avatarOptions = ['🦊', '🐼', '🐯', '🐰', '🐻', '🦁'];

function shuffleArray<T>(items: T[]): T[] {
  const cloned = [...items];
  for (let i = cloned.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
  }
  return cloned;
}

function buildWordOptions(word: string, distractors: string[], optionsCount: number): string[] {
  return shuffleArray([word, ...shuffleArray(distractors).slice(0, optionsCount - 1)]);
}

function buildMeaningOptions(
  meaning: string,
  currentId: string,
  optionsCount: number
): string[] {
  const otherMeanings = englishVocabularyData
    .filter((item) => item.id !== currentId)
    .map((item) => item.meaning);

  return shuffleArray([meaning, ...shuffleArray(otherMeanings).slice(0, optionsCount - 1)]);
}

function getRandomThemeForLevel(level: EnglishVocabularyLevel): ThemeInfo {
  if (level.category !== 'mixed') {
    return {
      key: level.category,
      label: englishCategoryLabels[level.category],
    };
  }

  const availableCategories = Array.from(
    new Set(
      englishVocabularyData
        .filter((item) => item.difficulty === level.difficulty)
        .map((item) => item.category)
    )
  );

  const randomCategory =
    availableCategories[Math.floor(Math.random() * availableCategories.length)] ?? 'animals';

  return {
    key: randomCategory,
    label: englishCategoryLabels[randomCategory],
  };
}

function buildQuestions(level: EnglishVocabularyLevel, theme: ThemeInfo): BuiltEnglishQuestion[] {
  let filtered = englishVocabularyData.filter((item) => item.difficulty === level.difficulty);

  if (theme.key !== 'mixed') {
    filtered = filtered.filter((item) => item.category === theme.key);
  }

  return shuffleArray(filtered)
    .slice(0, level.questionCount)
    .map((item) => ({
      ...item,
      options: buildWordOptions(item.word, item.distractors, level.optionsCount),
      meaningOptions: buildMeaningOptions(item.meaning, item.id, level.optionsCount),
    }));
}

function getStars(score: number, total: number): number {
  const ratio = total === 0 ? 0 : score / total;
  if (ratio >= 0.9) return 3;
  if (ratio >= 0.6) return 2;
  if (ratio >= 0.3) return 1;
  return 0;
}

function buildInitialProgress(): EnglishProgressMap {
  const progress: EnglishProgressMap = {};

  englishVocabularyLevels.forEach((level, index) => {
    progress[level.id] = {
      highScore: 0,
      bestStars: 0,
      playedCount: 0,
      unlocked: index === 0,
      bestCombo: 0,
    };
  });

  return progress;
}

function loadProgress(): EnglishProgressMap {
  if (typeof window === 'undefined') return buildInitialProgress();
  try {
    const raw = window.localStorage.getItem(ENGLISH_PROGRESS_KEY);
    return raw ? { ...buildInitialProgress(), ...JSON.parse(raw) } : buildInitialProgress();
  } catch {
    return buildInitialProgress();
  }
}

function saveProgress(progress: EnglishProgressMap) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ENGLISH_PROGRESS_KEY, JSON.stringify(progress));
}

function loadUnlockedStickers(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(ENGLISH_STICKERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUnlockedStickers(stickers: string[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ENGLISH_STICKERS_KEY, JSON.stringify(stickers));
}

function loadHistory(): EnglishHistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(ENGLISH_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(history: EnglishHistoryItem[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ENGLISH_HISTORY_KEY, JSON.stringify(history));
}

function pushHistoryItem(item: EnglishHistoryItem) {
  const current = loadHistory();
  const updated = [item, ...current].slice(0, 10);
  saveHistory(updated);
  return updated;
}

function loadSoundEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const raw = window.localStorage.getItem(ENGLISH_SOUND_KEY);
    return raw ? JSON.parse(raw) : true;
  } catch {
    return true;
  }
}

function saveSoundEnabled(enabled: boolean) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ENGLISH_SOUND_KEY, JSON.stringify(enabled));
}

function loadSpeechEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const raw = window.localStorage.getItem(ENGLISH_SPEECH_KEY);
    return raw ? JSON.parse(raw) : true;
  } catch {
    return true;
  }
}

function saveSpeechEnabled(enabled: boolean) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ENGLISH_SPEECH_KEY, JSON.stringify(enabled));
}

function loadProfile(): ChildProfile {
  if (typeof window === 'undefined') {
    return { name: 'Bé Miu', avatar: '🦊' };
  }

  try {
    const raw = window.localStorage.getItem(ENGLISH_PROFILE_KEY);
    return raw ? JSON.parse(raw) : { name: 'Bé Miu', avatar: '🦊' };
  } catch {
    return { name: 'Bé Miu', avatar: '🦊' };
  }
}

function saveProfile(profile: ChildProfile) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ENGLISH_PROFILE_KEY, JSON.stringify(profile));
}

function loadStudyStreak(): number {
  if (typeof window === 'undefined') return 0;

  try {
    const raw = window.localStorage.getItem(ENGLISH_STREAK_KEY);
    if (!raw) return 0;

    const parsed = JSON.parse(raw) as { streak: number; lastDate: string };
    return parsed.streak;
  } catch {
    return 0;
  }
}

function updateStudyStreak(): number {
  if (typeof window === 'undefined') return 0;

  const today = new Date();
  const todayKey = today.toDateString();

  try {
    const raw = window.localStorage.getItem(ENGLISH_STREAK_KEY);

    if (!raw) {
      const value = { streak: 1, lastDate: todayKey };
      window.localStorage.setItem(ENGLISH_STREAK_KEY, JSON.stringify(value));
      return 1;
    }

    const parsed = JSON.parse(raw) as { streak: number; lastDate: string };
    const lastDate = new Date(parsed.lastDate);

    if (parsed.lastDate === todayKey) return parsed.streak;

    const diffDays = Math.floor(
      (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const nextStreak = diffDays === 1 ? parsed.streak + 1 : 1;
    const value = { streak: nextStreak, lastDate: todayKey };

    window.localStorage.setItem(ENGLISH_STREAK_KEY, JSON.stringify(value));
    return nextStreak;
  } catch {
    const value = { streak: 1, lastDate: todayKey };
    window.localStorage.setItem(ENGLISH_STREAK_KEY, JSON.stringify(value));
    return 1;
  }
}

export default function EnglishVocabularyPage() {
  const [selectedLevel, setSelectedLevel] = useState<EnglishVocabularyLevel | null>(null);
  const [currentTheme, setCurrentTheme] = useState<ThemeInfo | null>(null);
  const [questions, setQuestions] = useState<BuiltEnglishQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [progressMap, setProgressMap] = useState<EnglishProgressMap>(buildInitialProgress());
  const [unlockedStickerIds, setUnlockedStickerIds] = useState<string[]>([]);
  const [history, setHistory] = useState<EnglishHistoryItem[]>([]);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);

  const [quickTimeLeft, setQuickTimeLeft] = useState(30);

  const [recordingSupported, setRecordingSupported] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);

  const [wrongQuestions, setWrongQuestions] = useState<BuiltEnglishQuestion[]>([]);

  const [showFlashcardMode, setShowFlashcardMode] = useState(false);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);

  const [childProfile, setChildProfile] = useState<ChildProfile>({
    name: 'Bé Miu',
    avatar: '🦊',
  });
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileDraftName, setProfileDraftName] = useState('Bé Miu');
  const [studyStreakDays, setStudyStreakDays] = useState(0);

  const resultHandledRef = useRef(false);
  const quickTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const flashcardTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);

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
    duration = 0.16,
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

  const playGameSound = async (
    type: 'select' | 'correct' | 'wrong' | 'unlock' | 'three_stars',
    enabled: boolean
  ) => {
    if (!enabled) return;

    if (type === 'select') {
      await playTone(420, 0.08, 'triangle');
      return;
    }

    if (type === 'correct') {
      await playTone(700, 0.1, 'sine');
      setTimeout(() => {
        playTone(900, 0.12, 'sine');
      }, 90);
      return;
    }

    if (type === 'wrong') {
      await playTone(300, 0.1, 'sawtooth');
      setTimeout(() => {
        playTone(180, 0.14, 'sawtooth');
      }, 90);
      return;
    }

    if (type === 'unlock') {
      await playTone(520, 0.1, 'sine');
      setTimeout(() => {
        playTone(760, 0.12, 'sine');
      }, 100);
      setTimeout(() => {
        playTone(980, 0.15, 'sine');
      }, 220);
      return;
    }

    await playTone(523.25, 0.12, 'sine');
    setTimeout(() => {
      playTone(659.25, 0.12, 'sine');
    }, 100);
    setTimeout(() => {
      playTone(783.99, 0.14, 'sine');
    }, 220);
    setTimeout(() => {
      playTone(1046.5, 0.18, 'sine');
    }, 340);
  };

  useEffect(() => {
    setProgressMap(loadProgress());
    setUnlockedStickerIds(loadUnlockedStickers());
    setHistory(loadHistory());
    setSpeechSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
    setSoundEnabled(loadSoundEnabled());
    setSpeechEnabled(loadSpeechEnabled());
    setRecordingSupported(
      typeof window !== 'undefined' &&
        typeof navigator !== 'undefined' &&
        !!navigator.mediaDevices &&
        'MediaRecorder' in window
    );

    const profile = loadProfile();
    setChildProfile(profile);
    setProfileDraftName(profile.name);
    setStudyStreakDays(loadStudyStreak());
  }, []);

  useEffect(() => {
    saveSoundEnabled(soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    saveSpeechEnabled(speechEnabled);
  }, [speechEnabled]);

  useEffect(() => {
    if (!showFlashcardMode) return;

    flashcardTimerRef.current = setInterval(() => {
      setFlashcardFlipped((prev) => !prev);
    }, 2000);

    return () => {
      if (flashcardTimerRef.current) {
        clearInterval(flashcardTimerRef.current);
        flashcardTimerRef.current = null;
      }
    };
  }, [showFlashcardMode]);

  useEffect(() => {
    if (!selectedLevel || selectedLevel.mode !== 'quick-challenge' || showResult) return;

    quickTimerRef.current = setInterval(() => {
      setQuickTimeLeft((prev) => {
        if (prev <= 1) {
          if (quickTimerRef.current) {
            clearInterval(quickTimerRef.current);
            quickTimerRef.current = null;
          }
          setShowResult(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (quickTimerRef.current) {
        clearInterval(quickTimerRef.current);
        quickTimerRef.current = null;
      }
    };
  }, [selectedLevel, showResult]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recordedAudioUrl) {
        URL.revokeObjectURL(recordedAudioUrl);
      }
    };
  }, [recordedAudioUrl]);

  const currentQuestion = useMemo(
    () => questions[currentIndex],
    [questions, currentIndex]
  );

  const currentLevelProgress = selectedLevel ? progressMap[selectedLevel.id] : null;
  const currentStars =
    selectedLevel?.mode === 'quick-challenge'
      ? getStars(score, Math.max(5, score))
      : getStars(score, questions.length);

  const addSticker = (stickerId: string) => {
    setUnlockedStickerIds((prev) => {
      if (prev.includes(stickerId)) return prev;
      const updated = [...prev, stickerId];
      saveUnlockedStickers(updated);
      return updated;
    });
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

  const speakWord = (text: string) => {
    speakEnglish(text);
  };

  const speakMeaning = (text: string) => {
    speakVietnamese(text);
  };

  const speakQuestionGuide = () => {
    if (!selectedLevel || !currentQuestion) return;

    if (selectedLevel.mode === 'listen-and-choose') {
      speakVietnamese('Bé hãy nghe từ tiếng Anh rồi chọn đáp án đúng');
      setTimeout(() => {
        speakEnglish(currentQuestion.word);
      }, 800);
      return;
    }

    if (selectedLevel.mode === 'match-meaning') {
      speakVietnamese(`Bé hãy chọn nghĩa tiếng Việt đúng cho từ ${currentQuestion.word}`);
      setTimeout(() => {
        speakEnglish(currentQuestion.word);
      }, 800);
      return;
    }

    if (selectedLevel.mode === 'quick-challenge') {
      speakVietnamese(`Bé hãy nhìn hình và chọn từ tiếng Anh đúng. Nghĩa là ${currentQuestion.meaning}`);
      return;
    }

    speakVietnamese(`Bé hãy nhìn hình và chọn từ tiếng Anh đúng. Nghĩa là ${currentQuestion.meaning}`);
  };

  const startLevel = (level: EnglishVocabularyLevel) => {
    resultHandledRef.current = false;

    const theme = getRandomThemeForLevel(level);
    const builtQuestions = buildQuestions(level, theme);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setSelectedLevel(level);
    setCurrentTheme(theme);
    setQuestions(builtQuestions);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScore(0);
    setShowResult(false);
    setCombo(0);
    setBestCombo(0);
    setQuickTimeLeft(30);
    setWrongQuestions([]);

    if (recordedAudioUrl) {
      URL.revokeObjectURL(recordedAudioUrl);
      setRecordedAudioUrl(null);
    }

    if (level.mode === 'listen-and-choose' && builtQuestions[0]) {
      setTimeout(() => {
        speakWord(builtQuestions[0].word);
      }, 250);
    }
  };

  useEffect(() => {
    if (!selectedLevel || !currentQuestion || showResult) return;

    const timer = setTimeout(() => {
      speakQuestionGuide();
    }, 450);

    return () => clearTimeout(timer);
  }, [selectedLevel, currentQuestion, showResult]);

  const handleChooseAnswer = async (answer: string) => {
    if (!currentQuestion || selectedAnswer) return;
  
    await playGameSound('select', soundEnabled);
    setSelectedAnswer(answer);
  
    const correctAnswer =
      selectedLevel?.mode === 'match-meaning' ? currentQuestion.meaning : currentQuestion.word;
  
    if (answer === correctAnswer) {
      await playGameSound('correct', soundEnabled);
  
      setIsCorrect(true);
      setScore((prev) => prev + 1);
      setCombo((prev) => {
        const next = prev + 1;
        setBestCombo((best) => Math.max(best, next));
        return next;
      });
  
      setTimeout(() => {
        if (selectedLevel?.mode === 'match-meaning') {
          speakVietnamese(`Chính xác. ${currentQuestion.word} có nghĩa là ${currentQuestion.meaning}`);
        } else {
          speakVietnamese(
            `Chính xác. ${currentQuestion.word} nghĩa là ${currentQuestion.meaning}`
          );
  
          setTimeout(() => {
            speakEnglish(currentQuestion.word);
          }, 1400);
        }
      }, 250);
    } else {
      await playGameSound('wrong', soundEnabled);
  
      setIsCorrect(false);
      setCombo(0);
  
      setWrongQuestions((prev) => {
        const exists = prev.some((item) => item.id === currentQuestion.id);
        return exists ? prev : [...prev, currentQuestion];
      });
  
      setTimeout(() => {
        if (selectedLevel?.mode === 'match-meaning') {
          speakVietnamese(`Chưa đúng. Đáp án đúng là ${currentQuestion.meaning}`);
        } else {
          speakVietnamese(
            `Chưa đúng. Đáp án đúng là ${currentQuestion.word}, nghĩa là ${currentQuestion.meaning}`
          );
  
          setTimeout(() => {
            speakEnglish(currentQuestion.word);
          }, 1600);
        }
      }, 250);
    }
  };

  const handleReplayAudio = () => {
    if (!currentQuestion) return;
    speakWord(currentQuestion.word);
  };

  const handleSpeakMeaning = () => {
    if (!currentQuestion) return;
    speakMeaning(currentQuestion.meaning);
  };

  const handleStartRecording = async () => {
    if (!recordingSupported || isRecording) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      audioChunksRef.current = [];

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);

        if (recordedAudioUrl) {
          URL.revokeObjectURL(recordedAudioUrl);
        }

        setRecordedAudioUrl(url);
        addSticker('english-speaker');

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      speakVietnamese('Bắt đầu ghi âm');
    } catch (error) {
      console.error(error);
    }
  };

  const handleStopRecording = () => {
    if (!mediaRecorderRef.current || !isRecording) return;
    mediaRecorderRef.current.stop();
    setIsRecording(false);
    speakVietnamese('Đã dừng ghi âm');
  };

  const handleRestart = () => {
    if (!selectedLevel) return;
    startLevel(selectedLevel);
  };

  const handleNext = () => {
    if (!selectedLevel) return;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    if (selectedLevel.mode === 'quick-challenge') {
      const nextIndex = currentIndex + 1;
      const safeIndex = nextIndex >= questions.length ? 0 : nextIndex;

      setCurrentIndex(safeIndex);
      setSelectedAnswer(null);
      setIsCorrect(null);
      return;
    }

    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setSelectedAnswer(null);
      setIsCorrect(null);

      if (selectedLevel.mode === 'listen-and-choose' && questions[nextIndex]) {
        setTimeout(() => {
          speakWord(questions[nextIndex].word);
        }, 250);
      }
      return;
    }

    setShowResult(true);
  };

  useEffect(() => {
    if (!showResult || !selectedLevel || resultHandledRef.current) return;
    resultHandledRef.current = true;

    const stars =
      selectedLevel.mode === 'quick-challenge'
        ? getStars(score, Math.max(5, score))
        : getStars(score, questions.length);

    setProgressMap((prev) => {
      const current = prev[selectedLevel.id] ?? {
        highScore: 0,
        bestStars: 0,
        playedCount: 0,
        unlocked: false,
        bestCombo: 0,
      };

      const updated: EnglishProgressMap = {
        ...prev,
        [selectedLevel.id]: {
          highScore: Math.max(current.highScore, score),
          bestStars: Math.max(current.bestStars, stars),
          playedCount: current.playedCount + 1,
          unlocked: true,
          bestCombo: Math.max(current.bestCombo, bestCombo),
        },
      };

      const currentLevelIndex = englishVocabularyLevels.findIndex(
        (item) => item.id === selectedLevel.id
      );
      const nextLevel = englishVocabularyLevels[currentLevelIndex + 1];

      if (nextLevel && stars >= 2) {
        const wasUnlocked = updated[nextLevel.id]?.unlocked ?? false;

        updated[nextLevel.id] = {
          ...(updated[nextLevel.id] ?? {
            highScore: 0,
            bestStars: 0,
            playedCount: 0,
            unlocked: false,
            bestCombo: 0,
          }),
          unlocked: true,
        };

        if (!wasUnlocked) {
          playGameSound('unlock', soundEnabled);
        }
      }

      saveProgress(updated);
      return updated;
    });

    const nextStudyStreak = updateStudyStreak();
    setStudyStreakDays(nextStudyStreak);

    addSticker('english-first-win');
    if (stars === 3) {
      playGameSound('three_stars', soundEnabled);
      addSticker('english-perfect');
    }
    if (selectedLevel.mode === 'listen-and-choose') addSticker('english-listener');
    if (selectedLevel.mode === 'match-meaning') addSticker('english-matcher');
    if (selectedLevel.mode === 'quick-challenge') addSticker('english-quick');
    if (currentTheme?.key === 'animals') addSticker('english-animals');
    if (currentTheme?.key === 'fruits') addSticker('english-fruits');
    if (currentTheme?.key === 'colors') addSticker('english-colors');
    if (bestCombo >= 3) addSticker('english-streak');
    if (nextStudyStreak >= 3) addSticker('english-daily-streak');

    const updatedHistory = pushHistoryItem({
      id: `${Date.now()}-${selectedLevel.id}`,
      createdAt: Date.now(),
      levelId: selectedLevel.id,
      levelTitle: selectedLevel.title,
      mode: selectedLevel.mode,
      theme: currentTheme?.label ?? 'Không rõ',
      score,
      total: selectedLevel.mode === 'quick-challenge' ? Math.max(5, score) : questions.length,
      stars,
      combo: bestCombo,
    });

    setHistory(updatedHistory);

    setTimeout(() => {
      speakVietnamese(`Bé đã hoàn thành màn ${selectedLevel.title}`);
    }, 300);
  }, [showResult, selectedLevel, score, questions.length, currentTheme, bestCombo, soundEnabled]);

  const progressPercent =
    selectedLevel?.mode === 'quick-challenge'
      ? ((30 - quickTimeLeft) / 30) * 100
      : questions.length > 0
      ? ((currentIndex + 1) / questions.length) * 100
      : 0;

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    saveSoundEnabled(next);

    if (!next && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const toggleSpeech = () => {
    const next = !speechEnabled;
    setSpeechEnabled(next);
    saveSpeechEnabled(next);

    if (!next && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const saveChildProfile = () => {
    const nextProfile = {
      name: profileDraftName.trim() || 'Bé Miu',
      avatar: childProfile.avatar,
    };
    setChildProfile(nextProfile);
    saveProfile(nextProfile);
    setEditingProfile(false);
  };

  const answerOptions =
    selectedLevel?.mode === 'match-meaning'
      ? currentQuestion?.meaningOptions ?? []
      : currentQuestion?.options ?? [];

  const correctAnswer =
    selectedLevel?.mode === 'match-meaning'
      ? currentQuestion?.meaning ?? ''
      : currentQuestion?.word ?? '';

  if (!selectedLevel) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-[28px] bg-gradient-to-r from-emerald-500 to-sky-500 p-6 text-white shadow-lg">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-2 inline-flex rounded-full bg-white/20 px-3 py-1 text-sm font-semibold">
                Trò chơi tiếng Anh
              </p>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Từ vựng tiếng Anh
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-white/90 sm:text-base">
                Bé nhìn hình, nghe phát âm, ghép nghĩa và thi nhanh để học tiếng Anh thú vị hơn.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={toggleSound}
                className="rounded-full bg-white/20 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/30"
              >
                {soundEnabled ? '🔊 Bật âm thanh' : '🔇 Tắt âm thanh'}
              </button>
              <button
                onClick={toggleSpeech}
                className="rounded-full bg-white/20 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/30"
              >
                {speechEnabled ? '🗣️ Bật giọng đọc' : '🤫 Tắt giọng đọc'}
              </button>
            </div>
          </div>
        </div>

        <EnglishProfileCard
          childProfile={childProfile}
          profileDraftName={profileDraftName}
          setProfileDraftName={setProfileDraftName}
          avatarOptions={avatarOptions}
          editingProfile={editingProfile}
          setEditingProfile={setEditingProfile}
          onSelectAvatar={(avatar) => {
            const nextProfile = { ...childProfile, avatar };
            setChildProfile(nextProfile);
          }}
          onSaveProfile={saveChildProfile}
          studyStreakDays={studyStreakDays}
        />

        <EnglishFlashcardPanel
          showFlashcardMode={showFlashcardMode}
          setShowFlashcardMode={setShowFlashcardMode}
          flashcardIndex={flashcardIndex}
          setFlashcardIndex={setFlashcardIndex}
          flashcardFlipped={flashcardFlipped}
          setFlashcardFlipped={setFlashcardFlipped}
        />

        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <p className="text-sm font-semibold text-slate-500">Sticker đã mở</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{unlockedStickerIds.length}</p>
          </div>
          <div className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <p className="text-sm font-semibold text-slate-500">Màn đã chơi</p>
            <p className="mt-2 text-3xl font-black text-slate-900">
              {Object.values(progressMap).reduce((sum, item) => sum + item.playedCount, 0)}
            </p>
          </div>
          <div className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <p className="text-sm font-semibold text-slate-500">Thiết bị hỗ trợ phát âm</p>
            <p className="mt-2 text-2xl font-black text-slate-900">
              {speechSupported ? 'Có' : 'Không'}
            </p>
          </div>
          <div className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <p className="text-sm font-semibold text-slate-500">Ghi âm phát âm</p>
            <p className="mt-2 text-2xl font-black text-slate-900">
              {recordingSupported ? 'Có' : 'Không'}
            </p>
          </div>
        </div>

        <EnglishLeaderboard progressMap={progressMap} />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {englishVocabularyLevels.map((level) => {
            const item = progressMap[level.id];
            const isUnlocked = item?.unlocked ?? false;

            return (
              <button
                key={level.id}
                onClick={() => isUnlocked && startLevel(level)}
                disabled={!isUnlocked}
                className={`rounded-[28px] p-5 text-left shadow-sm ring-1 transition ${
                  isUnlocked
                    ? 'bg-white ring-slate-100 hover:-translate-y-1 hover:shadow-lg'
                    : 'cursor-not-allowed bg-slate-100 ring-slate-200 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-2xl">
                    {level.mode === 'listen-and-choose'
                      ? '🎧'
                      : level.mode === 'match-meaning'
                      ? '🧩'
                      : level.mode === 'quick-challenge'
                      ? '⚡'
                      : '🌍'}
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                    {isUnlocked ? 'Đã mở' : 'Đã khóa'}
                  </span>
                </div>

                <h3 className="mt-4 text-xl font-black text-slate-900">{level.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{level.description}</p>

                <div className="mt-4 flex flex-wrap gap-2 text-sm">
                  <span className="rounded-full bg-emerald-50 px-3 py-1.5 font-semibold text-emerald-700">
                    {level.category === 'mixed'
                      ? 'Chủ đề ngẫu nhiên'
                      : englishCategoryLabels[level.category]}
                  </span>
                  <span className="rounded-full bg-sky-50 px-3 py-1.5 font-semibold text-sky-700">
                    {level.mode === 'quick-challenge' ? '30 giây' : `${level.questionCount} câu`}
                  </span>
                </div>

                <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">
                  <p>
                    Điểm cao nhất: <span className="font-bold">{item?.highScore ?? 0}</span>
                  </p>
                  <p>
                    Số lần chơi: <span className="font-bold">{item?.playedCount ?? 0}</span>
                  </p>
                  <p>
                    Sao tốt nhất: <span className="font-bold">{item?.bestStars ?? 0}/3</span>
                  </p>
                </div>

                <div className="mt-5 rounded-full bg-slate-900 px-4 py-3 text-center text-sm font-bold text-white">
                  {isUnlocked ? 'Bắt đầu học' : 'Mở khi đạt 2 sao cấp trước'}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h2 className="text-2xl font-black text-slate-900">Bộ sticker tiếng Anh</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {englishStickers.map((sticker) => {
              const unlocked = unlockedStickerIds.includes(sticker.id);

              return (
                <div
                  key={sticker.id}
                  className={`rounded-2xl p-4 ring-1 ${
                    unlocked
                      ? 'bg-emerald-50 ring-emerald-100'
                      : 'bg-slate-50 ring-slate-100 opacity-70'
                  }`}
                >
                  <div className="text-4xl">{unlocked ? sticker.emoji : '🔒'}</div>
                  <p className="mt-3 font-black text-slate-900">{sticker.title}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {unlocked ? sticker.description : 'Chưa mở khóa'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h2 className="text-2xl font-black text-slate-900">Lịch sử 10 màn gần nhất</h2>
          <div className="mt-4 space-y-3">
            {history.length === 0 ? (
              <p className="text-slate-600">Chưa có lịch sử màn chơi nào.</p>
            ) : (
              history.map((item) => (
                <div key={item.id} className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-black text-slate-900">{item.levelTitle}</p>
                      <p className="text-sm text-slate-500">
                        Chủ đề: {item.theme} • Chế độ: {item.mode}
                      </p>
                    </div>
                    <div className="text-sm text-slate-600">
                      {new Date(item.createdAt).toLocaleString('vi-VN')}
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 text-sm">
                    <span className="rounded-full bg-white px-3 py-1.5 font-semibold text-slate-700 ring-1 ring-slate-200">
                      Điểm: {item.score}/{item.total}
                    </span>
                    <span className="rounded-full bg-white px-3 py-1.5 font-semibold text-slate-700 ring-1 ring-slate-200">
                      Sao: {item.stars}/3
                    </span>
                    <span className="rounded-full bg-white px-3 py-1.5 font-semibold text-slate-700 ring-1 ring-slate-200">
                      Combo: {item.combo}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    );
  }

  if (!currentQuestion) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-100">
          <h2 className="text-2xl font-black text-slate-900">Chưa có câu hỏi</h2>
          <button
            onClick={() => setSelectedLevel(null)}
            className="mt-6 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white"
          >
            Quay lại
          </button>
        </div>
      </section>
    );
  }

  if (showResult) {
    return (
      <EnglishResultCard
        childProfile={childProfile}
        studyStreakDays={studyStreakDays}
        selectedLevelTitle={selectedLevel.title}
        currentThemeLabel={currentTheme?.label}
        currentStars={currentStars}
        score={score}
        totalQuestions={
          selectedLevel.mode === 'quick-challenge' ? Math.max(5, score) : questions.length
        }
        highScore={Math.max(currentLevelProgress?.highScore ?? 0, score)}
        bestCombo={bestCombo}
        wrongQuestionsCount={wrongQuestions.length}
        isQuickMode={selectedLevel.mode === 'quick-challenge'}
        onRetryWrong={() => {
          resultHandledRef.current = false;
          setQuestions(wrongQuestions);
          setCurrentIndex(0);
          setSelectedAnswer(null);
          setIsCorrect(null);
          setScore(0);
          setShowResult(false);
          setCombo(0);
          setBestCombo(0);
          setWrongQuestions([]);
        }}
        onRestart={handleRestart}
        onBackLevels={() => setSelectedLevel(null)}
      />
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 rounded-[28px] bg-gradient-to-r from-emerald-500 to-sky-500 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 inline-flex rounded-full bg-white/20 px-3 py-1 text-sm font-semibold">
              Trò chơi tiếng Anh
            </p>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              {selectedLevel.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-white/90 sm:text-base">
              {selectedLevel.description}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {currentTheme && (
                <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white">
                  Chủ đề: {currentTheme.label}
                </span>
              )}
              <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white">
                {selectedLevel.mode === 'listen-and-choose'
                  ? 'Nghe rồi chọn'
                  : selectedLevel.mode === 'match-meaning'
                  ? 'Ghép từ với nghĩa'
                  : selectedLevel.mode === 'quick-challenge'
                  ? 'Thi nhanh 30 giây'
                  : 'Nhìn rồi chọn'}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={toggleSound}
                className="rounded-full bg-white/20 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/30"
              >
                {soundEnabled ? '🔊 Bật âm thanh' : '🔇 Tắt âm thanh'}
              </button>
              <button
                onClick={toggleSpeech}
                className="rounded-full bg-white/20 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/30"
              >
                {speechEnabled ? '🗣️ Bật giọng đọc' : '🤫 Tắt giọng đọc'}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:min-w-[320px]">
              <div className="rounded-2xl bg-white/20 p-4 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-wide text-white/80">
                  Điểm số
                </p>
                <p className="mt-1 text-2xl font-black">{score}</p>
              </div>
              <div className="rounded-2xl bg-white/20 p-4 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-wide text-white/80">
                  Combo
                </p>
                <p className="mt-1 text-2xl font-black">{combo}</p>
              </div>
              <div className="rounded-2xl bg-white/20 p-4 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-wide text-white/80">
                  {selectedLevel.mode === 'quick-challenge' ? 'Thời gian' : 'Câu'}
                </p>
                <p className="mt-1 text-2xl font-black">
                  {selectedLevel.mode === 'quick-challenge'
                    ? `${quickTimeLeft}s`
                    : `${currentIndex + 1}/${questions.length}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {combo >= 2 && (
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-pink-500 to-orange-400 p-4 text-white shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.2em]">Combo</p>
          <p className="mt-1 text-2xl font-black">🔥 {combo} câu đúng liên tiếp</p>
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-3">
        <button
          onClick={speakQuestionGuide}
          className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50"
        >
          {isSpeaking ? 'Đang đọc...' : '🔊 Nghe hướng dẫn'}
        </button>

        {selectedLevel.mode !== 'match-meaning' && (
          <button
            onClick={handleReplayAudio}
            className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-200"
          >
            🔊 Nghe từ
          </button>
        )}

        <button
          onClick={handleSpeakMeaning}
          className="rounded-full bg-sky-100 px-4 py-2 text-sm font-bold text-sky-700 transition hover:bg-sky-200"
        >
          🇻🇳 Nghe nghĩa
        </button>
      </div>

      <div className="mb-6 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-600">
          <span>Tiến độ</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-emerald-600">
                {selectedLevel.mode === 'listen-and-choose'
                  ? 'Nghe từ'
                  : selectedLevel.mode === 'match-meaning'
                  ? 'Ghép từ với nghĩa'
                  : selectedLevel.mode === 'quick-challenge'
                  ? 'Trả lời thật nhanh'
                  : 'Quan sát hình'}
              </p>
              <h2 className="text-2xl font-black text-slate-900">
                {selectedLevel.mode === 'listen-and-choose'
                  ? 'Listen and choose'
                  : selectedLevel.mode === 'match-meaning'
                  ? 'Match word with meaning'
                  : selectedLevel.mode === 'quick-challenge'
                  ? 'Quick challenge'
                  : 'What is this?'}
              </h2>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedLevel(null)}
                className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                Quay lại
              </button>
              <Link
                href="/games"
                className="inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                Về kho trò chơi
              </Link>
            </div>
          </div>

          <div className="flex min-h-[320px] items-center justify-center rounded-[28px] border-2 border-dashed border-emerald-200 bg-emerald-50">
            <div className="text-center">
              {selectedLevel.mode === 'match-meaning' ? (
                <>
                  <div className="mb-4 text-4xl font-black tracking-tight text-slate-900 sm:text-6xl">
                    {currentQuestion.word}
                  </div>
                  <p className="text-lg font-bold text-slate-700">
                    Bé hãy chọn nghĩa tiếng Việt đúng nhé
                  </p>
                </>
              ) : (
                <>
                  <div className="mb-4 text-[110px] leading-none sm:text-[140px]">
                    {currentQuestion.image}
                  </div>

                  {selectedLevel.mode === 'look-and-choose' ||
                  selectedLevel.mode === 'quick-challenge' ? (
                    <>
                      <p className="text-lg font-bold text-slate-700">
                        Bé hãy chọn từ tiếng Anh đúng nhé
                      </p>
                      <p className="mt-2 text-sm text-slate-500">
                        Nghĩa tiếng Việt: {currentQuestion.meaning}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-lg font-bold text-slate-700">
                        Bé hãy nghe từ rồi chọn đáp án đúng nhé
                      </p>
                      <div className="mt-4 flex flex-wrap justify-center gap-3">
                        <button
                          onClick={handleReplayAudio}
                          className="rounded-full bg-emerald-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
                        >
                          🔊 Nghe lại
                        </button>

                        {recordingSupported && (
                          <>
                            {!isRecording ? (
                              <button
                                onClick={handleStartRecording}
                                className="rounded-full bg-sky-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-sky-600"
                              >
                                🎙 Ghi âm
                              </button>
                            ) : (
                              <button
                                onClick={handleStopRecording}
                                className="rounded-full bg-rose-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-rose-600"
                              >
                                ⏹ Dừng ghi
                              </button>
                            )}
                          </>
                        )}

                        {recordedAudioUrl && (
                          <audio controls src={recordedAudioUrl} className="mt-2 w-full max-w-xs" />
                        )}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <div className="mb-5 rounded-3xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
            <div className="flex items-start gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
                🐻
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-600">Gấu nhỏ nhắn bé</p>
                <p className="mt-1 text-sm leading-6 text-slate-700">
                  {selectedLevel.mode === 'listen-and-choose'
                    ? 'Mình cùng nghe thật kỹ rồi chọn từ đúng nhé.'
                    : selectedLevel.mode === 'match-meaning'
                    ? 'Mình cùng ghép từ tiếng Anh với nghĩa tiếng Việt nhé.'
                    : selectedLevel.mode === 'quick-challenge'
                    ? 'Trả lời thật nhanh để ghi điểm cao nhất nhé.'
                    : 'Mình cùng nhìn hình và học từ mới tiếng Anh nhé.'}
                </p>
              </div>
            </div>
          </div>

          <p className="mb-2 text-sm font-bold text-emerald-600">Chọn đáp án</p>
          <h3 className="mb-5 text-2xl font-black text-slate-900">
            {selectedLevel.mode === 'match-meaning' ? 'Nghĩa tiếng Việt' : 'English word'}
          </h3>

          <div className="space-y-3">
            {answerOptions.map((answer) => {
              const isSelected = selectedAnswer === answer;
              const isRightAnswer = answer === correctAnswer;

              let buttonClass =
                'w-full rounded-2xl border px-4 py-4 text-left text-lg font-bold transition duration-200';

              if (!selectedAnswer) {
                buttonClass +=
                  ' border-slate-200 bg-slate-50 text-slate-800 hover:border-emerald-300 hover:bg-emerald-50';
              } else if (isSelected && isCorrect) {
                buttonClass += ' border-emerald-300 bg-emerald-50 text-emerald-700';
              } else if (isSelected && !isCorrect) {
                buttonClass += ' border-rose-300 bg-rose-50 text-rose-700';
              } else if (!isSelected && isRightAnswer && !isCorrect) {
                buttonClass += ' border-emerald-300 bg-emerald-50 text-emerald-700';
              } else {
                buttonClass += ' border-slate-200 bg-slate-100 text-slate-400';
              }

              return (
                <button
                  key={answer}
                  onClick={() => handleChooseAnswer(answer)}
                  disabled={!!selectedAnswer}
                  className={buttonClass}
                >
                  {answer}
                </button>
              );
            })}
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4">
            {isCorrect === null && (
              <p className="text-sm font-medium text-slate-600">
                {selectedLevel.mode === 'listen-and-choose'
                  ? 'Bé hãy nghe từ và chọn đáp án đúng nhé.'
                  : selectedLevel.mode === 'match-meaning'
                  ? 'Bé hãy chọn nghĩa tiếng Việt phù hợp nhé.'
                  : 'Bé hãy nhìn hình và chọn từ tiếng Anh phù hợp nhé.'}
              </p>
            )}

            {isCorrect === true && (
              <div>
                <p className="text-base font-bold text-emerald-600">Correct! 🎉</p>
                <p className="mt-1 text-sm text-slate-600">
                  Đáp án đúng là <span className="font-bold">{correctAnswer}</span>.
                </p>
              </div>
            )}

            {isCorrect === false && (
              <div>
                <p className="text-base font-bold text-rose-600">Oops, chưa đúng 😊</p>
                <p className="mt-1 text-sm text-slate-600">
                  Đáp án đúng là <span className="font-bold">{correctAnswer}</span>.
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handleNext}
            className="mt-6 w-full rounded-2xl bg-emerald-500 px-5 py-4 text-base font-bold text-white shadow-sm transition hover:bg-emerald-600"
          >
            {selectedLevel.mode === 'quick-challenge'
              ? 'Câu tiếp theo'
              : currentIndex < questions.length - 1
              ? 'Câu tiếp theo'
              : 'Xem kết quả'}
          </button>
        </div>
      </div>
    </section>
  );
}
