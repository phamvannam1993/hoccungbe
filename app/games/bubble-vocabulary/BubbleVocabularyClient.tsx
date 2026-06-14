"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { bubbleLayout, lessons, type VocabularyItem, type BubbleColor } from "./data";
import { speakText } from "@/app/components/edu/utils/speech";
import styles from "./BubbleVocabulary.module.css";

const COLORS: BubbleColor[] = ["pink", "orange", "purple", "blue", "green"];

function shuffleWithTarget<T extends { id: string }>(items: T[], seed: number) {
  const shuffled = [...items];

  // Fisher-Yates shuffle com seed determinístico
  for (let i = shuffled.length - 1; i > 0; i--) {
    // Gera número pseudo-aleatório usando seed
    const rand = Math.abs(Math.sin((seed + i) * 12.9898) * 43758.5453) % 1;
    const j = Math.floor(rand * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function assignUniqueColors<T extends { id: string }>(items: T[], seed: number): (T & { displayColor: BubbleColor })[] {
  // Embaralha as cores usando seed para consistência
  const shuffledColors = [...COLORS];
  for (let i = shuffledColors.length - 1; i > 0; i--) {
    const rand = Math.abs(Math.sin((seed * 77.7777 + i) * 12.9898) * 43758.5453) % 1;
    const j = Math.floor(rand * (i + 1));
    [shuffledColors[i], shuffledColors[j]] = [shuffledColors[j], shuffledColors[i]];
  }

  // Atribui cor única para cada item
  return items.map((item, index) => ({
    ...item,
    displayColor: shuffledColors[index % COLORS.length],
  }));
}

export default function BubbleVocabularyClient() {
  const [lessonIndex, setLessonIndex] = useState(0);
  const [roundIndex, setRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState(100);
  const [selectedWrongId, setSelectedWrongId] = useState("");
  const [message, setMessage] = useState({
    type: "normal",
    text: "Bấm loa để nghe từ, rồi bắt bong bóng đúng nhé!",
  });
  const [confettiKey, setConfettiKey] = useState(0);

  const lesson = lessons[lessonIndex];
  const target = lesson.items[roundIndex % lesson.items.length];

  const bubbles = useMemo(() => {
    const shuffled = shuffleWithTarget(lesson.items, roundIndex);
    // Limita a apenas 5 bolinhas para garantir cores completamente diferentes
    const limited = shuffled.slice(0, 5);
    return assignUniqueColors(limited, roundIndex);
  }, [lesson.items, roundIndex]);

  const progress = Math.round(((roundIndex % lesson.items.length) / lesson.items.length) * 100);

  useEffect(() => {
    const timer = setTimeout(() => {
      speakText(target.speakText);
    }, 350);

    return () => clearTimeout(timer);
  }, [target.speakText]);

  function handleSelect(item: VocabularyItem) {
    if (item.id === target.id) {
      setScore((value) => value + 1);
      setStars((value) => value + 1);
      setConfettiKey((value) => value + 1);
      setMessage({
        type: "ok",
        text: `Đúng rồi! Đây là “${target.word}” 🎉`,
      });
      speakText(target.speakText);

      setTimeout(() => {
        setRoundIndex((value) => value + 1);
        setMessage({
          type: "normal",
          text: "Bấm loa để nghe từ, rồi bắt bong bóng đúng nhé!",
        });
      }, 950);

      return;
    }

    setSelectedWrongId(item.id);
    setMessage({
      type: "bad",
      text: "Chưa đúng rồi. Bé nghe lại và thử lần nữa nhé!",
    });

    setTimeout(() => {
      setSelectedWrongId("");
    }, 600);
  }

  function nextLesson() {
    const nextIndex = (lessonIndex + 1) % lessons.length;
    setLessonIndex(nextIndex);
    setRoundIndex(0);
    setScore(0);
    setMessage({
      type: "normal",
      text: "Bài mới đã sẵn sàng. Bé nghe từ và bắt bong bóng nhé!",
    });
  }

  function resetGame() {
    setRoundIndex(0);
    setScore(0);
    setSelectedWrongId("");
    setMessage({
      type: "normal",
      text: "Bấm loa để nghe từ, rồi bắt bong bóng đúng nhé!",
    });
  }

  return (
    <main className={styles.page}>
      <section className={styles.gameShell}>
        <Confetti key={confettiKey} />

        <header className={styles.header}>
          <button className={styles.homeButton} aria-label="Trang chủ">⌂</button>

          <div className={styles.mascot} aria-hidden="true">🐻</div>

          <div className={styles.titleCard}>
            <h1>Bắt Bong Bóng Từ Vựng</h1>
            <p>{lesson.title} · {lesson.subtitle}</p>
          </div>

          <div className={styles.scoreCard}>
            <span>⭐</span>
            <strong>{stars}</strong>
          </div>
        </header>

        <div className={styles.progress}>
          <div style={{ width: `${progress}%` }} />
        </div>

        <section className={styles.promptCard}>
          <div>
            <span className={styles.promptLabel}>Bé hãy tìm:</span>
            <strong>{target.word}</strong>
          </div>

          <button
            className={styles.speakerButton}
            onClick={() => speakText(target.speakText)}
            aria-label="Nghe từ cần tìm"
          >
            🔊 Nghe từ
          </button>
        </section>

        <section className={styles.playArea}>
          <div className={styles.cloudOne} />
          <div className={styles.cloudTwo} />
          <div className={styles.sun} />

          {bubbles.map((item: any, index: number) => {
            const layout = bubbleLayout[index % bubbleLayout.length];

            return (
              <button
                key={`${item.id}-${roundIndex}`}
                className={`${styles.bubble} ${styles[item.displayColor]} ${
                  selectedWrongId === item.id ? styles.wrong : ""
                }`}
                style={{
                  left: layout.left,
                  top: layout.top,
                  animationDelay: layout.delay,
                  animationDuration: layout.duration,
                }}
                onClick={() => handleSelect(item)}
                aria-label={`Chọn ${item.word}`}
              >
                <span className={styles.bubbleEmoji}>{item.emoji}</span>
                <span className={styles.bubbleWord}>{item.word}</span>
              </button>
            );
          })}
        </section>

        <footer className={styles.footer}>
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>

          <div className={styles.roundInfo}>
            Đúng: <strong>{score}</strong> / {lesson.items.length}
          </div>

          <button className={`${styles.actionButton} ${styles.reset}`} onClick={resetGame}>
            Làm lại
          </button>

          <button className={`${styles.actionButton} ${styles.next}`} onClick={nextLesson}>
            Bài tiếp
          </button>
        </footer>
      </section>
    </main>
  );
}

function Confetti() {
  const colors = ["#ffcf47", "#ff6f91", "#45b7ff", "#74d66b", "#a986ff"];

  return (
    <div className={styles.confetti} aria-hidden="true">
      {Array.from({ length: 26 }).map((_, index) => (
        <span
          key={index}
          style={{
            left: `${(index * 29) % 100}%`,
            animationDelay: `${(index % 7) * 0.035}s`,
            "--rotate": `${120 + index * 19}deg`,
            "--confettiColor": colors[index % colors.length],
          } as CSSProperties}
        />
      ))}
    </div>
  );
}
