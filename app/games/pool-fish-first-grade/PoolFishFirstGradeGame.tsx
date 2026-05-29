"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { generateLevel, getAnswer } from "./data";
import { speakText, stopSpeaking } from "../../components/edu/utils/speech";
import styles from "./PoolFishFirstGradeGame.module.css";

const fishColors = ["orange", "pink", "blue", "yellow", "green", "purple", "red", "mint", "coral", "gold"];

export default function PoolFishFirstGradeGame() {
  const [round, setRound] = useState(0);
  const [bestRound, setBestRound] = useState(0);
  const [prevAnswer, setPrevAnswer] = useState<number | undefined>(undefined);
  const [replayKey, setReplayKey] = useState(0);
  const [phase, setPhase] = useState<"watch" | "answer" | "correct" | "wrong">("watch");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const lastSpokenRound = useRef<number>(-1);
  const poolRef = useRef<HTMLDivElement>(null);
  const [sceneScale, setSceneScale] = useState(1);
  const VW = 1000;

  useEffect(() => {
    const update = () => {
      const w = poolRef.current?.clientWidth ?? VW;
      setSceneScale(w / VW);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const level = useMemo(() => generateLevel(round, prevAnswer), [round, prevAnswer]);
  const answer = getAnswer(level);

  const fishes = useMemo(() => {
    const baseCount = level.totalFish;
    const addCount = level.addFish ?? 0;
    const allCount = level.skill === "addition" ? baseCount + addCount : baseCount;

    return Array.from({ length: allCount }, (_, index) => {
      const isNew = level.skill === "addition" && index >= baseCount;
      const isLeaving = level.skill === "subtraction" && index >= baseCount - (level.swimAway ?? 0);

      return {
        id: index + 1,
        top: 92 + (index % 4) * 78 + Math.floor(index / 4) * 24,
        left: 120 + (index % 5) * 175,
        color: fishColors[index % fishColors.length],
        delay: isNew ? 1.1 + (index - baseCount) * 0.45 : index * 0.12,
        duration: 5.8 + (index % 4) * 0.7,
        isNew,
        isLeaving,
      };
    });
  }, [level]);

  useEffect(() => {
    if (gameOver) return;
    setPhase("watch");
    setSelectedAnswer(null);

    if (audioUnlocked && lastSpokenRound.current !== round) {
      lastSpokenRound.current = round;
      speakText(level.question, { lang: "vi-VN", rate: 0.95 });
    }

    const timer = window.setTimeout(() => {
      setPhase("answer");
    }, 3900);

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
      const msg = `Đúng rồi! Đáp án là ${answer}.`;
      speakText(msg, { lang: "vi-VN", rate: 0.95 });

      window.setTimeout(() => {
        setPrevAnswer(answer);
        setRound((r) => r + 1);
        setReplayKey((k) => k + 1);
      }, 2200);
    } else {
      setPhase("wrong");
      speakText("Chưa đúng.", { lang: "vi-VN", rate: 0.95 });
      setGameOver(true);
    }
  };

  const handleStart = () => {
    setAudioUnlocked(true);
    lastSpokenRound.current = round;
    const guide =
      "Quan sát các chú cá bơi trong hồ. Đếm số cá đúng rồi chọn đáp án. Nếu sai, trò chơi kết thúc.";
    const watchMsg =
      level.skill === "addition"
        ? `${level.totalFish} con cá đang bơi, thêm ${level.addFish} con cá bơi tới. Quan sát nhé!`
        : level.skill === "subtraction"
        ? `${level.totalFish} con cá đang bơi, ${level.swimAway} con sắp bơi đi. Quan sát nhé!`
        : "Hãy quan sát và đếm số cá trong hồ.";
    speakText(`${guide} ${watchMsg}`, { lang: "vi-VN", rate: 0.95 });
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

  const replay = () => setReplayKey((k) => k + 1);

  const speakQuestion = () => speakText(level.question, { lang: "vi-VN", rate: 0.95 });

  const equation =
    level.skill === "addition"
      ? `${level.totalFish} + ${level.addFish} = ?`
      : level.skill === "subtraction"
      ? `${level.totalFish} - ${level.swimAway} = ?`
      : `${level.totalFish}`;

  const message =
    phase === "correct"
      ? `Đúng rồi! Đáp án là ${answer}.`
      : phase === "wrong"
      ? "Chưa đúng rồi, bé hãy quan sát và đếm lại nhé."
      : phase === "answer"
      ? "Bây giờ hãy chọn đáp án đúng."
      : level.skill === "addition"
      ? `${level.totalFish} con cá đang bơi, thêm ${level.addFish} con cá bơi tới.`
      : level.skill === "subtraction"
      ? `${level.totalFish} con cá đang bơi, ${level.swimAway} con bơi đi.`
      : "Hãy quan sát và đếm số cá trong hồ.";

  return (
    <main className={styles.app}>
      <section className={styles.game}>
        {!audioUnlocked && (
          <div className={styles.startOverlay}>
            <div className={styles.gameOverBox}>
              <div className={styles.gameOverTitle}>🐟 Cá trong hồ bơi</div>
              <ul className={styles.instructions}>
                <li>👀 Quan sát <strong>số cá</strong> đang bơi trong hồ.</li>
                <li>➕ Theo dõi cá <strong>bơi tới</strong> hoặc <strong>bơi đi</strong>.</li>
                <li>✅ Chọn đúng số cá → sang câu mới.</li>
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
        <div className={styles.pool} ref={poolRef}>
          <div
            className={styles.stage}
            style={{ width: VW, height: 500, transform: `scale(${sceneScale})`, transformOrigin: 'top left' }}
          >
          <div className={styles.waterGlow} />
          <div className={styles.poolRim} />
          <div className={styles.lightOne} />
          <div className={styles.lightTwo} />

          <div className={styles.bubbles}>
            {Array.from({ length: 24 }).map((_, index) => (
              <span key={index} style={{
                left: `${5 + (index * 8) % 90}%`,
                animationDelay: `${-(index % 8) * 0.7}s`,
                animationDuration: `${5 + (index % 5)}s`,
                width: `${8 + (index % 4) * 5}px`,
                height: `${8 + (index % 4) * 5}px`,
              }} />
            ))}
          </div>

          <div className={styles.tiles}>{Array.from({ length: 12 }).map((_, index) => <span key={index} />)}</div>
          <div className={styles.plantsLeft}><span /><span /><span /></div>
          <div className={styles.plantsRight}><span /><span /><span /></div>
          <div className={styles.stones}><span /><span /><span /><span /></div>

          <div className={styles.fishLayer} key={round + '-' + replayKey}>
            {fishes.map((fish) => (
              <div
                key={fish.id}
                className={[
                  styles.fish,
                  styles[fish.color],
                  fish.isNew ? styles.newFish : "",
                  fish.isLeaving ? styles.leavingFish : "",
                ].join(" ")}
                style={{
                  top: fish.top,
                  left: fish.left,
                  animationDelay: `${fish.delay}s`,
                  animationDuration: `${fish.duration}s`,
                }}
              >
                <span className={styles.tail} />
                <span className={styles.body} />
                <span className={styles.finTop} />
                <span className={styles.finBottom} />
                <span className={styles.eye} />
                {fish.isNew && <span className={styles.newTag}>+1</span>}
                {fish.isLeaving && <span className={styles.leaveTag}>bơi đi</span>}
              </div>
            ))}
          </div>

          <div className={styles.topHud}>
            <div className={styles.badge}>Vòng {round + 1}</div>
            <div className={styles.score}>⭐ {bestRound}</div>
          </div>

          <div className={[styles.message, styles[phase]].join(" ")}>{message}</div>
          <div className={styles.equationBox}>{equation}</div>

          <div className={styles.sceneActions}>
            <button onClick={replay}>↻ Xem lại</button>
          </div>
          </div>{/* end .stage */}
        </div>

        <div className={styles.questionPanel}>
          <div className={styles.questionLeft}>
            <button className={styles.audioButton} onClick={speakQuestion}>🔊</button>
            <div>
              <h1>Cá trong hồ bơi</h1>
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
