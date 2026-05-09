'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';

type DifficultyKey = 'easy' | 'medium' | 'hard';
type GameMode = 'solo' | 'quick' | 'two-player';
type ViewMode = 'menu' | 'game' | 'result' | 'achievements' | 'stickers' | 'history';

type DifficultyConfig = {
  key: DifficultyKey;
  title: string;
  description: string;
  pairCount: number;
  timeLimit: number;
  badge: string;
};

type MemoryCard = {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
  matchedBy?: 1 | 2;
};

type StickerItem = {
  id: string;
  emoji: string;
  title: string;
  description: string;
};

type MemoryProgress = Record<
  DifficultyKey,
  {
    bestMoves: number | null;
    bestTime: number | null;
    wins: number;
    stars: number;
  }
>;

type MatchHistoryItem = {
  id: string;
  createdAt: number;
  mode: GameMode;
  difficulty: DifficultyKey;
  won: boolean;
  moves: number;
  timeUsed: number;
  stars: number;
  player1Score?: number;
  player2Score?: number;
  winnerLabel?: string;
};

type IconThemeKey = 'animals' | 'fruits' | 'vehicles' | 'nature' | 'toys';

type IconTheme = {
  key: IconThemeKey;
  label: string;
  icons: string[];
};

const PROGRESS_KEY = 'memory-hunt-progress-v3';
const STICKER_KEY = 'memory-hunt-stickers-v2';
const WIN_STREAK_KEY = 'memory-hunt-win-streak-v2';
const HISTORY_KEY = 'memory-hunt-history-v1';
const SOUND_ENABLED_KEY = 'memory-hunt-sound-enabled-v1';
const SPEECH_ENABLED_KEY = 'memory-hunt-speech-enabled-v1';

const iconThemes: IconTheme[] = [
  {
    key: 'animals',
    label: 'Con vật',
    icons: ['🐻', '🐼', '🦊', '🐰', '🐶', '🐱', '🐸', '🐵', '🦁', '🐯'],
  },
  {
    key: 'fruits',
    label: 'Trái cây',
    icons: ['🍎', '🍓', '🍊', '🍋', '🍉', '🍇', '🍒', '🥝', '🥭', '🍍'],
  },
  {
    key: 'vehicles',
    label: 'Phương tiện',
    icons: ['🚗', '🚕', '🚌', '🚓', '🚑', '🚒', '🚜', '✈️', '🚲', '🚂'],
  },
  {
    key: 'nature',
    label: 'Thiên nhiên',
    icons: ['🌈', '⭐', '☀️', '🌙', '⚡', '☁️', '🌸', '🍀', '🌻', '🍄'],
  },
  {
    key: 'toys',
    label: 'Đồ chơi vui nhộn',
    icons: ['🎈', '🎁', '🎀', '🪀', '⚽', '🏀', '🧩', '🎵', '🪁', '🎮'],
  },
];

const difficultyConfigs: DifficultyConfig[] = [
  {
    key: 'easy',
    title: 'Dễ',
    description: '6 thẻ, phù hợp để bé bắt đầu làm quen.',
    pairCount: 3,
    timeLimit: 45,
    badge: 'Khởi động',
  },
  {
    key: 'medium',
    title: 'Vừa',
    description: '12 thẻ, tăng khả năng ghi nhớ và tập trung.',
    pairCount: 6,
    timeLimit: 70,
    badge: 'Thử thách',
  },
  {
    key: 'hard',
    title: 'Khó',
    description: '16 thẻ, đòi hỏi bé nhớ tốt và quan sát nhanh.',
    pairCount: 8,
    timeLimit: 100,
    badge: 'Siêu trí nhớ',
  },
];

const stickerCatalog: StickerItem[] = [
  {
    id: 'memory-first-win',
    emoji: '🌟',
    title: 'Chiến thắng đầu tiên',
    description: 'Hoàn thành một màn chơi ghi nhớ đầu tiên.',
  },
  {
    id: 'memory-easy-master',
    emoji: '🍀',
    title: 'Bé khởi động tốt',
    description: 'Hoàn thành cấp độ dễ.',
  },
  {
    id: 'memory-medium-master',
    emoji: '🏅',
    title: 'Trí nhớ tốt',
    description: 'Hoàn thành cấp độ vừa.',
  },
  {
    id: 'memory-hard-master',
    emoji: '👑',
    title: 'Siêu trí nhớ',
    description: 'Hoàn thành cấp độ khó.',
  },
  {
    id: 'memory-speedy',
    emoji: '⚡',
    title: 'Nhanh như chớp',
    description: 'Thắng chế độ thi nhanh.',
  },
  {
    id: 'memory-streak-3',
    emoji: '🔥',
    title: 'Chuỗi 3 chiến thắng',
    description: 'Thắng liên tiếp 3 màn chơi.',
  },
  {
    id: 'memory-duel',
    emoji: '🎭',
    title: 'Đấu trí vui nhộn',
    description: 'Hoàn thành một trận 2 người.',
  },
  {
    id: 'memory-perfect',
    emoji: '💎',
    title: 'Gần như hoàn hảo',
    description: 'Nhận 3 sao ở một màn chơi.',
  },
  {
    id: 'memory-quick-master',
    emoji: '🚀',
    title: 'Bậc thầy thi nhanh',
    description: 'Thắng chế độ thi nhanh với kết quả nổi bật.',
  },
  {
    id: 'memory-duel-champion',
    emoji: '🏆',
    title: 'Nhà vô địch đối đầu',
    description: 'Chiến thắng rõ ràng trong chế độ 2 người.',
  },
];

const playerMeta = {
  1: { name: 'Bạn 1', avatar: '🦊', color: 'bg-sky-50 ring-sky-200 text-sky-700' },
  2: { name: 'Bạn 2', avatar: '🐼', color: 'bg-pink-50 ring-pink-200 text-pink-700' },
} as const;

