'use client';

import { useMemo, useState } from 'react';
import { lessons, type Lesson, type Tile, type Row, type ColorType } from './docVanGhepChu.data';
import { speakText } from '@/app/components/edu/utils/speech';
import styles from './GameDocVan.module.css';

type MessageType = 'normal' | 'ok' | 'bad';

interface Message {
  type: MessageType;
  text: string;
}

export default function DocVanGhepChuGame() {
  const [lessonIndex, setLessonIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedTile, setSelectedTile] = useState('');
  const [score, setScore] = useState(lessons[0].scoreStart);
  const [message, setMessage] = useState<Message>({
    type: 'normal',
    text: 'Chọn chữ rồi ghép vào ô trống để tạo vần nhé!',
  });
  const [shakeId, setShakeId] = useState('');
  const [confettiKey, setConfettiKey] = useState(0);

  const lesson = lessons[lessonIndex];

  const completedCount = useMemo(() => {
    return lesson.rows.filter((row) => answers[row.id] === row.answer).length;
  }, [answers, lesson.rows]);

  const progress = Math.round((completedCount / lesson.rows.length) * 100);

  const handleAnswer = (row: Row, tile: string) => {
    if (!tile) {
      setMessage({
        type: 'bad',
        text: 'Bé hãy chọn một chữ ở hàng dưới trước nhé!',
      });
      return;
    }

    const isCorrect = tile === row.answer;
    const wasCorrect = answers[row.id] === row.answer;

    setSelectedTile('');

    if (isCorrect) {
      setAnswers((prev) => ({
        ...prev,
        [row.id]: tile,
      }));

      setMessage({
        type: 'ok',
        text: `Đúng rồi! Bé ghép được "${row.result}" 🎉`,
      });

      if (!wasCorrect) {
        setScore((value) => value + 1);
        setConfettiKey((value) => value + 1);
      }

      speakText(row.speakText || row.result);
      return;
    }

    // Sai - không lưu vào state, chỉ hiển thị lỗi
    setShakeId(row.id);
    const errorMessage = `Chưa đúng rồi. Đáp án là "${row.result}". Bé thử lại nhé!`;
    setMessage({
      type: 'bad',
      text: errorMessage,
    });

    // Đọc full message
    setTimeout(() => {
      speakText(errorMessage);
    }, 300);

    setTimeout(() => {
      setShakeId('');
    }, 650);
  };

  const handleDrop = (event: React.DragEvent<HTMLButtonElement>, row: Row) => {
    event.preventDefault();
    const tile = event.dataTransfer.getData('text/plain');

    // Check if tile is correct before allowing drop
    if (tile !== row.answer) {
      setShakeId(row.id);
      const errorMessage = `Chưa đúng rồi. Đáp án là "${row.result}". Bé thử lại nhé!`;
      setMessage({
        type: 'bad',
        text: errorMessage,
      });
      setTimeout(() => speakText(errorMessage), 300);
      setTimeout(() => setShakeId(''), 650);
      return;
    }

    handleAnswer(row, tile);
  };

  const resetLesson = () => {
    setAnswers({});
    setSelectedTile('');
    setShakeId('');
    setMessage({
      type: 'normal',
      text: 'Chọn chữ rồi ghép vào ô trống để tạo vần nhé!',
    });
  };

  const goNextLesson = () => {
    const isLessonComplete = completedCount === lesson.rows.length;

    if (!isLessonComplete) {
      setMessage({
        type: 'bad',
        text: `Bé chưa hoàn thành bài! Còn ${lesson.rows.length - completedCount} tiếng chưa ghép. Cố gắng nhé!`,
      });
      speakText(`Bé chưa hoàn thành bài! Còn ${lesson.rows.length - completedCount} tiếng chưa ghép. Cố gắng nhé!`);
      return;
    }

    const nextIndex = (lessonIndex + 1) % lessons.length;
    setLessonIndex(nextIndex);
    setScore(lessons[nextIndex].scoreStart);
    setAnswers({});
    setSelectedTile('');
    setShakeId('');

    const encouragementPhrases = [
      'Bé giỏi lắm! Bài tiếp theo nào!',
      'Tuyệt vời! Bé làm rất tốt!',
      'Bé siêu quá! Tiếp tục học nào!',
      'Làm tốt lắm! Bài mới chờ bé!',
    ];
    const encouragement = encouragementPhrases[nextIndex % encouragementPhrases.length];

    setMessage({
      type: 'ok',
      text: encouragement,
    });

    speakText(encouragement);
  };

  return (
    <main className={styles.page}>
      <section className={styles.tablet}>
        <div className={styles.camera} />

        <div className={styles.screen}>
          <Confetti key={confettiKey} />

          <div className={styles.app}>
            <header className={styles.header}>
              <button className={styles.homeButton} aria-label="Trang chủ">
                <span>⌂</span>
              </button>

              <div className={styles.mascot} aria-hidden="true">
                <div className={styles.dog}>
                  <span className={styles.earLeft} />
                  <span className={styles.earRight} />
                  <span className={styles.eyeLeft} />
                  <span className={styles.eyeRight} />
                  <span className={styles.nose} />
                  <span className={styles.smile} />
                </div>
              </div>

              <div className={styles.titleCard}>
                <h1>{lesson.title}</h1>
                <p>{lesson.subtitle}</p>
              </div>

              <div className={styles.score}>
                <span>⭐</span>
                <strong>{score}</strong>
              </div>
            </header>

            <div className={styles.progress}>
              <div style={{ width: `${progress}%` }} />
            </div>

            <section className={styles.content}>
              <div className={styles.board}>
                <div className={styles.rows}>
                  {lesson.rows.map((row) => {
                    const currentValue = answers[row.id] || '';
                    const isDone = currentValue === row.answer;

                    return (
                      <div
                        key={row.id}
                        className={`${styles.row} ${
                          shakeId === row.id ? styles.shake : ''
                        }`}
                      >
                        <LetterBox text={row.first} color="blue" />

                        <div className={styles.plus}>+</div>

                        <button
                          type="button"
                          className={`${styles.dropBox} ${
                            currentValue ? styles.filled : ''
                          } ${selectedTile && !isDone ? styles.ready : ''}`}
                          onClick={() => handleAnswer(row, selectedTile)}
                          onDragOver={(event) => event.preventDefault()}
                          onDrop={(event) => handleDrop(event, row)}
                          aria-label={`Ô trống ghép vần ${row.result}`}
                        >
                          {currentValue}
                        </button>

                        <div className={styles.arrow}>→</div>

                        <button
                          type="button"
                          className={`${styles.result} ${styles[row.color]}`}
                          onClick={() => speakText(row.speakText || row.result)}
                        >
                          {row.result}
                        </button>

                        <div
                          className={`${styles.done} ${isDone ? styles.show : ''}`}
                          aria-hidden="true"
                        >
                          ✓
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className={styles.tileBank}>
                  <span className={styles.tileLabel}>Chữ cái</span>

                  {lesson.tiles.map((tile) => (
                    <button
                      key={`${lesson.id}-${tile.text}`}
                      type="button"
                      draggable
                      className={`${styles.tile} ${styles[tile.color]} ${
                        selectedTile === tile.text ? styles.selected : ''
                      }`}
                      onDragStart={(event) => {
                        event.dataTransfer.setData('text/plain', tile.text);
                      }}
                      onClick={() =>
                        setSelectedTile((current) =>
                          current === tile.text ? '' : tile.text
                        )
                      }
                    >
                      {tile.text}
                    </button>
                  ))}
                </div>
              </div>

              <aside className={styles.readPanel}>
                <div className={styles.readHeader}>
                  <h2>Đọc vần</h2>
                  <button
                    type="button"
                    className={styles.speaker}
                    onClick={() => speakText(lesson.readWords.join(' '))}
                    aria-label="Nghe tất cả vần"
                  >
                    🔊
                  </button>
                </div>

                <div className={styles.readList}>
                  {lesson.readWords.map((word, index) => (
                    <button
                      key={`${lesson.id}-${index}-${word}`}
                      type="button"
                      className={`${styles.readWord} ${getReadWordColor(index)}`}
                      onClick={() => speakText(word)}
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </aside>
            </section>

            <footer className={styles.footer}>
              <div className={`${styles.message} ${styles[message.type]}`}>
                {message.text}
              </div>

              <button
                type="button"
                className={`${styles.action} ${styles.reset}`}
                onClick={resetLesson}
              >
                Làm lại
              </button>

              <button
                type="button"
                className={`${styles.action} ${styles.next}`}
                onClick={goNextLesson}
              >
                Bài tiếp
              </button>
            </footer>
          </div>
        </div>
      </section>
    </main>
  );
}

function LetterBox({ text, color }: { text: string; color: ColorType }) {
  return <div className={`${styles.letterBox} ${styles[color]}`}>{text}</div>;
}

function Confetti() {
  const colors = ['#ffcf47', '#ff6f91', '#45b7ff', '#74d66b', '#a986ff'];

  return (
    <div className={styles.confetti} aria-hidden="true">
      {Array.from({ length: 24 }).map((_, index) => (
        <span
          key={index}
          style={{
            left: `${(index * 37) % 100}%`,
            animationDelay: `${(index % 6) * 0.035}s`,
            '--rotate': `${120 + index * 21}deg`,
            '--confettiColor': colors[index % colors.length],
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

function getReadWordColor(index: number): string {
  const colorMap: Record<number, string> = {
    0: styles.blue,
    1: styles.pink,
    2: styles.green,
    3: styles.orange,
  };
  return colorMap[index] || styles.blue;
}
