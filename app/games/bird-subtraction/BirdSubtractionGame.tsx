"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { generateLevel } from "./data";
import { speakText, stopSpeaking } from "../../components/edu/utils/speech";
import styles from "./BirdSubtractionGame.module.css";

export default function BirdSubtractionGame() {
  const [round, setRound] = useState(0);
  const [bestRound, setBestRound] = useState(0);
  const [prevAnswer, setPrevAnswer] = useState<number | undefined>(undefined);
  const [replayKey, setReplayKey] = useState(0);
  const [phase, setPhase] = useState<"watch" | "answer" | "correct" | "wrong">("watch");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const lastSpokenRound = useRef<number>(-1);

  const level = useMemo(() => generateLevel(round, prevAnswer), [round, prevAnswer]);
  const answer = level.total - level.flyAway;

  const birdSlots = useMemo(() => {
    return Array.from({ length: level.total }, (_, index) => ({
      id: index + 1,
      isFlyingAway: index >= level.total - level.flyAway,
      left: 160 + (index % 5) * 142,
      top: 215 + Math.floor(index / 5) * 88 + (index % 2) * 10,
    }));
  }, [level.total, level.flyAway]);

  useEffect(() => {
    if (gameOver) return;
    setPhase("watch");
    setSelectedAnswer(null);

    if (audioUnlocked && lastSpokenRound.current !== round) {
      lastSpokenRound.current = round;
      const intro = `Có ${level.total} con chim, ${level.flyAway} con sắp bay đi. Quan sát nhé!`;
      speakText(intro, { lang: "vi-VN", rate: 0.95 });
    }

    const timer = window.setTimeout(() => {
      setPhase("answer");
      if (audioUnlocked) {
        speakText("Hãy chọn số chim còn lại.", { lang: "vi-VN", rate: 0.95 });
      }
    }, 3600);

    return () => window.clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, replayKey, audioUnlocked, gameOver]);

  useEffect(() => () => stopSpeaking(), []);

  const chooseAnswer = (value: number) => {
    if (phase !== "answer") return;
    setSelectedAnswer(value);

    if (value === answer) {
      setPhase("correct");
      setBestRound((b) => Math.max(b, round + 1));
      const msg = `Đúng rồi! ${level.total} trừ ${level.flyAway} bằng ${answer}.`;
      speakText(msg, { lang: "vi-VN", rate: 0.95 });

      window.setTimeout(() => {
        setPrevAnswer(answer);
        setRound((r) => r + 1);
        setReplayKey((k) => k + 1);
      }, 2200);
    } else {
      setPhase("wrong");
      const msg = `Chưa đúng rồi. Trò chơi kết thúc.`;
      speakText(msg, { lang: "vi-VN", rate: 0.95 });
      setGameOver(true);
    }
  };

  const handleStart = () => {
    setAudioUnlocked(true);
    lastSpokenRound.current = round;
    const guide =
      "Quan sát chim đậu trên cành. Một số con sẽ bay đi. Sau đó chọn số chim còn lại. Nếu sai, trò chơi kết thúc.";
    const intro = `Có ${level.total} con chim, ${level.flyAway} con sắp bay đi. Quan sát nhé!`;
    speakText(`${guide} ${intro}`, { lang: "vi-VN", rate: 0.95 });
  };

  const handleRestart = () => {
    setRound(0);
    setPrevAnswer(undefined);
    setGameOver(false);
    setSelectedAnswer(null);
    setPhase("watch");
    setReplayKey((k) => k + 1);
    lastSpokenRound.current = -1;
  };

  const speakQuestion = () => {
    speakText(level.question, { lang: "vi-VN", rate: 0.95 });
  };

  const replay = () => {
    setReplayKey((k) => k + 1);
  };

  const message =
    phase === "watch"
      ? `${level.total} con chim đang đậu. Có ${level.flyAway} con sắp bay đi.`
      : phase === "answer"
      ? "Hãy chọn số chim còn lại."
      : phase === "correct"
      ? `Đúng rồi! ${level.total} - ${level.flyAway} = ${answer}.`
      : "Chưa đúng rồi, mình cùng đếm lại số chim còn đậu nhé.";

  return (
    <main className={styles.app}>
      <section className={styles.game}>
        <div className={styles.scene}>
        {!audioUnlocked && (
          <div className={styles.startOverlay}>
            <div className={styles.gameOverBox}>
              <div className={styles.gameOverTitle}>🐦 Chim bay mất</div>
              <ul className={styles.instructions}>
                <li>👀 Quan sát <strong>số chim đậu</strong> trên cành.</li>
                <li>🐦 Xem bao nhiêu con <strong>bay đi</strong>.</li>
                <li>✅ Chọn đúng số chim còn lại → sang câu mới.</li>
                <li>❌ Chọn sai → kết thúc, bấm <strong>Chơi lại</strong>.</li>
              </ul>
              <button className={styles.startButton} onClick={handleStart}>
                ▶ Bắt đầu chơi
              </button>
            </div>
          </div>
        )}
        {gameOver && (
          <div className={styles.startOverlay}>
            <div className={styles.gameOverBox}>
              <div className={styles.gameOverTitle}>Trò chơi kết thúc</div>
              <div className={styles.gameOverScore}>
                Bạn đã trả lời đúng <strong>{bestRound}</strong> vòng
              </div>
              <button className={styles.startButton} onClick={handleRestart}>
                ↻ Chơi lại
              </button>
            </div>
          </div>
        )}
          <div className={styles.sun} />
          <div className={`${styles.cloud} ${styles.cloudOne}`} />
          <div className={`${styles.cloud} ${styles.cloudTwo}`} />
          <div className={styles.farHills} />
          <div className={styles.nearHill} />
          <div className={styles.treeLeft}><span /><span /><span /></div>
          <div className={styles.treeRight}><span /><span /><span /></div>

          <div className={styles.branch}>
            <span />
          </div>

          <div className={styles.birdsLayer} key={`${round}-${replayKey}`}>
            {birdSlots.map((bird, index) => (
              <button
                key={bird.id}
                className={[
                  styles.bird,
                  bird.isFlyingAway ? styles.flyAwayBird : styles.stayBird,
                ].join(" ")}
                style={{
                  left: bird.left,
                  top: bird.top,
                  animationDelay: bird.isFlyingAway ? `${0.7 + (index % level.flyAway) * 0.35}s` : `${index * 0.05}s`,
                }}
                aria-label={`Chim ${bird.id}`}
              >
                <span className={styles.wingBack} />
                <span className={styles.tail} />
                <span className={styles.body} />
                <span className={styles.wingFront} />
                <span className={styles.head} />
                <span className={styles.eye} />
                <span className={styles.beak} />
                <span className={styles.legOne} />
                <span className={styles.legTwo} />
              </button>
            ))}
          </div>

          <div className={styles.topHud}>
            <div className={styles.badge}>Vòng {round + 1}</div>
            <div className={styles.score}>⭐ {bestRound}</div>
          </div>

          <div className={[styles.message, styles[phase]].join(" ")}>
            {message}
          </div>

          <div className={styles.visualEquation}>
            <strong>{level.total}</strong>
            <span>-</span>
            <strong>{level.flyAway}</strong>
            <span>=</span>
            <strong>?</strong>
          </div>

          <div className={styles.sceneActions}>
            <button onClick={replay}>↻ Xem lại</button>
          </div>
        </div>{/* end .scene */}

        <div className={styles.questionPanel}>
          <div className={styles.questionLeft}>
            <button className={styles.audioButton} onClick={speakQuestion}>🔊</button>
            <div>
              <h1>Chim bay mất</h1>
              <p>{level.question}</p>
            </div>
          </div>

          <div className={styles.options}>
            {level.options.map((option) => (
              <button
                key={option}
                className={[
                  styles.optionButton,
                  selectedAnswer === option ? styles.selectedOption : "",
                  phase === "correct" && option === answer ? styles.correctOption : "",
                  phase === "wrong" && selectedAnswer === option ? styles.wrongOption : "",
                ].join(" ")}
                onClick={() => chooseAnswer(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
