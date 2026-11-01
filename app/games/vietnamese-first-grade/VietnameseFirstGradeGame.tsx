'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Apple, ArrowLeft, AudioLines, BookOpen, BookText, ChevronRight, Heart, House, LockKeyhole, Music2, PencilLine, Puzzle, Sparkles, Star, Trophy, Type, Volume2 } from 'lucide-react';
import { speakText, stopSpeaking, unlockAudio } from '@/app/components/edu/utils/speech';
import { TOTAL_CURRICULUM_LESSONS, TOTAL_CURRICULUM_QUESTIONS, VIETNAMESE_GRADE_ONE_CURRICULUM, type CurriculumQuestion, type CurriculumTopic } from './curriculum';
import styles from './VietnameseFirstGradeGame.module.css';

const TOPIC_ICONS = {
  letters: Type,
  tones: Sparkles,
  rhymes: Music2,
  blend: Puzzle,
  words: Apple,
  sentences: BookOpen,
  reading: BookText,
  spelling: AudioLines,
  handwriting: PencilLine,
  review: Trophy,
};

function TopicIcon({ topic }: { topic: CurriculumTopic }) {
  const Icon = TOPIC_ICONS[topic.id as keyof typeof TOPIC_ICONS] ?? BookOpen;
  return (
    <span className={styles.topicIcon} style={{ '--tone': topic.tone } as React.CSSProperties} aria-hidden="true">
      <Icon size={34} strokeWidth={2.2} />
    </span>
  );
}

type Screen = 'home' | 'topics' | 'lessons' | 'play' | 'result' | 'progress' | 'favorites';
type SavedProgress = Record<string, number>;

const TOPICS = VIETNAMESE_GRADE_ONE_CURRICULUM;
const STORAGE_KEY = 'bhh-vietnamese-first-grade-curriculum-v2';
const FAVORITES_KEY = 'bhh-vietnamese-first-grade-favorites';