const emojiNameMap: Record<IconThemeKey, Record<string, string>> = {
  animals: {
    '🐻': 'con gấu',
    '🐼': 'gấu trúc',
    '🦊': 'con cáo',
    '🐰': 'con thỏ',
    '🐶': 'con chó',
    '🐱': 'con mèo',
    '🐸': 'con ếch',
    '🐵': 'con khỉ',
    '🦁': 'con sư tử',
    '🐯': 'con hổ',
  },
  fruits: {
    '🍎': 'quả táo',
    '🍓': 'quả dâu tây',
    '🍊': 'quả cam',
    '🍋': 'quả chanh',
    '🍉': 'quả dưa hấu',
    '🍇': 'chùm nho',
    '🍒': 'quả anh đào',
    '🥝': 'quả kiwi',
    '🥭': 'quả xoài',
    '🍍': 'quả dứa',
  },
  vehicles: {
    '🚗': 'ô tô',
    '🚕': 'xe taxi',
    '🚌': 'xe buýt',
    '🚓': 'xe cảnh sát',
    '🚑': 'xe cứu thương',
    '🚒': 'xe cứu hỏa',
    '🚜': 'xe máy kéo',
    '✈️': 'máy bay',
    '🚲': 'xe đạp',
    '🚂': 'tàu hỏa',
  },
  nature: {
    '🌈': 'cầu vồng',
    '⭐': 'ngôi sao',
    '☀️': 'mặt trời',
    '🌙': 'mặt trăng',
    '⚡': 'tia chớp',
    '☁️': 'đám mây',
    '🌸': 'bông hoa',
    '🍀': 'cỏ bốn lá',
    '🌻': 'hoa hướng dương',
    '🍄': 'cây nấm',
  },
  toys: {
    '🎈': 'quả bóng bay',
    '🎁': 'hộp quà',
    '🎀': 'chiếc nơ',
    '🪀': 'đồ chơi yo yo',
    '⚽': 'quả bóng đá',
    '🏀': 'quả bóng rổ',
    '🧩': 'miếng ghép',
    '🎵': 'nốt nhạc',
    '🪁': 'cánh diều',
    '🎮': 'tay cầm chơi game',
  },
};

function shuffleArray<T>(items: T[]): T[] {
  const cloned = [...items];
  for (let i = cloned.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
  }
  return cloned;
}

function buildDeck(pairCount: number, theme: IconTheme): MemoryCard[] {
  const randomIcons = shuffleArray(theme.icons).slice(0, pairCount);
  const duplicated = [...randomIcons, ...randomIcons];

  return shuffleArray(duplicated).map((emoji, index) => ({
    id: index + 1,
    emoji,
    isFlipped: false,
    isMatched: false,
  }));
}

function buildInitialProgress(): MemoryProgress {
  return {
    easy: { bestMoves: null, bestTime: null, wins: 0, stars: 0 },
    medium: { bestMoves: null, bestTime: null, wins: 0, stars: 0 },
    hard: { bestMoves: null, bestTime: null, wins: 0, stars: 0 },
  };
}

function loadProgress(): MemoryProgress {
  if (typeof window === 'undefined') return buildInitialProgress();
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    if (!raw) return buildInitialProgress();
    return { ...buildInitialProgress(), ...JSON.parse(raw) };
  } catch {
    return buildInitialProgress();
  }
}

function saveProgress(progress: MemoryProgress) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

function loadUnlockedStickers(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STICKER_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

function saveUnlockedStickers(stickers: string[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STICKER_KEY, JSON.stringify(stickers));
}

function loadWinStreak(): number {
  if (typeof window === 'undefined') return 0;
  const raw = window.localStorage.getItem(WIN_STREAK_KEY);
  return raw ? Number(raw) || 0 : 0;
}

function saveWinStreak(value: number) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(WIN_STREAK_KEY, String(value));
}

function loadHistory(): MatchHistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as MatchHistoryItem[];
  } catch {
    return [];
  }
}

function saveHistory(history: MatchHistoryItem[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function pushHistoryItem(item: MatchHistoryItem): MatchHistoryItem[] {
  const current = loadHistory();
  const updated = [item, ...current].slice(0, 10);
  saveHistory(updated);
  return updated;
}

function loadBooleanSetting(key: string, fallback = true): boolean {
  if (typeof window === 'undefined') return fallback;
  const raw = window.localStorage.getItem(key);
  if (raw === null) return fallback;
  return raw === 'true';
}

function saveBooleanSetting(key: string, value: boolean) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, String(value));
}

function getStickerReward(difficulty: DifficultyConfig | null, moves: number): StickerItem {
  if (!difficulty) return stickerCatalog[0];
  if (difficulty.key === 'easy') return stickerCatalog[1];
  if (difficulty.key === 'medium') return stickerCatalog[2];
  if (moves <= 10) return stickerCatalog[7];
  return stickerCatalog[3];
}

function getMascotMessage(
  matchedCount: number,
  totalPairs: number,
  timeLeft: number,
  isWin: boolean,
  mode: GameMode,
  currentPlayer: 1 | 2
): string {
  if (isWin && mode === 'two-player') {
    return 'Hai bạn làm tốt lắm! Cùng xem ai thắng nhé!';
  }
  if (isWin) return 'Gấu nhỏ tự hào về bé lắm! Mình thắng rồi!';
  if (mode === 'quick' && timeLeft <= 8) return 'Nhanh lên bé nhé, sắp hết giờ rồi!';
  if (mode === 'two-player') return `Đến lượt ${playerMeta[currentPlayer].name}, bình tĩnh và nhớ thật kỹ nhé!`;
  if (matchedCount === 0) return 'Mình cùng lật thẻ thật cẩn thận nhé!';
  if (matchedCount < totalPairs / 2) return 'Bé nhớ rất tốt rồi, mình tiếp tục nào!';
  if (timeLeft <= 10) return 'Chỉ còn ít thời gian thôi, cố lên bé nhé!';
  return 'Chỉ còn vài cặp nữa thôi, cố lên bé nhé!';
}

