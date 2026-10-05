"use client";

import { PointerEvent, useEffect, useMemo, useRef, useState } from "react";
import { generateColumnLevel } from "./data";
import { speakText, stopSpeaking } from "../../components/edu/utils/speech";
import styles from "./ColumnLiftDragGame.module.css";

export default function ColumnLiftDragGame() {
  const [round, setRound] = useState(0);
  const [bestRound, setBestRound] = useState(0);
  const [prevAnswer, setPrevAnswer] = useState<number | undefined>(undefined);
  const [value, setValue] = useState(0);
  const [status, setStatus] = useState<"playing" | "correct" | "wrong">("playing");
  const [isDragging, setIsDragging] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  const lastSpokenRound = useRef(-1);
  const chartRef = useRef<HTMLDivElement | null>(null);

  const level = useMemo(() => generateColumnLevel(round, prevAnswer), [round, prevAnswer]);
  const missingIndex = useMemo(() => level.sequence.findIndex((item) => item === null), [level]);
  const maxValue = 100;

  useEffect(() => {
    setValue(0);
    setStatus("playing");
    if (audioUnlocked && !gameOver && lastSpokenRound.current !== round) {
      lastSpokenRound.current = round;
      const timer = window.setTimeout(() => {
        const seqText = level.sequence.map((x) => (x === null ? "ô trống" : x)).join(", ");
        speakText(`${level.instruction} ${seqText}`);
      }, 800);
      return () => window.clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, audioUnlocked]);

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  const shownValues = level.sequence.map((item, index) => (index === missingIndex ? value : item ?? 0));
  const valueToHeight = (num: number) => Math.max(6, Math.min(94, (num / maxValue) * 94));

  const setValueFromPointer = (clientY: number) => {
    const chart = chartRef.current;
    if (!chart || status !== "playing") return;
    const rect = chart.getBoundingClientRect();
    // full chart height as usable range
    const clampedY = Math.max(rect.top, Math.min(rect.bottom, clientY));
    const ratio = 1 - (clampedY - rect.top) / (rect.bottom - rect.top);
    const nextValue = Math.round(ratio * maxValue);
    setValue(Math.max(0, Math.min(99, nextValue)));
  };

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
    // capture on chartArea so drag works anywhere in chart
    event.currentTarget.setPointerCapture(event.pointerId);
    setValueFromPointer(event.clientY);
  };

  const dragMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setValueFromPointer(event.clientY);
  };

  const endDrag = () => setIsDragging(false);

  const nudge = (delta: number) => {
    if (status !== "playing") return;
    setValue((current) => Math.max(0, Math.min(99, current + delta)));
  };

  const checkAnswer = () => {
    if (status !== "playing") return;
    if (value === level.answer) {
      setStatus("correct");
      speakText(`Đúng rồi! Số cần điền là ${level.answer}.`);
      window.setTimeout(() => {
        setPrevAnswer(level.answer);
        setBestRound((b) => Math.max(b, round + 1));
        setRound((r) => r + 1);
      }, 3000);
    } else {
      setStatus("wrong");
      speakText("Chưa đúng.");
      window.setTimeout(() => {
        setGameOver(true);
      }, 900);
    }
  };

  const handleStart = () => {
    setAudioUnlocked(true);
  };

  const handleRestart = () => {
    setRound(0);
    setPrevAnswer(undefined);
    setValue(0);
    setStatus("playing");
    setGameOver(false);
    lastSpokenRound.current = -1;
  };

  const speak = () => {
    const seqText = level.sequence.map((x) => (x === null ? "ô trống" : x)).join(", ");
    speakText(`${level.instruction} ${seqText}`);
  };

  return (
    <main className={styles.app}>
      <section className={styles.modal}>
        {!audioUnlocked && (
          <div className={styles.startOverlay}>
            <div className={styles.gameOverBox}>
              <div className={styles.gameOverTitle}>📊 Kéo cột số</div>
              <ul className={styles.instructions}>
                <li>Quan sát dãy số và tìm quy luật</li>
                <li>Kéo cột lên hoặc xuống đến số đúng</li>
                <li>Độ khó tăng dần qua từng vòng</li>
              </ul>
              <button className={styles.startButton} onClick={handleStart}>
                ▶ Bắt đầu
              </button>
            </div>
          </div>
        )}

        {gameOver && (
          <div className={styles.startOverlay}>
            <div className={styles.gameOverBox}>
              <div className={styles.gameOverTitle}>Trò chơi kết thúc</div>
              <div className={styles.gameOverScore}>
                Vòng tốt nhất: <strong>{bestRound}</strong>
              </div>
              <button className={styles.startButton} onClick={handleRestart}>
                ↻ Chơi lại
              </button>
            </div>
          </div>
        )}

        <header className={styles.header}>
          <div>
            <h1>{level.title}</h1>
            <span>Vòng {round + 1}&nbsp;·&nbsp;⭐ {bestRound}</span>
          </div>
        </header>

        <div className={styles.board}>
          <div className={styles.texture} />
          <button className={styles.replayButton} onClick={handleRestart}>↻</button>

          <div
            className={styles.chartArea}
            ref={chartRef}
            onPointerDown={startDrag}
            onPointerMove={dragMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            {shownValues.map((num, index) => {
              const height = valueToHeight(num);
              const active = index === missingIndex;

              return (
                <div key={index} className={`${styles.columnGroup} ${active ? styles.activeGroup : ""}`}>
                  {!active && (
                    <div className={styles.numberLabel} style={{ bottom: `calc(${height}% + 18px)` }}>
                      {num}
                    </div>
                  )}

                  {active && (
                    <div className={styles.activeValueBadge} style={{ bottom: `calc(${height}% + 18px)` }}>
                      {num}
                    </div>
                  )}

                  <div
                    className={`${styles.column} ${active ? styles.activeColumn : ""} ${status === "wrong" && active ? styles.wrongColumn : ""}`}
                    style={{ height: `${height}%` }}
                  >
                    {active && <div className={styles.dragGrip}>↕</div>}
                  </div>

                  {active && (
                    <div className={styles.nudgeControls}>
                      <button onClick={() => nudge(-5)}>−</button>
                      <button onClick={() => nudge(5)}>+</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile slider for easier dragging */}
          <div className={styles.sliderRow}>
            <input
              type="range"
              min={0}
              max={99}
              value={value}
              onChange={(e) => status === "playing" && setValue(Number(e.target.value))}
              className={styles.slider}
            />
          </div>

          <footer className={styles.footer}>
            <div className={styles.footerLeft}>
              <button className={styles.audioButton} onClick={speak}>🔊</button>
              <div>
                <strong>{level.instruction}</strong>
                <span>{level.hint}</span>
              </div>
            </div>

            <button className={styles.doneButton} onClick={checkAnswer}>XONG</button>
          </footer>

          {status === "correct" && (
            <div className={`${styles.feedback} ${styles.correct}`}>
              <strong>Đúng rồi!</strong>
              <span>Số cần điền là {level.answer}.</span>
            </div>
          )}

          {status === "wrong" && (
            <div className={`${styles.feedback} ${styles.wrong}`}>
              <strong>Chưa đúng</strong>
              <span>Thử kéo cột đến số phù hợp với quy luật nhé.</span>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