export default function VietnameseFirstGradeGame() {
  const [screen, setScreen] = useState<Screen>('home');
  const [topic, setTopic] = useState<CurriculumTopic | null>(null);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<'ready' | 'correct' | 'wrong'>('ready');
  const [progress, setProgress] = useState<SavedProgress>({});
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        const savedFavorites = window.localStorage.getItem(FAVORITES_KEY);
        if (saved) setProgress(JSON.parse(saved) as SavedProgress);
        if (savedFavorites) setFavorites(JSON.parse(savedFavorites) as string[]);
      } catch {
        setProgress({});
        setFavorites([]);
      }
      setLoaded(true);
    }, 0);
    return () => {
      window.clearTimeout(timer);
      stopSpeaking();
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites, loaded, progress]);

  const lesson = topic?.lessons[lessonIndex];
  const question: CurriculumQuestion | undefined = lesson?.questions[questionIndex];

  useEffect(() => {
    if (screen !== 'play' || !question || !soundOn) return;
    const text = question.audioText ?? (question.passage ? `${question.passage} ${question.prompt}` : question.prompt);
    const timer = window.setTimeout(() => speakText(text), 350);
    return () => {
      window.clearTimeout(timer);
      stopSpeaking();
    };
  }, [lessonIndex, question, screen, soundOn]);

  const startLesson = (selectedTopic: CurriculumTopic, index: number) => {
    unlockAudio();
    setTopic(selectedTopic);
    setLessonIndex(index);
    setQuestionIndex(0);
    setScore(0);
    setChoice(null);
    setAnswerState('ready');
    setScreen('play');
  };

  const answer = (value: string) => {
    if (!question || answerState !== 'ready') return;
    setChoice(value);
    if (value !== question.correct) {
      setAnswerState('wrong');
      if (soundOn) speakText('Chưa đúng. Con thử lại nhé.');
      window.setTimeout(() => {
        setChoice(null);
        setAnswerState('ready');
      }, 700);
      return;
    }

    setAnswerState('correct');
    setScore((current) => current + 1);
  if (soundOn) speakText('Đúng rồi! Con giỏi lắm.');
    window.setTimeout(() => {
      if (questionIndex + 1 < (lesson?.questions.length ?? 0)) {
        setQuestionIndex((current) => current + 1);
        setChoice(null);
        setAnswerState('ready');
        return;
      }
      if (topic) {
        setProgress((current) => ({ ...current, [topic.id]: Math.max(current[topic.id] ?? 0, lessonIndex + 1) }));
      }
      setScreen('result');
    }, 700);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const playSpeech = (text: string) => {
    if (soundOn) speakText(text);
  };

  const goHome = () => {
    stopSpeaking();
    setScreen('home');
  };

  return (
    <main className={styles.game}>
      <div className={styles.sky} aria-hidden="true"><span>☁️</span><span>☁️</span><span>☀️</span></div>
      <div className={styles.shell}>
        <header className={styles.topbar}>
          {screen !== 'home' ? (
            <button type="button" className={styles.iconButton} onClick={() => screen === 'topics' || screen === 'progress' || screen === 'favorites' ? goHome() : screen === 'lessons' ? setScreen('topics') : setScreen('lessons')} aria-label="Quay lại">
              <ArrowLeft size={22} />
            </button>
          ) : (
            <button type="button" className={styles.iconButton} onClick={() => setScreen('progress')} aria-label="Xem tiến độ">
              <Star size={21} />
            </button>
          )}
          <div className={styles.brand}><span>🌼</span><span>BÉ HỌC MỖI NGÀY</span></div>
          <button type="button" className={`${styles.iconButton} ${soundOn ? '' : styles.muted}`} onClick={() => setSoundOn((value) => !value)} aria-label={soundOn ? 'Tắt âm thanh' : 'Bật âm thanh'}>
            <Volume2 size={20} />
          </button>
        </header>

        {screen === 'home' && (
          <section className={styles.home}>
            <div className={styles.homeTitle}>
              <span className={styles.kicker}>VƯỜN CHỮ CỦA BÉ</span>
              <h1>Học Tiếng Việt</h1>
              <span className={styles.grade}>LỚP 1</span>
              <p>29 chữ cái · 6 thanh · trọn bảng vần · đọc câu và đoạn</p>
            </div>
            <div className={styles.homeScene}>
              <span className={styles.bird}>🐦</span>
              <span className={styles.cloud}>☁️</span>
              <div className={styles.mascot}>
                <Image src="/assets/icons/cun_con.jpg" alt="Bạn cún đồng hành học chữ" width={150} height={150} priority />
              </div>
              <div className={styles.garden}><span>🌷</span><span>🌼</span><span>🌱</span><span>🌸</span></div>
            </div>
            <div className={styles.homeActions}>
              <button type="button" className={styles.primaryButton} onClick={() => setScreen('topics')}>
                <span className={styles.playMark}>▶</span>Bắt đầu học<ChevronRight size={21} />
              </button>
              <span className={styles.courseSummary}>{TOPICS.length} chủ đề · {TOTAL_CURRICULUM_LESSONS} bài · {TOTAL_CURRICULUM_QUESTIONS} câu hỏi</span>
              <div className={styles.quickActions}>
                <button type="button" onClick={() => setScreen('favorites')}><Heart size={19} />Bài yêu thích</button>
                <button type="button" onClick={() => setScreen('progress')}><Star size={19} />Tiến độ <b>{Object.values(progress).reduce((sum, value) => sum + value, 0)}</b></button>
              </div>
            </div>
          </section>
        )}

        {screen === 'topics' && (
          <section className={styles.content}>
            <div className={styles.woodTitle}><h1>Chọn chủ đề</h1><span>{TOTAL_CURRICULUM_LESSONS} bài học theo lộ trình Tiếng Việt lớp 1</span></div>
            <div className={styles.topicGrid}>
              {TOPICS.map((item, index) => {
                const completed = progress[item.id] ?? 0;
                return (
                  <div key={item.id} className={styles.topicCard} style={{ '--tone': item.tone } as React.CSSProperties}>
                    <button type="button" className={styles.topicOpen} onClick={() => { setTopic(item); setScreen('lessons'); }} aria-label={`Mở chủ đề ${item.title}`}>
                      <span className={styles.topicNumber}>{index + 1}</span>
                      <TopicIcon topic={item} />
                      <strong>{item.title}</strong>
                      <small>{item.hint}</small>
                      <span className={styles.topicStars}>{completed}/{item.lessons.length} bài</span>
                    </button>
                    <button type="button" className={`${styles.favoriteButton} ${favorites.includes(item.id) ? styles.favoriteActive : ''}`} onClick={() => toggleFavorite(item.id)} aria-label={favorites.includes(item.id) ? 'Bỏ yêu thích' : 'Thêm yêu thích'}><Heart size={16} fill={favorites.includes(item.id) ? 'currentColor' : 'none'} /></button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {screen === 'lessons' && topic && (
          <section className={styles.content}>
            <div className={styles.woodTitle}><span className={styles.sectionEmoji}>{topic.emoji}</span><h1>{TOPICS.indexOf(topic) + 1}. {topic.title}</h1></div>
            <div className={styles.lessonList}>
              {topic.lessons.map((lessonItem, index) => {
                const completed = progress[topic.id] ?? 0;
                const locked = index > completed;
                const stars = index < completed ? 3 : index === completed ? 1 : 0;
                return (
                  <button key={lessonItem.id} type="button" disabled={locked} className={styles.lessonRow} onClick={() => startLesson(topic, index)}>
                    <span className={styles.lessonNumber}>{index + 1}</span><strong>{lessonItem.title}</strong>
                    <span className={styles.lessonStars}>{'★'.repeat(stars)}{'☆'.repeat(3 - stars)}</span>
                    {locked ? <LockKeyhole className={styles.lock} size={21} /> : <ChevronRight className={styles.nextIcon} size={22} />}
                  </button>
                );
              })}
            </div>
            {topic.href && <Link className={styles.writingLink} href={topic.href}>Mở vở luyện viết trên ô li <ChevronRight size={18} /></Link>}
          </section>
        )}

        {screen === 'play' && topic && question && (
          <section className={styles.activity}>
            <div className={styles.activityTitle}>
              <div className={styles.woodTitle}><h1>{topic.title}</h1><span>{lesson?.title}</span></div>
              <span className={styles.counter}>{questionIndex + 1}/{lesson?.questions.length}</span>
            </div>
            <div className={styles.progressTrack}><span style={{ width: `${((questionIndex + (answerState === 'correct' ? 1 : 0)) / (lesson?.questions.length ?? 1)) * 100}%` }} /></div>
            <div className={styles.questionCard}>
              <button type="button" className={styles.speakButton} onClick={() => playSpeech(question.audioText ?? (question.passage ? `${question.passage} ${question.prompt}` : question.prompt))} aria-label="Nghe câu hỏi"><Volume2 size={23} /></button>
              {question.passage && <blockquote className={styles.passage}>{question.passage}</blockquote>}
              <h2>{question.prompt}</h2>
              <div className={styles.answerGrid}>
                {question.answers.map((value) => {
                  const correct = answerState === 'correct' && value === question.correct;
                  const wrong = answerState === 'wrong' && choice === value;
                  return <button key={value} type="button" className={`${styles.answerButton} ${correct ? styles.answerCorrect : ''} ${wrong ? styles.answerWrong : ''}`} onClick={() => answer(value)} disabled={answerState === 'correct'}>{value}</button>;
                })}
              </div>
              <p className={`${styles.feedback} ${answerState === 'correct' ? styles.feedbackGood : ''} ${answerState === 'wrong' ? styles.feedbackTry : ''}`} aria-live="polite">
                {answerState === 'correct' ? 'Đúng rồi! Con giỏi lắm ✨' : answerState === 'wrong' ? 'Mình thử lại nhé!' : 'Chạm vào đáp án con chọn'}
              </p>
            </div>
          </section>
        )}

        {screen === 'result' && topic && (
          <section className={styles.result}>
            <div className={styles.trophy}>🏆</div>
            <span className={styles.kicker}>CON ĐÃ HOÀN THÀNH</span>
            <h1>Giỏi quá!</h1>
            <p>Con trả lời đúng {score}/{lesson?.questions.length ?? 0} câu.</p>
            <div className={styles.resultStars} aria-label="Ba sao">⭐⭐⭐</div>
            <div className={styles.resultActions}>
              {lessonIndex < topic.lessons.length - 1 && <button type="button" className={styles.primaryButton} onClick={() => startLesson(topic, lessonIndex + 1)}>Học bài tiếp <ChevronRight size={20} /></button>}
              <button type="button" className={styles.secondaryButton} onClick={() => setScreen('lessons')}>Chọn bài khác</button>
              <button type="button" className={styles.textButton} onClick={goHome}><House size={17} /> Về trang đầu</button>
            </div>
          </section>
        )}

        {(screen === 'progress' || screen === 'favorites') && (
          <section className={styles.content}>
            <div className={styles.woodTitle}><h1>{screen === 'progress' ? 'Tiến độ của bé' : 'Bài yêu thích'}</h1></div>
            {screen === 'progress' ? (
              <div className={styles.lessonList}>
                {TOPICS.map((item) => <div className={styles.progressRow} key={item.id}><span>{item.emoji}</span><strong>{item.title}</strong><span className={styles.lessonStars}>{'★'.repeat(Math.min(progress[item.id] ?? 0, 3))}{'☆'.repeat(3 - Math.min(progress[item.id] ?? 0, 3))}</span><small>{progress[item.id] ?? 0}/{item.lessons.length} bài</small></div>)}
              </div>
            ) : (
              <div className={styles.topicGrid}>
                {TOPICS.filter((item) => favorites.includes(item.id)).map((item) => <div key={item.id} className={`${styles.topicCard} ${styles.favoriteTopicCard}`} style={{ '--tone': item.tone } as React.CSSProperties}><button type="button" className={styles.topicOpen} onClick={() => { setTopic(item); setScreen('lessons'); }}><TopicIcon topic={item} /><strong>{item.title}</strong><small>Mở danh sách bài học</small></button><button type="button" className={`${styles.favoriteButton} ${styles.favoriteActive}`} onClick={() => toggleFavorite(item.id)} aria-label={`Bỏ yêu thích ${item.title}`}><Heart size={16} fill="currentColor" /></button></div>)}
                {TOPICS.every((item) => !favorites.includes(item.id)) && <p className={styles.emptyState}>Chưa có chủ đề yêu thích. Chọn trái tim ở danh sách chủ đề để lưu lại nhé.</p>}
              </div>
            )}
            <button type="button" className={styles.secondaryButton} onClick={() => setScreen('topics')}><ArrowLeft size={18} /> Chọn chủ đề</button>
          </section>
        )}

        <footer className={styles.footer}>
          <button type="button" onClick={goHome}><House size={17} /> Trang đầu</button>
          <span>Học một chút, vui một ngày <span aria-hidden="true">🌱</span></span>
          {screen === 'topics' ? <button type="button" onClick={() => setScreen('progress')}><Star size={17} /> Tiến độ</button> : <button type="button" onClick={() => setScreen('topics')}>Chủ đề <ChevronRight size={17} /></button>}
        </footer>
      </div>
    </main>
  );
}