function getStarsForWin(difficulty: DifficultyConfig, moves: number, timeUsed: number): number {
  if (difficulty.key === 'easy') {
    if (moves <= 4 && timeUsed <= 20) return 3;
    if (moves <= 6 && timeUsed <= 30) return 2;
    return 1;
  }

  if (difficulty.key === 'medium') {
    if (moves <= 10 && timeUsed <= 35) return 3;
    if (moves <= 14 && timeUsed <= 50) return 2;
    return 1;
  }

  if (moves <= 14 && timeUsed <= 55) return 3;
  if (moves <= 20 && timeUsed <= 75) return 2;
  return 1;
}

function formatTimestamp(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleString('vi-VN');
}

export default function MemoryHuntPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('menu');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyConfig | null>(null);
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showWin, setShowWin] = useState(false);
  const [showLose, setShowLose] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>('solo');
  const [progress, setProgress] = useState<MemoryProgress>(buildInitialProgress());
  const [unlockedStickerIds, setUnlockedStickerIds] = useState<string[]>([]);
  const [winStreak, setWinStreak] = useState(0);
  const [history, setHistory] = useState<MatchHistoryItem[]>([]);
  const [currentTheme, setCurrentTheme] = useState<IconTheme | null>(null);

  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const resultHandledRef = useRef(false);
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
    duration = 0.18,
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
    await playTone(420, 0.08, 'triangle');
  };

  const playMatchSound = async () => {
    await playTone(680, 0.12, 'sine');
    setTimeout(() => {
      playTone(900, 0.14, 'sine');
    }, 110);
  };

  const playMismatchSound = async () => {
    await playTone(300, 0.1, 'triangle');
    setTimeout(() => {
      playTone(220, 0.16, 'triangle');
    }, 100);
  };

  const playWinSound = async () => {
    await playTone(700, 0.12, 'sine');
    setTimeout(() => playTone(900, 0.12, 'sine'), 120);
    setTimeout(() => playTone(1100, 0.18, 'sine'), 240);
  };

  const playLoseSound = async () => {
    await playTone(260, 0.16, 'triangle');
    setTimeout(() => playTone(180, 0.22, 'triangle'), 120);
  };

  const playVictoryMelody = () => {
    if (!soundEnabled || typeof window === 'undefined') return;

    const AudioContextClass =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const gain = ctx.createGain();
    gain.connect(ctx.destination);

    const notes = [
      { freq: 523.25, duration: 0.16 },
      { freq: 659.25, duration: 0.16 },
      { freq: 783.99, duration: 0.18 },
      { freq: 1046.5, duration: 0.28 },
    ];

    let currentTime = ctx.currentTime;

    notes.forEach((note) => {
      const oscillator = ctx.createOscillator();
      const noteGain = ctx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(note.freq, currentTime);

      oscillator.connect(noteGain);
      noteGain.connect(gain);

      noteGain.gain.setValueAtTime(0.001, currentTime);
      noteGain.gain.linearRampToValueAtTime(0.12, currentTime + 0.02);
      noteGain.gain.exponentialRampToValueAtTime(0.001, currentTime + note.duration);

      oscillator.start(currentTime);
      oscillator.stop(currentTime + note.duration);

      currentTime += note.duration * 0.9;
    });
  };

  const speakText = (text: string) => {
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

  const getEmojiReadableName = (emoji: string) => {
    if (!currentTheme) return 'hình này';
    return emojiNameMap[currentTheme.key]?.[emoji] ?? 'hình này';
  };

  const speakThemeGuide = () => {
    if (!selectedDifficulty || !currentTheme) return;

    if (gameMode === 'two-player') {
      speakText(
        `Chủ đề ${currentTheme.label}. Hai bạn thay nhau lật thẻ và tìm hai hình giống nhau.`
      );
      return;
    }

    if (gameMode === 'quick') {
      speakText(
        `Chủ đề ${currentTheme.label}. Bé hãy tìm thật nhanh các cặp hình giống nhau trước khi hết giờ.`
      );
      return;
    }

    speakText(
      `Chủ đề ${currentTheme.label}. Bé hãy lật thẻ và tìm hai hình giống nhau.`
    );
  };

  useEffect(() => {
    setProgress(loadProgress());
    setUnlockedStickerIds(loadUnlockedStickers());
    setWinStreak(loadWinStreak());
    setHistory(loadHistory());
    setSoundEnabled(loadBooleanSetting(SOUND_ENABLED_KEY, true));
    setSpeechEnabled(loadBooleanSetting(SPEECH_ENABLED_KEY, true));
  }, []);

  useEffect(() => {
    saveBooleanSetting(SOUND_ENABLED_KEY, soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    saveBooleanSetting(SPEECH_ENABLED_KEY, speechEnabled);
  }, [speechEnabled]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const flippedCards = useMemo(
    () => cards.filter((card) => card.isFlipped && !card.isMatched),
    [cards]
  );

  const matchedCount = useMemo(
    () => cards.filter((card) => card.isMatched).length / 2,
    [cards]
  );

  const totalPairs = selectedDifficulty?.pairCount ?? 0;
  const isWin = totalPairs > 0 && matchedCount === totalPairs;
  const progressPercent = totalPairs > 0 ? (matchedCount / totalPairs) * 100 : 0;
  const mascotMessage = getMascotMessage(
    matchedCount,
    totalPairs,
    timeLeft,
    isWin,
    gameMode,
    currentPlayer
  );
  const stickerReward = getStickerReward(selectedDifficulty, moves);
  const timeUsed = selectedDifficulty ? selectedDifficulty.timeLimit - timeLeft : 0;
  const stars =
    selectedDifficulty && showWin && gameMode !== 'two-player'
      ? getStarsForWin(selectedDifficulty, moves, timeUsed)
      : 0;

  const leaderboard = useMemo(() => {
    return difficultyConfigs
      .map((difficulty) => ({
        difficulty,
        progress: progress[difficulty.key],
      }))
      .sort((a, b) => {
        if (b.progress.stars !== a.progress.stars) return b.progress.stars - a.progress.stars;
        if (a.progress.bestMoves === null) return 1;
        if (b.progress.bestMoves === null) return -1;
        return a.progress.bestMoves - b.progress.bestMoves;
      });
  }, [progress]);

  const addSticker = (stickerId: string) => {
    setUnlockedStickerIds((prev) => {
      if (prev.includes(stickerId)) return prev;
      const updated = [...prev, stickerId];
      saveUnlockedStickers(updated);
      return updated;
    });
  };

  useEffect(() => {
    if (!selectedDifficulty || showWin || showLose || gameMode === 'two-player') return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }

          setShowLose(true);
          setViewMode('result');
          saveWinStreak(0);
          setWinStreak(0);

          const newHistory = pushHistoryItem({
            id: `${Date.now()}-lose`,
            createdAt: Date.now(),
            mode: gameMode,
            difficulty: selectedDifficulty.key,
            won: false,
            moves,
            timeUsed: selectedDifficulty.timeLimit,
            stars: 0,
          });
          setHistory(newHistory);

          playLoseSound();
          speakText('Hết giờ rồi. Mình thử lại nhé');
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [selectedDifficulty, showWin, showLose, gameMode, moves]);

  useEffect(() => {
    if (viewMode !== 'game' || !selectedDifficulty || !currentTheme) return;

    const timer = setTimeout(() => {
      speakThemeGuide();
    }, 500);

    return () => clearTimeout(timer);
  }, [viewMode, selectedDifficulty, currentTheme, gameMode]);

  useEffect(() => {
    if (viewMode !== 'game') return;
    if (showWin || showLose) return;
    if (gameMode !== 'quick') return;

    if (timeLeft === 8) {
      speakText('Còn 8 giây thôi, nhanh lên nhé');
    }
  }, [timeLeft, viewMode, showWin, showLose, gameMode]);

  useEffect(() => {
    if (flippedCards.length !== 2) return;

    const [first, second] = flippedCards;
    setLocked(true);

    if (first.emoji === second.emoji) {
      const owner = gameMode === 'two-player' ? currentPlayer : undefined;

      const timer = setTimeout(() => {
        setCards((prev) =>
          prev.map((card) =>
            card.id === first.id || card.id === second.id
              ? { ...card, isMatched: true, matchedBy: owner }
              : card
          )
        );

        if (gameMode === 'two-player') {
          if (currentPlayer === 1) {
            setPlayer1Score((prev) => prev + 1);
            speakText(`Bạn 1 ghép đúng. Đây là ${getEmojiReadableName(first.emoji)}`);
          } else {
            setPlayer2Score((prev) => prev + 1);
            speakText(`Bạn 2 ghép đúng. Đây là ${getEmojiReadableName(first.emoji)}`);
          }
        } else {
          speakText(`Giỏi lắm. Đây là ${getEmojiReadableName(first.emoji)}`);
        }

        setLocked(false);
        playMatchSound();
      }, 450);

      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setCards((prev) =>
        prev.map((card) =>
          card.id === first.id || card.id === second.id
            ? { ...card, isFlipped: false }
            : card
        )
      );

      playMismatchSound();

      if (gameMode === 'two-player') {
        const nextPlayer = currentPlayer === 1 ? 2 : 1;
        setCurrentPlayer(nextPlayer);
        speakText(`Chưa khớp. Đến lượt ${playerMeta[nextPlayer].name}`);
      } else {
        speakText('Hai thẻ chưa giống nhau. Bé thử lại nhé');
      }

      setLocked(false);
    }, 900);

    return () => clearTimeout(timer);
  }, [flippedCards, currentPlayer, gameMode]);

  useEffect(() => {
    if (!isWin || !selectedDifficulty || resultHandledRef.current) return;
    resultHandledRef.current = true;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setShowWin(true);
    setViewMode('result');
    playWinSound();
    playVictoryMelody();

    if (gameMode === 'two-player') {
      addSticker('memory-duel');
      if (Math.abs(player1Score - player2Score) >= 2) {
        addSticker('memory-duel-champion');
      }

      const winnerLabel =
        player1Score === player2Score
          ? 'Hòa'
          : player1Score > player2Score
          ? playerMeta[1].name
          : playerMeta[2].name;

      speakText(
        player1Score === player2Score
          ? 'Hai bạn hòa nhau rồi'
          : `${winnerLabel} chiến thắng`
      );

      const newHistory = pushHistoryItem({
        id: `${Date.now()}-duel`,
        createdAt: Date.now(),
        mode: 'two-player',
        difficulty: selectedDifficulty.key,
        won: true,
        moves,
        timeUsed,
        stars: 0,
        player1Score,
        player2Score,
        winnerLabel,
      });
      setHistory(newHistory);
      return;
    }

    const earnedStars = getStarsForWin(
      selectedDifficulty,
      moves,
      selectedDifficulty.timeLimit - timeLeft
    );

    setProgress((prev) => {
      const current = prev[selectedDifficulty.key];
      const updated: MemoryProgress = {
        ...prev,
        [selectedDifficulty.key]: {
          bestMoves: current.bestMoves === null ? moves : Math.min(current.bestMoves, moves),
          bestTime:
            current.bestTime === null
              ? selectedDifficulty.timeLimit - timeLeft
              : Math.min(current.bestTime, selectedDifficulty.timeLimit - timeLeft),
          wins: current.wins + 1,
          stars: Math.max(current.stars, earnedStars),
        },
      };

      saveProgress(updated);
      return updated;
    });

    const nextStreak = winStreak + 1;
    setWinStreak(nextStreak);
    saveWinStreak(nextStreak);

    addSticker('memory-first-win');
    if (selectedDifficulty.key === 'easy') addSticker('memory-easy-master');
    if (selectedDifficulty.key === 'medium') addSticker('memory-medium-master');
    if (selectedDifficulty.key === 'hard') addSticker('memory-hard-master');
    if (earnedStars === 3) addSticker('memory-perfect');
    if (gameMode === 'quick') {
      addSticker('memory-speedy');
      if (moves <= 12) addSticker('memory-quick-master');
    }
    if (nextStreak >= 3) addSticker('memory-streak-3');

    const newHistory = pushHistoryItem({
      id: `${Date.now()}-win`,
      createdAt: Date.now(),
      mode: gameMode,
      difficulty: selectedDifficulty.key,
      won: true,
      moves,
      timeUsed: selectedDifficulty.timeLimit - timeLeft,
      stars: earnedStars,
    });
    setHistory(newHistory);

    speakText('Chúc mừng bé. Bạn nhỏ đã hoàn thành màn chơi ghi nhớ');
  }, [
    isWin,
    selectedDifficulty,
    gameMode,
    moves,
    timeLeft,
    player1Score,
    player2Score,
    timeUsed,
    winStreak,
  ]);

  const startGame = (difficulty: DifficultyConfig, mode: GameMode = 'solo') => {
    resultHandledRef.current = false;

    const randomTheme = shuffleArray(iconThemes)[0];

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setCurrentTheme(randomTheme);
    setSelectedDifficulty(difficulty);
    setCards(buildDeck(difficulty.pairCount, randomTheme));
    setMoves(0);
    setLocked(false);
    setTimeLeft(mode === 'quick' ? Math.min(30, difficulty.timeLimit) : difficulty.timeLimit);
    setShowWin(false);
    setShowLose(false);
    setGameMode(mode);
    setCurrentPlayer(1);
    setPlayer1Score(0);
    setPlayer2Score(0);
    setViewMode('game');
  };

  const handleFlip = async (id: number) => {
    if (locked || showWin || showLose) return;

    const targetCard = cards.find((card) => card.id === id);
    if (!targetCard || targetCard.isFlipped || targetCard.isMatched) return;
    if (flippedCards.length >= 2) return;

    playFlipSound();

    setCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, isFlipped: true } : card))
    );

    speakText(getEmojiReadableName(targetCard.emoji));

    if (flippedCards.length === 1) {
      setMoves((prev) => prev + 1);
    }
  };

  const handleRestart = () => {
    if (!selectedDifficulty) return;
    startGame(selectedDifficulty, gameMode);
  };

  const handleBackToMenu = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    resultHandledRef.current = false;
    setSelectedDifficulty(null);
    setCards([]);
    setMoves(0);
    setLocked(false);
    setTimeLeft(0);
    setShowWin(false);
    setShowLose(false);
    setGameMode('solo');
    setCurrentPlayer(1);
    setPlayer1Score(0);
    setPlayer2Score(0);
    setCurrentTheme(null);
    setViewMode('menu');
  };

  const gridColsClass = selectedDifficulty?.key === 'easy' ? 'grid-cols-3' : 'grid-cols-4';

  if (viewMode === 'menu') {
    return (
      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-[28px] bg-gradient-to-r from-violet-500 to-fuchsia-500 p-6 text-white shadow-lg">
          <p className="mb-2 inline-flex rounded-full bg-white/20 px-3 py-1 text-sm font-semibold">
            Trò chơi ghi nhớ
          </p>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            Săn hình ghi nhớ
          </h1>
          <div className="mt-3 flex flex-wrap gap-2">
            {currentTheme && (
              <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white">
                Chủ đề gần nhất: {currentTheme.label}
              </span>
            )}
          </div>
          <p className="mt-2 max-w-2xl text-sm text-white/90 sm:text-base">
            Chọn cấp độ, thi nhanh hoặc đấu 2 người để rèn trí nhớ thật vui.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => startGame(difficultyConfigs[1], 'quick')}
              className="rounded-full bg-white px-4 py-2 text-sm font-bold text-fuchsia-700 transition hover:bg-fuchsia-50"
            >
              Thi nhanh
            </button>
            <button
              onClick={() => startGame(difficultyConfigs[1], 'two-player')}
              className="rounded-full bg-white px-4 py-2 text-sm font-bold text-fuchsia-700 transition hover:bg-fuchsia-50"
            >
              Chế độ 2 người
            </button>
            <button
              onClick={() => setViewMode('achievements')}
              className="rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/30"
            >
              Xem thành tích
            </button>
            <button
              onClick={() => setViewMode('stickers')}
              className="rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/30"
            >
              Bộ sticker
            </button>
            <button
              onClick={() => setViewMode('history')}
              className="rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/30"
            >
              Lịch sử 10 trận
            </button>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-3">
          <button
            onClick={() => setSoundEnabled((prev) => !prev)}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              soundEnabled ? 'bg-fuchsia-100 text-fuchsia-700' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {soundEnabled ? '🔊 Bật hiệu ứng' : '🔇 Tắt hiệu ứng'}
          </button>

          <button
            onClick={() => setSpeechEnabled((prev) => !prev)}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              speechEnabled ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {speechEnabled ? '🗣️ Bật giọng đọc' : '🤫 Tắt giọng đọc'}
          </button>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <p className="text-sm font-semibold text-slate-500">Chuỗi thắng hiện tại</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{winStreak}</p>
          </div>
          <div className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <p className="text-sm font-semibold text-slate-500">Sticker đã mở</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{unlockedStickerIds.length}</p>
          </div>
          <div className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <p className="text-sm font-semibold text-slate-500">Tổng số trận</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{history.length}</p>
          </div>
          <div className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <p className="text-sm font-semibold text-slate-500">Đứng đầu mini board</p>
            <p className="mt-2 text-2xl font-black text-slate-900">
              {leaderboard[0]?.difficulty.title ?? '-'}
            </p>
          </div>
        </div>

        <div className="mb-6 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h2 className="text-2xl font-black text-slate-900">Bảng xếp hạng mini</h2>
          <div className="mt-4 space-y-3">
            {leaderboard.map((entry, index) => (
              <div
                key={entry.difficulty.key}
                className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white font-black text-slate-900 ring-1 ring-slate-200">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-black text-slate-900">{entry.difficulty.title}</p>
                    <p className="text-sm text-slate-500">
                      Sao: {entry.progress.stars}/3 • Best moves: {entry.progress.bestMoves ?? '-'}
                    </p>
                  </div>
                </div>
                <div className="text-xl">
                  {[1, 2, 3].map((star) => (
                    <span key={star}>{star <= entry.progress.stars ? '⭐' : '☆'}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {difficultyConfigs.map((difficulty) => {
            const item = progress[difficulty.key];

            return (
              <button
                key={difficulty.key}
                onClick={() => startGame(difficulty, 'solo')}
                className="rounded-[28px] bg-white p-5 text-left shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-fuchsia-100 text-2xl">
                    🧠
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                    {difficulty.badge}
                  </span>
                </div>

                <h3 className="mt-4 text-2xl font-black text-slate-900">{difficulty.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{difficulty.description}</p>

                <div className="mt-4 flex flex-wrap gap-2 text-sm">
                  <span className="rounded-full bg-fuchsia-50 px-3 py-1.5 font-semibold text-fuchsia-700">
                    {difficulty.pairCount * 2} thẻ
                  </span>
                  <span className="rounded-full bg-amber-50 px-3 py-1.5 font-semibold text-amber-700">
                    {difficulty.timeLimit} giây
                  </span>
                </div>

                <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">
                  <p>
                    Thắng: <span className="font-bold">{item.wins}</span>
                  </p>
                  <p>
                    Best moves: <span className="font-bold">{item.bestMoves ?? '-'}</span>
                  </p>
                  <p>
                    Best time: <span className="font-bold">{item.bestTime ?? '-'}s</span>
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-1 text-xl">
                  {[1, 2, 3].map((star) => (
                    <span key={star}>{star <= item.stars ? '⭐' : '☆'}</span>
                  ))}
                </div>

                <div className="mt-5 rounded-full bg-slate-900 px-4 py-3 text-center text-sm font-bold text-white">
                  Bắt đầu chơi
                </div>
              </button>
            );
          })}
        </div>
      </section>
    );
  }

  if (viewMode === 'stickers') {
    return (
      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-[28px] bg-gradient-to-r from-pink-500 to-fuchsia-500 p-6 text-white shadow-lg">
          <p className="mb-2 inline-flex rounded-full bg-white/20 px-3 py-1 text-sm font-semibold">
            Bộ sưu tập
          </p>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Sticker ghi nhớ</h1>
          <p className="mt-2 text-white/90">
            Bạn nhỏ đã mở {unlockedStickerIds.length}/{stickerCatalog.length} sticker.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stickerCatalog.map((sticker) => {
            const unlocked = unlockedStickerIds.includes(sticker.id);

            return (
              <div
                key={sticker.id}
                className={`rounded-[28px] p-5 shadow-sm ring-1 ${
                  unlocked ? 'bg-white ring-slate-100' : 'bg-slate-100 ring-slate-200 opacity-70'
                }`}
              >
                <div className="text-5xl">{unlocked ? sticker.emoji : '🔒'}</div>
                <h3 className="mt-4 text-xl font-black text-slate-900">{sticker.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {unlocked ? sticker.description : 'Chưa mở khóa sticker này'}
                </p>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => setViewMode('menu')}
          className="mt-6 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
        >
          Quay lại
        </button>
      </section>
    );
  }

  if (viewMode === 'history') {
    return (
      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-[28px] bg-gradient-to-r from-sky-500 to-violet-500 p-6 text-white shadow-lg">
          <p className="mb-2 inline-flex rounded-full bg-white/20 px-3 py-1 text-sm font-semibold">
            Lịch sử
          </p>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">10 trận gần nhất</h1>
          <p className="mt-2 text-white/90">Theo dõi hành trình chơi gần đây của bé.</p>
        </div>

        <div className="space-y-3">
          {history.length === 0 ? (
            <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <p className="text-slate-600">Chưa có lịch sử trận đấu nào.</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-100"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-black text-slate-900">
                      {item.mode === 'solo'
                        ? 'Chơi thường'
                        : item.mode === 'quick'
                        ? 'Thi nhanh'
                        : '2 người'}{' '}
                      • {difficultyConfigs.find((d) => d.key === item.difficulty)?.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">{formatTimestamp(item.createdAt)}</p>
                  </div>

                  <div className="text-sm font-semibold text-slate-600">
                    {item.won ? 'Thắng' : 'Thua'}
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-4">
                  <div className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
                    Lượt: <span className="font-bold">{item.moves}</span>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
                    Thời gian: <span className="font-bold">{item.timeUsed}s</span>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
                    Sao: <span className="font-bold">{item.stars}</span>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
                    {item.mode === 'two-player' ? `KQ: ${item.winnerLabel ?? '-'}` : 'Trận solo'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <button
          onClick={() => setViewMode('menu')}
          className="mt-6 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
        >
          Quay lại
        </button>
      </section>
    );
  }

  if (viewMode === 'achievements') {
    return (
      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-[28px] bg-gradient-to-r from-sky-500 to-violet-500 p-6 text-white shadow-lg">
          <p className="mb-2 inline-flex rounded-full bg-white/20 px-3 py-1 text-sm font-semibold">
            Thành tích
          </p>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            Bảng thành tích ghi nhớ
          </h1>
          <p className="mt-2 text-white/90">
            Theo dõi kết quả tốt nhất của bé theo từng cấp độ.
          </p>
        </div>

        <div className="mb-6 rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <p className="text-sm font-semibold text-slate-500">Chuỗi thắng tốt nhất hiện tại</p>
          <p className="mt-2 text-3xl font-black text-slate-900">{winStreak}</p>
        </div>

        <div className="space-y-4">
          {difficultyConfigs.map((difficulty) => {
            const item = progress[difficulty.key];

            return (
              <div
                key={difficulty.key}
                className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-slate-100"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">{difficulty.title}</h2>
                    <p className="mt-1 text-sm text-slate-500">{difficulty.description}</p>
                  </div>

                  <div className="flex items-center gap-1 text-xl">
                    {[1, 2, 3].map((star) => (
                      <span key={star}>{star <= item.stars ? '⭐' : '☆'}</span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-500">Số lần thắng</p>
                    <p className="mt-2 text-2xl font-black text-slate-900">{item.wins}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-500">Best moves</p>
                    <p className="mt-2 text-2xl font-black text-slate-900">{item.bestMoves ?? '-'}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-500">Best time</p>
                    <p className="mt-2 text-2xl font-black text-slate-900">
                      {item.bestTime !== null ? `${item.bestTime}s` : '-'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => setViewMode('menu')}
          className="mt-6 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
        >
          Quay lại
        </button>
      </section>
    );
  }

  if (viewMode === 'result') {
    const winnerText =
      gameMode === 'two-player'
        ? player1Score === player2Score
          ? 'Hai bạn hòa nhau rồi!'
          : player1Score > player2Score
          ? `${playerMeta[1].avatar} ${playerMeta[1].name} chiến thắng!`
          : `${playerMeta[2].avatar} ${playerMeta[2].name} chiến thắng!`
        : showWin
        ? 'Bé làm rất tốt!'
        : 'Mình thử lại nhé!';

    return (
      <section className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[32px] bg-white p-8 text-center shadow-sm ring-1 ring-slate-100">
          {showWin && (
            <>
              <div className="pointer-events-none absolute left-6 top-6 text-3xl animate-bounce">🎉</div>
              <div className="pointer-events-none absolute right-8 top-10 text-2xl animate-pulse">✨</div>
              <div className="pointer-events-none absolute left-1/4 top-16 text-2xl animate-bounce">🎊</div>
              <div className="pointer-events-none absolute right-1/4 top-20 text-3xl animate-pulse">⭐</div>
            </>
          )}

          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-100 to-violet-100 text-5xl shadow-sm">
            {showWin ? stickerReward.emoji : '⏰'}
          </div>

          <p className="mt-4 text-sm font-bold uppercase tracking-[0.2em] text-fuchsia-600">
            {showWin ? 'Chiến thắng' : 'Hết giờ'}
          </p>
          <h2 className="mt-2 text-3xl font-black text-slate-900">{winnerText}</h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-500">Số lượt</p>
              <p className="mt-2 text-3xl font-black text-slate-900">{moves}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-500">Thời gian đã dùng</p>
              <p className="mt-2 text-3xl font-black text-slate-900">{timeUsed}s</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-500">
                {gameMode === 'two-player' ? 'Tỷ số' : 'Sao'}
              </p>
              <p className="mt-2 text-3xl font-black text-slate-900">
                {gameMode === 'two-player'
                  ? `${player1Score} - ${player2Score}`
                  : [1, 2, 3].map((star) => (star <= stars ? '⭐' : '☆')).join('')}
              </p>
            </div>
          </div>

          {gameMode === 'two-player' && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className={`rounded-2xl p-4 ring-1 ${playerMeta[1].color}`}>
                <div className="text-3xl">{playerMeta[1].avatar}</div>
                <p className="mt-2 font-black">{playerMeta[1].name}</p>
                <p className="mt-1 text-sm">Điểm: {player1Score}</p>
              </div>
              <div className={`rounded-2xl p-4 ring-1 ${playerMeta[2].color}`}>
                <div className="text-3xl">{playerMeta[2].avatar}</div>
                <p className="mt-2 font-black">{playerMeta[2].name}</p>
                <p className="mt-1 text-sm">Điểm: {player2Score}</p>
              </div>
            </div>
          )}

          {showWin && gameMode !== 'two-player' && (
            <div className="mt-6 rounded-3xl bg-gradient-to-br from-fuchsia-50 to-violet-50 p-6">
              <h3 className="text-2xl font-black text-slate-900">{stickerReward.title}</h3>
              <p className="mt-2 text-slate-600">{stickerReward.description}</p>
            </div>
          )}

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              onClick={handleRestart}
              className="rounded-full bg-fuchsia-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-fuchsia-600"
            >
              Chơi lại
            </button>
            <button
              onClick={handleBackToMenu}
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Về menu
            </button>
            <Link
              href="/games"
              className="inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Về kho trò chơi
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 rounded-[28px] bg-gradient-to-r from-violet-500 to-fuchsia-500 p-6 text-white shadow-lg sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 inline-flex rounded-full bg-white/20 px-3 py-1 text-sm font-semibold">
            {gameMode === 'quick'
              ? 'Chế độ thi nhanh'
              : gameMode === 'two-player'
              ? 'Chế độ 2 người'
              : 'Trò chơi ghi nhớ'}
          </p>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            Săn hình ghi nhớ - {selectedDifficulty?.title}
          </h1>
          <div className="mt-3 flex flex-wrap gap-2">
            {currentTheme && (
              <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white">
                Chủ đề: {currentTheme.label}
              </span>
            )}
          </div>
          <p className="mt-2 max-w-2xl text-sm text-white/90 sm:text-base">
            {gameMode === 'two-player'
              ? 'Hai bạn thay nhau lật thẻ và tìm cặp giống nhau.'
              : gameMode === 'quick'
              ? 'Bé hãy tìm thật nhanh các cặp hình giống nhau trước khi hết giờ.'
              : selectedDifficulty?.description}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:min-w-[360px]">
          <div className="rounded-2xl bg-white/20 p-4 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/80">Số lượt</p>
            <p className="mt-1 text-2xl font-black">{moves}</p>
          </div>
          <div className="rounded-2xl bg-white/20 p-4 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/80">
              Cặp đã tìm
            </p>
            <p className="mt-1 text-2xl font-black">
              {matchedCount}/{totalPairs}
            </p>
          </div>
          <div className="rounded-2xl bg-white/20 p-4 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/80">
              {gameMode === 'two-player' ? 'Lượt chơi' : 'Thời gian'}
            </p>
            <p className="mt-1 text-2xl font-black">
              {gameMode === 'two-player'
                ? `${playerMeta[currentPlayer].avatar} ${currentPlayer}`
                : `${timeLeft}s`}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <button
          onClick={() => setSoundEnabled((prev) => !prev)}
          className={`rounded-full px-4 py-2 text-sm font-bold transition ${
            soundEnabled ? 'bg-fuchsia-100 text-fuchsia-700' : 'bg-slate-100 text-slate-700'
          }`}
        >
          {soundEnabled ? '🔊 Bật hiệu ứng' : '🔇 Tắt hiệu ứng'}
        </button>

        <button
          onClick={() => setSpeechEnabled((prev) => !prev)}
          className={`rounded-full px-4 py-2 text-sm font-bold transition ${
            speechEnabled ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-700'
          }`}
        >
          {speechEnabled ? '🗣️ Bật giọng đọc' : '🤫 Tắt giọng đọc'}
        </button>

        <button
          onClick={speakThemeGuide}
          className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50"
        >
          {isSpeaking ? 'Đang đọc...' : '🔊 Nghe hướng dẫn'}
        </button>
      </div>

      <div className="mb-6 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-600">
          <span>Tiến độ</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-fuchsia-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {gameMode === 'two-player' && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className={`rounded-2xl p-4 ring-1 ${playerMeta[1].color}`}>
            <div className="text-3xl">{playerMeta[1].avatar}</div>
            <p className="mt-2 font-black">{playerMeta[1].name}</p>
            <p className="mt-1 text-sm">Điểm: {player1Score}</p>
          </div>
          <div className={`rounded-2xl p-4 ring-1 ${playerMeta[2].color}`}>
            <div className="text-3xl">{playerMeta[2].avatar}</div>
            <p className="mt-2 font-black">{playerMeta[2].name}</p>
            <p className="mt-1 text-sm">Điểm: {player2Score}</p>
          </div>
        </div>
      )}

      <div className="mb-6 rounded-[28px] bg-amber-50 p-4 ring-1 ring-amber-100">
        <div className="flex items-start gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
            🐻
          </div>
          <div>
            <p className="text-sm font-bold text-orange-500">Gấu nhỏ nhắn bé</p>
            <p className="mt-1 text-sm leading-6 text-slate-700">{mascotMessage}</p>
          </div>
        </div>
      </div>

      <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-fuchsia-600">Lật thẻ và ghi nhớ</p>
            <h2 className="text-2xl font-black text-slate-900">Tìm đúng hai hình giống nhau</h2>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleRestart}
              className="rounded-full bg-fuchsia-50 px-4 py-2 text-sm font-semibold text-fuchsia-700 transition hover:bg-fuchsia-100"
            >
              Chơi lại
            </button>
            <button
              onClick={handleBackToMenu}
              className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              Về menu
            </button>
            <Link
              href="/games"
              className="inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Quay lại
            </Link>
          </div>
        </div>

        <div className={`grid ${gridColsClass} gap-3 sm:gap-4`}>
          {cards.map((card) => {
            const isOpen = card.isFlipped || card.isMatched;
            const matchedClass =
              card.matchedBy === 1
                ? 'border-sky-200 bg-sky-50'
                : card.matchedBy === 2
                ? 'border-pink-200 bg-pink-50'
                : 'border-emerald-200 bg-emerald-50';

            return (
              <button
                key={card.id}
                onClick={() => handleFlip(card.id)}
                className="group aspect-square [perspective:1000px]"
              >
                <div
                  className={`relative h-full w-full rounded-[24px] transition-transform duration-500 [transform-style:preserve-3d] ${
                    isOpen ? 'rotate-y-180' : ''
                  }`}
                >
                  <div className="absolute inset-0 flex items-center justify-center rounded-[24px] border-2 border-slate-200 bg-slate-100 text-4xl [backface-visibility:hidden] sm:text-5xl">
                    ❓
                  </div>

                  <div
                    className={`absolute inset-0 flex rotate-y-180 items-center justify-center rounded-[24px] border-2 text-4xl [backface-visibility:hidden] sm:text-5xl ${
                      card.isMatched ? matchedClass : 'border-fuchsia-200 bg-fuchsia-50'
                    }`}
                  >
                    {card.emoji}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 rounded-2xl bg-slate-50 p-4">
          {!showWin && !showLose ? (
            <p className="text-sm text-slate-600">
              Bé hãy nhớ vị trí các hình vừa lật lên để tìm được cặp giống nhau nhanh nhất nhé.
            </p>
          ) : showWin ? (
            <p className="text-sm font-semibold text-emerald-700">
              Hoàn thành xuất sắc. Bạn nhỏ đã rèn rất tốt khả năng ghi nhớ và quan sát.
            </p>
          ) : (
            <p className="text-sm font-semibold text-rose-700">
              Hết giờ rồi. Không sao nhé, mình thử lại để làm tốt hơn nào.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}