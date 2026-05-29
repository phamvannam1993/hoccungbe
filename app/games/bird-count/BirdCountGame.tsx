"use client";

import { useEffect, useMemo, useState } from "react";
import { birdCountQuestions } from "./data";
import { speakText, stopSpeaking } from "../../components/edu/utils/speech";
import styles from "./BirdCountGame.module.css";

type BirdProps = {
  top: number;
  delay: number;
  duration: number;
};

function Bird({ top, delay, duration }: BirdProps) {
  return (
    <div
      className={styles.bird}
      style={{
        top,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    >
      <div className={styles.tail} />
      <div className={styles.wingLeft} />
      <div className={styles.wingRight} />
      <div className={styles.birdBody} />
      <div className={styles.birdHead} />
      <div className={styles.beak} />
    </div>
  );
}

export default function BirdCountGame() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [replayKey, setReplayKey] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [message, setMessage] = useState("Quan sát chim bay qua màn hình rồi chọn đáp án.");

  const question = birdCountQuestions[questionIndex];
  const isAnswered = selectedAnswer !== null;

  // Deterministic pseudo-random theo index để tránh hydration mismatch (SSR vs CSR)
  const birds = useMemo(() => {
    return Array.from({ length: question.birdCount }, (_, index) => {
      // Hàm pseudo-random gieo bởi index + replayKey, kết quả ổn định
      const seed = (index * 9301 + replayKey * 49297) % 233280;
      const rand = seed / 233280; // 0..1
      return {
        top: 110 + (index % 3) * 64 + rand * 10,
        delay: index * 0.55,
        duration: 6.2 + (index % 3) * 0.45,
      };
    });
  }, [question.birdCount, replayKey]);

  useEffect(() => {
    setSelectedAnswer(null);
    setMessage("Quan sát chim bay qua màn hình rồi chọn đáp án.");

    const timer = window.setTimeout(() => {
      setMessage("Bây giờ hãy chọn số chim bạn vừa thấy.");
    }, 3400);

    return () => window.clearTimeout(timer);
  }, [questionIndex, replayKey]);

  const handleChoose = (answer: number) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);

    if (answer === question.birdCount) {
      const msg = `Đúng rồi! Có ${question.birdCount} chú chim.`;
      setMessage(msg);
      speakText(msg, { lang: "vi-VN", rate: 0.95 });
      window.setTimeout(() => {
        setQuestionIndex((current) => (current + 1) % birdCountQuestions.length);
        setReplayKey((current) => current + 1);
      }, 1600);
    } else {
      const msg = `Chưa đúng. Có ${question.birdCount} chú chim. Bấm Xem lại để quan sát lại.`;
      setMessage(msg);
      speakText(msg, { lang: "vi-VN", rate: 0.95 });
    }
  };

  const handleReplay = () => {
    setReplayKey((current) => current + 1);
  };

  const handleSpeak = () => {
    speakText(question.question, { lang: "vi-VN", rate: 0.95 });
  };

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  return (
    <main className={styles.app}>
      <section className={styles.game}>
        <div className={styles.scene}>
          <div className={styles.leftHill} />
          <div className={styles.treeTopLeft} />

          <div className={styles.mountains}>
            <div className={`${styles.mountain} ${styles.m1}`} />
            <div className={`${styles.mountain} ${styles.m2}`} />
            <div className={`${styles.mountain} ${styles.m3}`} />
            <div className={`${styles.mountain} ${styles.m4}`} />
            <div className={`${styles.mountain} ${styles.m5}`} />
          </div>

          <div className={styles.house}>
            <div className={styles.chimney} />
            <div className={styles.roofMain} />
            <div className={styles.roofSide} />
            <div className={styles.frontWall} />
            <div className={styles.sideWall} />
            <div className={`${styles.window} ${styles.w1}`} />
            <div className={`${styles.window} ${styles.w2}`} />
            <div className={`${styles.window} ${styles.w3}`} />
            <div className={`${styles.window} ${styles.w4}`} />
            <div className={styles.door} />
          </div>

          <div className={styles.pier} />
          <div className={styles.grassBand} />
          <div className={styles.flowersBottom} />
          <div className={styles.pond} />

          <div className={styles.rightTree}>
            <div className={styles.crown} />
            <div className={styles.trunk} />
          </div>

          <div className={styles.birdsLayer} key={replayKey}>
            {birds.map((bird, index) => (
              <Bird
                key={index}
                top={bird.top}
                delay={bird.delay}
                duration={bird.duration}
              />
            ))}
          </div>

          <div className={styles.hudTop}>
            <span className={styles.roundBadge}>{questionIndex + 1}</span>
            <span>Lượt chơi</span>
          </div>

          <div className={styles.message}>{message}</div>

          <button className={styles.replayButton} onClick={handleReplay}>
            <span className={styles.replayIcon}>↻</span>
            <span>Xem lại</span>
          </button>
        </div>

        <div className={styles.questionPanel}>
          <div className={styles.questionRow}>
            <button className={styles.audioButton} onClick={handleSpeak}>
              🔊
            </button>
            <div className={styles.questionText}>{question.question}</div>
          </div>

          <div className={styles.options}>
            {question.options.map((option) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = isAnswered && option === question.birdCount;
              const isWrong = isSelected && option !== question.birdCount;

              return (
                <button
                  key={option}
                  className={[
                    styles.optionButton,
                    isAnswered ? styles.disabledOption : "",
                    isCorrect ? styles.correctOption : "",
                    isWrong ? styles.wrongOption : "",
                  ].join(" ")}
                  onClick={() => handleChoose(option)}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
