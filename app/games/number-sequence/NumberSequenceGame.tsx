"use client";

import { useEffect, useMemo, useState } from "react";
import { generateSequenceLevel, keypadValues } from "./data";
import { speakText, stopSpeaking } from "../../components/edu/utils/speech";
import styles from "./NumberSequenceGame.module.css";

export default function NumberSequenceGame() {
  const [round, setRound] = useState(0);
  const [bestRound, setBestRound] = useState(0);
  const [prevAnswer, setPrevAnswer] = useState<string | undefined>(undefined);
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"answer" | "correct" | "wrong">("answer");
  const [gameOver, setGameOver] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  const level = useMemo(() => generateSequenceLevel(round, prevAnswer), [round, prevAnswer]);

  useEffect(() => {
    setValue("");
    setStatus("answer");
    if (audioUnlocked && !gameOver) {
      const timer = window.setTimeout(() => {
        const seqText = level.sequence.map((x) => (x === null ? "ô trống" : x)).join(", ");
        speakText(`${level.instruction}. ${seqText}`);
      }, 800);
      return () => window.clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, audioUnlocked]);

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  const press = (n: string) => {
    if (status !== "answer" || value.length >= 3) return;
    setValue((v) => v + n);
  };

  const check = () => {
    if (!value || status !== "answer") return;
    if (value === level.answer) {
      setStatus("correct");
      speakText(`Đúng rồi! ${level.answer} là số còn thiếu.`);
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
    setValue("");
    setStatus("answer");
    setGameOver(false);
  };

  const speak = () => {
    const seqText = level.sequence.map((x) => (x === null ? "ô trống" : x)).join(", ");
    speakText(`${level.instruction}. ${seqText}`);
  };

  const progress = (round / (round + 10)) * 100;

  return (
    <main className={styles.app}>
      <section className={styles.modal}>
        {!audioUnlocked && (
          <div className={styles.startOverlay}>
            <div className={styles.gameOverBox}>
              <div className={styles.gameOverTitle}>🔢 Dãy số</div>
              <ul className={styles.instructions}>
                <li>Quan sát dãy số và tìm quy luật</li>
                <li>Điền số còn thiếu vào ô trống</li>
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
            <h1>Dãy số</h1>
            <span>Vòng {round + 1} &nbsp;·&nbsp; ⭐ {bestRound}</span>
          </div>
        </header>

        <div className={styles.gameWrap}>
          <div className={styles.game}>
            <div className={styles.snow}>
              {Array.from({ length: 42 }).map((_, i) => (
                <i key={i} style={{ left: `${(i * 11) % 100}%`, animationDelay: `${-(i % 12) * 0.45}s`, animationDuration: `${5 + (i % 7)}s` }} />
              ))}
            </div>
            <div className={styles.mountains}><span /><span /><span /></div>
            <div className={styles.trees}>{Array.from({ length: 10 }).map((_, i) => <span key={i} />)}</div>

            <div className={styles.left}>
              <div className={styles.instruction}>
                <h2>{level.instruction}</h2>
                <p>Quan sát quy luật rồi nhập số còn thiếu vào ô trống.</p>
              </div>

              <div className={`${styles.sequence} ${status === "wrong" ? styles.shake : ""}`}>
                {level.sequence.map((item, index) => (
                  <div key={index} className={styles.item}>
                    {item === null ? (
                      <span className={`${styles.blank} ${status === "correct" ? styles.ok : ""} ${status === "wrong" ? styles.bad : ""}`}>
                        {value}{!value && <em />}
                      </span>
                    ) : (
                      <strong>{item}</strong>
                    )}
                    {index < level.sequence.length - 1 && <b>,</b>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar outside scene */}
          <div className={styles.bottom}>
            <button className={styles.sound} onClick={speak}>🔊</button>
            <div className={styles.progress}>
              <div><span style={{ width: `${progress}%` }} /></div>
              <small>Vòng {round + 1} &nbsp;·&nbsp; ⭐ {bestRound}</small>
            </div>
            <button className={`${styles.check} ${value ? styles.active : ""}`} onClick={check} disabled={!value}>✓</button>
          </div>
        </div>

        <aside className={styles.panel}>
          <div className={styles.keypad}>
            {keypadValues.map((n) => (
              <button key={n} onClick={() => press(n)}>{n}</button>
            ))}
          </div>
          <button className={styles.back} onClick={() => setValue((v) => v.slice(0, -1))}>⌫</button>
        </aside>

        {status === "correct" && (
          <div className={styles.correctBox}>
            <strong>Đúng rồi!</strong>
            <span>{level.answer} là số còn thiếu.</span>
          </div>
        )}
        {status === "wrong" && (
          <div className={styles.wrongBox}>
            <strong>Chưa đúng</strong>
            <span>Hãy nhìn lại quy luật của dãy số nhé.</span>
          </div>
        )}
      </section>
    </main>
  );
}
