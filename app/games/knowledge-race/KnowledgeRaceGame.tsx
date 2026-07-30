'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import confetti from 'canvas-confetti';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { playGameSound } from '@/app/components/edu/utils/gameSound';
import { speakText, stopSpeaking, unlockAudio } from '@/app/components/edu/utils/speech';
import { preprocessTTS } from '@/app/components/edu/utils/ttsText';
import {
  fetchRaceCourses,
  fetchRaceLessons,
  fetchLessonRaceQuestions,
  OBSTACLE_META,
  type RaceCourse,
  type RaceLesson,
  type RaceQuestion,
} from './data';
import styles from './KnowledgeRaceGame.module.css';

const PhaserRaceCanvas = dynamic(() => import('./PhaserRaceCanvas'), {
  ssr: false,
  loading: () => <div className={styles.phaserLoading}>Đang khởi động đường đua...</div>,
});

type GameStatus = 'intro' | 'playing' | 'paused' | 'finished';
type Feedback = 'correct' | 'wrong' | null;
type CarId = 'red' | 'blue' | 'green' | 'orange';

type AnswerRecord = {
  questionId: string;
  prompt: string;
  skill: string;
  selectedLabel: string;
  correctLabel: string;
  isCorrect: boolean;
};

type RaceHistoryItem = {
  id: number;
  playedAt: string;
  lessonTitle: string;
  correctCount: number;
  totalQuestions: number;
  score: number;
  durationSeconds: number;
  maxStreak: number;
};

type CharacterOption = {
  id: string;
  label: string;
  image: string;
};

type CarOption = {
  id: CarId;
  label: string;
  image: string;
};

type RewardItem = {
  title: string;
  note: string;
  image: string;
};

const HISTORY_KEY = 'bhh_knowledge_race_history';
const TOTAL_QUESTIONS = 10;

const CHARACTER_OPTIONS: CharacterOption[] = [
  { id: 'be-minh', label: 'Bé Minh', image: '/avatars/avatar-be-01.webp' },
  { id: 'be-linh', label: 'Bé Linh', image: '/avatars/avatar-be-02.webp' },
  { id: 'be-nam', label: 'Bé Nam', image: '/avatars/avatar-be-03.webp' },
  { id: 'be-an', label: 'Bé An', image: '/avatars/avatar-be-04.webp' },
];

const CAR_OPTIONS: CarOption[] = [
  { id: 'red', label: 'Xe đỏ', image: '/games/knowledge-race/assets/car-red.svg' },
  { id: 'blue', label: 'Xe xanh', image: '/games/knowledge-race/assets/car-blue.svg' },
  { id: 'green', label: 'Xe lá', image: '/games/knowledge-race/assets/car-green.svg' },
  { id: 'orange', label: 'Xe cam', image: '/games/knowledge-race/assets/car-orange.svg' },
];

const ACCESSORY_ITEMS = [
  { label: 'Huy hiệu', image: '/icons/09_huy_chuong.png' },
  { label: 'Cánh gió', image: '/icons/11_may_bay_giay.png' },
  { label: 'Lửa Turbo', image: '/icons/02_huy_hieu_ngon_lua.png' },
  { label: 'Khiên', image: '/icons/03_huy_hieu_muc_tieu.png' },
];

const REWARD_ITEMS: RewardItem[] = [
  { title: 'Cúp vàng', note: 'Về đích', image: '/assets/images/05-trophy-cup.webp' },
  { title: '+120 sao', note: 'Hoàn thành', image: '/icons/11_ngoi_sao_lon.png' },
  { title: '+300 xu', note: 'Tích lũy', image: '/games/knowledge-race/assets/coin.svg' },
  { title: 'Hộp quà', note: 'Mở bí mật', image: '/icons/04_hop_qua_do.png' },
];

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function saveHistory(item: RaceHistoryItem) {
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    const history = raw ? (JSON.parse(raw) as RaceHistoryItem[]) : [];
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify([item, ...history].slice(0, 20)));
  } catch {
    // Game vẫn hoạt động khi trình duyệt chặn localStorage.
  }
}

function resultStars(correctCount: number): number {
  if (correctCount >= 9) return 3;
  if (correctCount >= 7) return 2;
  if (correctCount >= 5) return 1;
  return 0;
}

const useBrowserLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export default function KnowledgeRaceGame() {
  const [status, setStatus] = useState<GameStatus>('intro');
  const [courses, setCourses] = useState<RaceCourse[]>([]);
  const [lessons, setLessons] = useState<RaceLesson[]>([]);
  const [courseId, setCourseId] = useState<number | ''>('');
  const [lessonId, setLessonId] = useState<number | ''>('');
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [playingLessonTitle, setPlayingLessonTitle] = useState('');
  const [autoReadQuestion, setAutoReadQuestion] = useState(false);
  const [questions, setQuestions] = useState<RaceQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [locked, setLocked] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [energy, setEnergy] = useState(52);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [records, setRecords] = useState<AnswerRecord[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [boostActive, setBoostActive] = useState(false);
  const [carLane, setCarLane] = useState(1);
  const [selectedCharacterId, setSelectedCharacterId] = useState(CHARACTER_OPTIONS[0].id);
  const [selectedCarId, setSelectedCarId] = useState<CarId>('red');

  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const boostTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fitWrapRef = useRef<HTMLDivElement>(null);
  const gameFrameRef = useRef<HTMLElement>(null);

  const currentQuestion = questions[questionIndex];
  const selectedCourse = courses.find((course) => course.id === courseId) ?? null;
  const selectedLesson = lessons.find((lesson) => lesson.id === lessonId) ?? null;
  const totalQuestions = questions.length > 0 ? questions.length : TOTAL_QUESTIONS;

  // Cỡ chữ đáp án co giãn theo lượng text: số ngắn để to, câu dài thu nhỏ dần.
  const answerFontSize = useMemo(() => {
    const maxLen = (currentQuestion?.answers ?? []).reduce(
      (max, answer) => Math.max(max, (answer.label ?? '').length),
      0,
    );
    if (maxLen <= 6) return undefined; // số/từ ngắn → dùng cỡ mặc định (to)
    if (maxLen <= 12) return 'clamp(15px, 1.6vw, 22px)';
    if (maxLen <= 20) return 'clamp(14px, 1.4vw, 18px)';
    return 'clamp(12px, 1.2vw, 16px)';
  }, [currentQuestion]);
  const selectedCharacter = CHARACTER_OPTIONS.find((item) => item.id === selectedCharacterId) ?? CHARACTER_OPTIONS[0];
  const selectedCar = CAR_OPTIONS.find((item) => item.id === selectedCarId) ?? CAR_OPTIONS[0];
  const progressPercent = status === 'intro'
    ? 0
    : status === 'finished'
      ? 100
      : questions.length > 0
        ? Math.round((records.length / questions.length) * 100)
        : 0;
  const finalStars = resultStars(correctCount);

  const wrongSkills = useMemo(
    () => [...new Set(records.filter((record) => !record.isCorrect).map((record) => record.skill))],
    [records],
  );

  const clearPendingTimers = useCallback(() => {
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }
    if (boostTimeoutRef.current) {
      clearTimeout(boostTimeoutRef.current);
      boostTimeoutRef.current = null;
    }
  }, []);

  const resetToIntro = useCallback(() => {
    clearPendingTimers();
    stopSpeaking();
    setQuestions([]);
    setQuestionIndex(0);
    setSelectedAnswerId(null);
    setFeedback(null);
    setLocked(false);
    setScore(0);
    setCorrectCount(0);
    setStreak(0);
    setMaxStreak(0);
    setEnergy(52);
    setElapsedSeconds(0);
    setRecords([]);
    setBoostActive(false);
    setCarLane(1);
    setStatus('intro');
  }, [clearPendingTimers]);

  useEffect(() => () => {
    clearPendingTimers();
    stopSpeaking();
  }, [clearPendingTimers]);

  // Nạp danh sách khóa học (dữ liệu thật) khi mở game.
  useEffect(() => {
    let alive = true;
    fetchRaceCourses().then((list) => { if (alive) setCourses(list); });
    return () => { alive = false; };
  }, []);

  // Đổi khóa → nạp bài học của khóa đó, reset bài đã chọn.
  useEffect(() => {
    if (courseId === '') { setLessons([]); setLessonId(''); return; }
    let alive = true;
    setLessons([]);
    setLessonId('');
    setLoadError('');
    fetchRaceLessons(Number(courseId)).then((list) => { if (alive) setLessons(list); });
    return () => { alive = false; };
  }, [courseId]);

  useEffect(() => {
    if (status !== 'playing') return;
    const intervalId = window.setInterval(() => {
      setElapsedSeconds((seconds) => seconds + 1);
    }, 1000);
    return () => window.clearInterval(intervalId);
  }, [status]);

  // Thu nhỏ toàn khung game để vừa 1 màn hình PC (không phải cuộn xuống).
  useBrowserLayoutEffect(() => {
    const frame = gameFrameRef.current;
    const wrap = fitWrapRef.current;
    if (!frame || !wrap) return;
    let raf = 0;
    const recalc = () => {
      if (window.innerWidth <= 1180) {
        frame.style.transform = '';
        wrap.style.height = '';
        return;
      }
      // offsetWidth/Height là kích thước layout (bỏ qua transform) → đo được cỡ gốc.
      const natW = frame.offsetWidth;
      const natH = frame.offsetHeight;
      if (!natW || !natH) return;
      const top = wrap.getBoundingClientRect().top;
      const availH = window.innerHeight - top - 8;
      const availW = wrap.clientWidth;
      const scale = Math.min(1, availW / natW, availH / natH);
      frame.style.transformOrigin = 'top center';
      frame.style.transform = `scale(${scale})`;
      wrap.style.height = `${Math.ceil(natH * scale)}px`;
    };
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(recalc);
    };
    schedule();
    const observer = new ResizeObserver(schedule);
    observer.observe(frame);
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('resize', schedule);
    };
  }, []);

  const startRace = useCallback(async () => {
    if (lessonId === '' || loadingQuestions) return;
    // Mở khóa audio NGAY trong cử chỉ chạm (trước mọi await) để iOS cho phép
    // tự động đọc câu hỏi sau khi tải xong.
    unlockAudio();
    clearPendingTimers();
    stopSpeaking();
    setLoadError('');
    setLoadingQuestions(true);
    try {
      const fetched = await fetchLessonRaceQuestions(Number(lessonId), TOTAL_QUESTIONS);
      if (fetched.length === 0) {
        setLoadError('Bài học này chưa có câu hỏi trắc nghiệm 4 đáp án.');
        return;
      }
      setQuestions(fetched);
      setPlayingLessonTitle(selectedLesson?.title ?? '');
      // Lớp 1: tự đọc câu hỏi cho bé (bé chưa đọc thạo).
      setAutoReadQuestion(/lớp\s*1(?!\d)/i.test(selectedCourse?.title ?? ''));
      setQuestionIndex(0);
      setSelectedAnswerId(null);
      setFeedback(null);
      setLocked(false);
      setScore(0);
      setCorrectCount(0);
      setStreak(0);
      setMaxStreak(0);
      setEnergy(52);
      setElapsedSeconds(0);
      setRecords([]);
      setBoostActive(false);
      setCarLane(1);
      setStatus('playing');
      playGameSound('select', soundEnabled);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Không tải được câu hỏi.');
    } finally {
      setLoadingQuestions(false);
    }
  }, [clearPendingTimers, lessonId, loadingQuestions, selectedCourse, selectedLesson, soundEnabled]);

  const finishRace = useCallback((finalRecords: AnswerRecord[], finalScore: number, finalMaxStreak: number) => {
    const finalCorrectCount = finalRecords.filter((record) => record.isCorrect).length;

    setRecords(finalRecords);
    setCorrectCount(finalCorrectCount);
    setScore(finalScore);
    setMaxStreak(finalMaxStreak);
    setEnergy(100);
    setBoostActive(true);
    setLocked(false);
    setStatus('finished');
    stopSpeaking();

    saveHistory({
      id: Date.now(),
      playedAt: new Date().toISOString(),
      lessonTitle: playingLessonTitle,
      correctCount: finalCorrectCount,
      totalQuestions: finalRecords.length,
      score: finalScore,
      durationSeconds: elapsedSeconds,
      maxStreak: finalMaxStreak,
    });

    playGameSound(finalCorrectCount >= 9 ? 'three_stars' : 'result', soundEnabled);

    if (finalCorrectCount >= 7) {
      confetti({
        particleCount: finalCorrectCount >= 9 ? 160 : 100,
        spread: 80,
        origin: { y: 0.65 },
      });
    }
  }, [elapsedSeconds, playingLessonTitle, soundEnabled]);

  const handleAnswer = useCallback((answerId: string) => {
    if (status !== 'playing' || locked || !currentQuestion) return;

    const selectedAnswer = currentQuestion.answers.find((answer) => answer.id === answerId);
    const correctAnswer = currentQuestion.answers.find((answer) => answer.id === currentQuestion.correctAnswerId);
    if (!selectedAnswer || !correctAnswer) return;

    const isCorrect = answerId === currentQuestion.correctAnswerId;
    const nextStreak = isCorrect ? streak + 1 : 0;
    const nextMaxStreak = Math.max(maxStreak, nextStreak);
    const pointsAdded = isCorrect ? 100 + Math.min(nextStreak, 5) * 10 : 0;
    const nextScore = score + pointsAdded;
    const nextCorrectCount = correctCount + (isCorrect ? 1 : 0);
    const nextRecords: AnswerRecord[] = [
      ...records,
      {
        questionId: currentQuestion.id,
        prompt: currentQuestion.prompt,
        skill: currentQuestion.skill,
        selectedLabel: selectedAnswer.label,
        correctLabel: correctAnswer.label,
        isCorrect,
      },
    ];

    setLocked(true);
    setSelectedAnswerId(answerId);
    setFeedback(isCorrect ? 'correct' : 'wrong');
    setScore(nextScore);
    setCorrectCount(nextCorrectCount);
    setStreak(nextStreak);
    setMaxStreak(nextMaxStreak);
    setRecords(nextRecords);

    if (isCorrect) {
      setEnergy((value) => Math.min(100, value + (nextStreak >= 3 ? 20 : 13)));
      setCarLane((lane) => (lane + 1) % 3);
      playGameSound('correct', soundEnabled);
      if (nextStreak >= 3) {
        setBoostActive(true);
        if (boostTimeoutRef.current) clearTimeout(boostTimeoutRef.current);
        boostTimeoutRef.current = setTimeout(() => setBoostActive(false), 900);
      }
    } else {
      setEnergy((value) => Math.max(18, value - 12));
      playGameSound('wrong', soundEnabled);
    }

    advanceTimeoutRef.current = setTimeout(() => {
      if (questionIndex >= questions.length - 1) {
        finishRace(nextRecords, nextScore, nextMaxStreak);
        return;
      }
      setQuestionIndex((index) => index + 1);
      setSelectedAnswerId(null);
      setFeedback(null);
      setLocked(false);
    }, isCorrect ? 850 : 1300);
  }, [
    correctCount,
    currentQuestion,
    finishRace,
    locked,
    maxStreak,
    questionIndex,
    questions.length,
    records,
    score,
    soundEnabled,
    status,
    streak,
  ]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (status !== 'playing' || locked || !currentQuestion) return;
      const answerIndex = Number(event.key) - 1;
      const answer = currentQuestion.answers[answerIndex];
      if (answer) handleAnswer(answer.id);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, handleAnswer, locked, status]);

  const togglePause = () => {
    if (status === 'playing') {
      setStatus('paused');
      stopSpeaking();
    } else if (status === 'paused') {
      setStatus('playing');
    }
  };

  const readQuestion = () => {
    if (!currentQuestion) return;
    speakText(preprocessTTS(currentQuestion.prompt));
  };

  // Lớp 1: tự đọc câu hỏi mỗi khi sang câu mới.
  useEffect(() => {
    if (!autoReadQuestion || !soundEnabled || status !== 'playing' || !currentQuestion) return;
    const prompt = preprocessTTS(currentQuestion.prompt);
    const timer = setTimeout(() => speakText(prompt), 400);
    return () => {
      clearTimeout(timer);
      stopSpeaking();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoReadQuestion, soundEnabled, status, questionIndex]);

  const answerButtonClass = (answerId: string): string => {
    const classes = [styles.answerButton];
    if (selectedAnswerId === answerId) classes.push(styles.selectedAnswer);
    if (feedback && answerId === currentQuestion?.correctAnswerId) classes.push(styles.correctAnswer);
    if (feedback === 'wrong' && selectedAnswerId === answerId) classes.push(styles.wrongAnswer);
    return classes.join(' ');
  };

  const questionLabel = status === 'intro'
    ? 'Sẵn sàng tăng tốc chưa?'
    : status === 'finished'
      ? 'Chúc mừng bé đã về đích!'
      : currentQuestion?.prompt;

  return (
    <main className={styles.page}>
      <div className={styles.fitWrap} ref={fitWrapRef}>
      <section className={styles.gameFrame} ref={gameFrameRef} aria-label="Trò chơi Đua xe kiến thức">
        <div className={styles.topDeck}>
          <aside className={styles.leftColumn}>
            <div className={styles.brandArea}>
              <Link href="/tro-choi" className={styles.backButton} aria-label="Quay lại kho trò chơi">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M15 5l-7 7 7 7" />
                </svg>
              </Link>
              <div className={styles.brandFlag} aria-hidden="true">🏁</div>
              <div className={styles.brandText}>
                <h1 className={styles.gameTitle}><span>Đua xe</span><span>Kiến thức</span></h1>
                <p className={styles.gameSubtitle}>Trả lời đúng – tăng tốc về đích!</p>
              </div>
            </div>

            <div className={styles.guidePanel}>
              <section className={styles.guideSection}>
                <div className={styles.sectionHeading}>
                  <span className={styles.sectionIcon} aria-hidden="true">🎯</span>
                  <h2>Mục tiêu</h2>
                </div>
                <p className={styles.targetText}>
                  Trả lời thật nhanh và chính xác để xe tăng tốc, vượt chướng ngại và giành cúp vàng.
                </p>
              </section>

              <div className={styles.panelDivider} />

              <section className={styles.guideSection}>
                <div className={styles.sectionHeading}>
                  <span className={styles.sectionIcon} aria-hidden="true">🎮</span>
                  <h2>Cách chơi</h2>
                </div>
                <ol className={styles.stepsList}>
                  <li><span>1</span><div className={styles.stepText}>Chọn nhân vật và xe.</div></li>
                  <li><span>2</span><div className={styles.stepText}>Trả lời 10 câu hỏi.</div></li>
                  <li><span>3</span><div className={styles.stepText}><strong>Đúng:</strong> xe tăng tốc.</div></li>
                  <li><span>4</span><div className={styles.stepText}><strong>Sai:</strong> xe chậm lại, có gợi ý.</div></li>
                  <li><span>5</span><div className={styles.stepText}>Về đích và nhận phần thưởng.</div></li>
                </ol>
              </section>
            </div>
          </aside>

          <section className={styles.centerColumn}>
            <div className={styles.hudBar}>
              <div className={styles.energyHud}>
                <span className={styles.energyIcon} aria-hidden="true">⚡</span>
                <div className={styles.energyTrack} aria-label={`Năng lượng ${energy}%`}>
                  <div className={styles.energyFill} style={{ width: `${energy}%` }} />
                  <span className={styles.energySegments} aria-hidden="true" />
                </div>
              </div>

              <div className={styles.questionHud}>
                {status === 'intro'
                  ? 'Chọn bài học'
                  : status === 'finished'
                    ? 'Về đích'
                    : `Câu ${Math.min(questionIndex + 1, totalQuestions)} / ${totalQuestions}`}
              </div>

              <div className={styles.scoreHud}><span aria-hidden="true">⭐</span><strong>{score}</strong></div>

              <div className={styles.hudButtons}>
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={() => setSoundEnabled((enabled) => !enabled)}
                  aria-label={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
                  aria-pressed={soundEnabled}
                >
                  {soundEnabled ? '🔊' : '🔇'}
                </button>
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={togglePause}
                  disabled={status === 'intro' || status === 'finished' || locked}
                  aria-label={status === 'paused' ? 'Tiếp tục chơi' : 'Tạm dừng'}
                >
                  {status === 'paused' ? '▶' : 'Ⅱ'}
                </button>
              </div>
            </div>

            <div className={styles.stageFrame} data-status={status}>
              <div
                className={`${styles.raceViewport} ${status === 'intro' ? styles.raceViewportIntro : ''} ${status === 'finished' ? styles.raceViewportResult : ''}`}
              >
                <PhaserRaceCanvas
                  status={status}
                  feedback={feedback}
                  answerEventId={records.length}
                  questionIndex={questionIndex}
                  boostActive={boostActive}
                  progressPercent={progressPercent}
                  obstacle={currentQuestion?.obstacle ?? 'rock'}
                  lane={carLane}
                  carId={selectedCar.id}
                />

                {status === 'intro' && (
                  <div className={styles.overlayPanel}>
                    <div className={styles.overlayIcon} aria-hidden="true">🏎️</div>
                    <h3>Chọn bài học để đua</h3>
                    <p>Chọn khóa học rồi chọn bài. Mỗi lượt có 10 câu hỏi thật từ bài học; đúng 3 câu liên tiếp sẽ bật Turbo.</p>
                    <div className={styles.selectGrid}>
                      <label className={styles.selectField}>
                        <span>Khóa học</span>
                        <select
                          value={courseId === '' ? '' : String(courseId)}
                          onChange={(event) => setCourseId(event.target.value === '' ? '' : Number(event.target.value))}
                        >
                          <option value="">-- Chọn khóa học --</option>
                          {courses.map((course) => (
                            <option key={course.id} value={course.id}>{course.title}</option>
                          ))}
                        </select>
                      </label>
                      <label className={styles.selectField}>
                        <span>Bài học</span>
                        <select
                          value={lessonId === '' ? '' : String(lessonId)}
                          onChange={(event) => setLessonId(event.target.value === '' ? '' : Number(event.target.value))}
                          disabled={courseId === '' || lessons.length === 0}
                        >
                          <option value="">
                            {courseId === '' ? '-- Chọn khóa trước --' : lessons.length === 0 ? 'Đang tải bài học…' : '-- Chọn bài học --'}
                          </option>
                          {lessons.map((lesson) => (
                            <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                    {loadError && <p className={styles.loadError}>{loadError}</p>}
                    <button
                      type="button"
                      className={styles.primaryAction}
                      onClick={startRace}
                      disabled={lessonId === '' || loadingQuestions}
                    >
                      {loadingQuestions ? 'Đang tải câu hỏi…' : 'Bắt đầu đua'}
                    </button>
                  </div>
                )}

                {status === 'paused' && (
                  <div className={styles.overlayPanel}>
                    <div className={styles.overlayIcon} aria-hidden="true">⏸️</div>
                    <h3>Đang tạm dừng</h3>
                    <p>Bé nghỉ một chút rồi tiếp tục đường đua nhé.</p>
                    <button type="button" className={styles.primaryAction} onClick={togglePause}>Tiếp tục</button>
                  </div>
                )}

                {status === 'finished' && (
                  <div className={styles.resultOverlay} aria-live="polite">
                    <div className={styles.finishBadge}>🏁 VỀ ĐÍCH</div>
                    <img className={styles.resultCupImage} src="/assets/images/05-trophy-cup.webp" alt="Cúp vàng" />
                    <h3>Hoàn thành {playingLessonTitle || 'bài học'}</h3>
                    <div className={styles.resultStars} aria-label={`${finalStars} sao`}>
                      {[0, 1, 2].map((star) => (
                        <span key={star} className={star < finalStars ? styles.starEarned : styles.starEmpty}>★</span>
                      ))}
                    </div>
                    <div className={styles.resultStats}>
                      <div><strong>{correctCount}/{totalQuestions}</strong><span>Câu đúng</span></div>
                      <div><strong>{score}</strong><span>Điểm</span></div>
                      <div><strong>{formatTime(elapsedSeconds)}</strong><span>Thời gian</span></div>
                      <div><strong>{maxStreak}</strong><span>Combo cao nhất</span></div>
                    </div>
                    {wrongSkills.length > 0 ? (
                      <p className={styles.reviewText}>Nên ôn thêm: <strong>{wrongSkills.join(', ')}</strong>.</p>
                    ) : (
                      <p className={styles.perfectText}>Tuyệt vời! Bé đã trả lời đúng toàn bộ câu hỏi.</p>
                    )}
                    <div className={styles.resultActions}>
                      <button type="button" className={styles.primaryResultButton} onClick={startRace}>Đua lại</button>
                      <button type="button" className={styles.secondaryResultButton} onClick={resetToIntro}>Đổi bài</button>
                      <Link href="/tro-choi" className={styles.secondaryResultButton}>Kho game</Link>
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.quizOverlay}>
                <div className={styles.quizMeta}>
                  <span className={styles.skillChip}>
                    {status === 'intro' ? (selectedLesson?.title ?? 'Chọn bài học') : currentQuestion?.skill ?? 'Khởi động'}
                  </span>
                  <button
                    type="button"
                    className={styles.speakButton}
                    onClick={readQuestion}
                    disabled={!currentQuestion || status === 'paused' || status === 'intro' || status === 'finished'}
                  >
                    🔊 Đọc câu hỏi
                  </button>
                </div>

                <div className={styles.questionCard}>
                  {(status === 'playing' || status === 'paused') && currentQuestion?.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className={styles.questionImage} src={currentQuestion.imageUrl} alt="Hình minh họa câu hỏi" />
                  )}
                  {questionLabel ? <h2>{questionLabel}</h2> : null}
                </div>

                {(status === 'playing' || status === 'paused') && currentQuestion ? (
                  <div className={styles.answerRow}>
                    {currentQuestion.answers.map((answer, index) => (
                      <button
                        type="button"
                        key={answer.id}
                        className={`${answerButtonClass(answer.id)} ${answer.imageUrl ? styles.answerHasImage : ''}`}
                        onClick={() => handleAnswer(answer.id)}
                        disabled={locked || status === 'paused'}
                      >
                        <span className={styles.answerIndex}>{index + 1}</span>
                        {answer.imageUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img className={styles.answerImage} src={answer.imageUrl} alt={answer.label || `Đáp án ${index + 1}`} />
                        )}
                        {answer.label ? <span style={answerFontSize ? { fontSize: answerFontSize } : undefined}>{answer.label}</span> : null}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className={styles.answerRow} aria-hidden="true">
                    {['Chọn lớp', 'Bắt đầu', 'Tăng tốc', 'Về đích'].map((label, index) => (
                      <div key={label} className={styles.previewAnswer}>
                        <span className={styles.answerIndex}>{index + 1}</span>
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          <aside className={styles.rightColumn}>
            <div className={styles.feedbackTitle}>Phản hồi khi trả lời</div>

            <div className={`${styles.feedbackCard} ${styles.feedbackGood} ${feedback === 'correct' ? styles.feedbackCardActive : ''}`}>
              <div className={styles.feedbackIconCircle} aria-hidden="true">✓</div>
              <div className={styles.feedbackBody}>
                <h2>Đúng</h2>
                <ul>
                  <li>Xe tăng tốc.</li>
                  <li>Hiệu ứng vui nhộn.</li>
                  <li>+10 điểm thưởng.</li>
                </ul>
                <div className={styles.feedbackMiniScene}>
                  <img src={selectedCar.image} alt="" aria-hidden="true" />
                  <span className={styles.greenArrow} aria-hidden="true">➜➜➜</span>
                </div>
              </div>
            </div>

            <div className={`${styles.feedbackCard} ${styles.feedbackBad} ${feedback === 'wrong' ? styles.feedbackCardActive : ''}`}>
              <div className={styles.feedbackIconCircle} aria-hidden="true">×</div>
              <div className={styles.feedbackBody}>
                <h2>Sai</h2>
                <ul>
                  <li>Xe chậm lại nhẹ.</li>
                  <li>Hiển thị gợi ý.</li>
                  <li>Được thử tiếp.</li>
                </ul>
                {feedback === 'wrong' && currentQuestion ? (
                  <p className={styles.hintText}>Gợi ý: {currentQuestion.hint}</p>
                ) : null}
                <div className={styles.feedbackMiniScene}>
                  <span className={styles.smokeCloud} aria-hidden="true">☁</span>
                  <img src={selectedCar.image} alt="" aria-hidden="true" />
                </div>
              </div>
            </div>

            <div className={`${styles.feedbackCard} ${styles.feedbackTurbo} ${boostActive ? styles.feedbackCardActive : ''}`}>
              <div className={styles.rocketIcon} aria-hidden="true">🚀</div>
              <div className={styles.feedbackBody}>
                <h2>Tăng tốc đặc biệt</h2>
                <p>Trả lời đúng 3 câu liên tiếp để kích hoạt Turbo!</p>
                <div className={styles.comboTrack}>
                  {[1, 2, 3].map((number) => (
                    <span key={number} className={streak >= number ? styles.comboActive : ''}>{number}</span>
                  ))}
                </div>
                <div className={styles.feedbackMiniScene}>
                  <img src={selectedCar.image} alt="" aria-hidden="true" />
                  <span className={styles.blueArrow} aria-hidden="true">➜➜➜</span>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div className={styles.lowerDeck}>
          <section className={`${styles.lowerCard} ${styles.customizationCard}`}>
            <div className={styles.cardTitle}>Chọn nhân vật & xe</div>
            <div className={styles.customizationLayout}>
              <div className={styles.selectedCharacterCard}>
                <img src={selectedCharacter.image} alt={selectedCharacter.label} />
                <strong>{selectedCharacter.label}</strong>
              </div>

              <div className={styles.characterThumbs}>
                {CHARACTER_OPTIONS.map((character) => (
                  <button
                    type="button"
                    key={character.id}
                    className={`${styles.characterButton} ${selectedCharacterId === character.id ? styles.optionActive : ''}`}
                    onClick={() => setSelectedCharacterId(character.id)}
                    aria-label={character.label}
                  >
                    <img src={character.image} alt="" aria-hidden="true" />
                  </button>
                ))}
              </div>

              <div className={styles.vehicleChoices}>
                <div className={styles.carThumbs}>
                  {CAR_OPTIONS.map((car) => (
                    <button
                      type="button"
                      key={car.id}
                      className={`${styles.carButton} ${selectedCarId === car.id ? styles.optionActive : ''}`}
                      onClick={() => setSelectedCarId(car.id)}
                      aria-label={car.label}
                    >
                      <img src={car.image} alt="" aria-hidden="true" />
                    </button>
                  ))}
                </div>

                <div className={styles.accessoryRow}>
                  <span>Phụ kiện</span>
                  {ACCESSORY_ITEMS.map((item) => (
                    <button type="button" key={item.label} aria-label={item.label}>
                      <img src={item.image} alt="" aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className={`${styles.lowerCard} ${styles.obstacleCard}`}>
            <div className={styles.cardTitle}>Chướng ngại</div>
            <div className={styles.obstacleGrid}>
              {Object.entries(OBSTACLE_META).map(([key, item]) => (
                <div key={item.label} className={styles.obstacleItem}>
                  <img src={`/games/knowledge-race/assets/${key}.svg`} alt="" aria-hidden="true" />
                  <strong>{item.label}</strong>
                </div>
              ))}
            </div>
            <p>Trả lời đúng để vượt qua chướng ngại!</p>
          </section>

          <section className={`${styles.lowerCard} ${styles.rewardCard}`}>
            <div className={styles.cardTitle}>Phần thưởng</div>
            <div className={styles.rewardGrid}>
              {REWARD_ITEMS.map((reward) => (
                <div key={reward.title} className={styles.rewardItem}>
                  <img src={reward.image} alt="" aria-hidden="true" />
                  <strong>{reward.title}</strong>
                  <small>{reward.note}</small>
                </div>
              ))}
            </div>
          </section>
        </div>

        <footer className={styles.routePanel} aria-label={`Tiến độ ${records.length} trên ${totalQuestions} câu`}>
          <div className={styles.routeTitle}>Lộ trình đua</div>
          <span className={styles.routeStart} aria-hidden="true">🏁</span>
          <div className={styles.routeTrackWrap}>
            <div className={styles.routeTrack}>
              <div className={styles.routeFill} style={{ width: `${progressPercent}%` }} />
              {Array.from({ length: totalQuestions }, (_, index) => {
                const record = records[index];
                const isCurrent = status !== 'intro' && status !== 'finished' && index === questionIndex;
                return (
                  <span
                    key={index}
                    className={`${styles.routeDot} ${record?.isCorrect ? styles.routeDotCorrect : ''} ${record && !record.isCorrect ? styles.routeDotWrong : ''} ${isCurrent ? styles.routeDotCurrent : ''}`}
                    style={{ left: `${(index / Math.max(1, totalQuestions - 1)) * 100}%` }}
                    title={`Câu ${index + 1}`}
                  >
                    {isCurrent ? (
                      <img className={styles.routeAvatar} src={selectedCharacter.image} alt="" aria-hidden="true" />
                    ) : record ? (record.isCorrect ? '✓' : '×') : index + 1}
                  </span>
                );
              })}
            </div>
            <div className={styles.routeLabels}>
              {Array.from({ length: totalQuestions }, (_, index) => (
                <span key={index}>Câu {index + 1}</span>
              ))}
            </div>
          </div>
          <span className={styles.routeFinish} aria-hidden="true">🏆</span>
        </footer>
      </section>
      </div>
    </main>
  );
}
