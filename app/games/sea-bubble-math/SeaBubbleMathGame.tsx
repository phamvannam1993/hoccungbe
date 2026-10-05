"use client";

import { useEffect, useMemo, useState } from "react";
import { speakText, stopSpeaking } from "@/app/components/edu/utils/speech";
import { generateQuestion } from "./data";
import styles from "./SeaBubbleMathGame.module.css";

type Status = "idle" | "playing" | "correct" | "wrong" | "done";

export default function SeaBubbleMathGame() {
  const [questionNumber, setQuestionNumber] = useState(0);
  const [displayedQuestionNumber, setDisplayedQuestionNumber] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<"correct" | "wrong" | null>(null);
  const [wantToStop, setWantToStop] = useState(false);

  const level = useMemo(() => generateQuestion(displayedQuestionNumber, streak), [displayedQuestionNumber, streak]);
  const progress = useMemo(() => Math.min((displayedQuestionNumber / 10) * 100, 100), [displayedQuestionNumber]);

  useEffect(() => {
    if (status === "playing") {
      setTimeout(() => playSpeech(), 300);
    }
  }, [displayedQuestionNumber, status]);

  const playSpeech = () => {
    const text = `${level.left} ${level.op === "+" ? "cộng" : "trừ"} ${level.right} bằng bao nhiêu?`;
    speakText(text);
  };

  const handleChoice = (choice: number) => {
    if (status !== "playing") return;

    setSelected(choice);
    if (choice === level.answer) {
      setStatus("correct");
      setScore((s) => s + 1);
      const newStreak = streak + 1;
      setNotificationType("correct");
      setShowNotification(true);
      speakText("Giỏi quá! Trả lời đúng rồi!");
      setTimeout(() => {
        stopSpeaking();
        setShowNotification(false);
        setTimeout(() => {
          setDisplayedQuestionNumber((q) => q + 1);
          setSelected(null);
          setStatus("playing");
          setStreak(newStreak);
        }, 2000);
      }, 3000);
    } else {
      setStatus("wrong");
      setStreak(0); // Reset streak on wrong answer
      setNotificationType("wrong");
      setShowNotification(true);
      speakText("Thử lại nhé! Chưa đúng, cố gắng thêm!");
      setTimeout(() => {
        stopSpeaking();
        setShowNotification(false);
      }, 3000);
      setTimeout(() => {
        setSelected(null);
        setStatus("playing");
      }, 3200);
    }
  };

  const start = () => {
    setDisplayedQuestionNumber(0);
    setSelected(null);
    setStatus("playing");
    setScore(0);
    setStreak(0);
    setWantToStop(false);
    setTimeout(() => playSpeech(), 100);
  };

  const restart = () => {
    setDisplayedQuestionNumber(0);
    setSelected(null);
    setStatus("playing");
    setScore(0);
    setStreak(0);
    setWantToStop(false);
    setTimeout(() => playSpeech(), 100);
  };

  const goHome = () => {
    setDisplayedQuestionNumber(0);
    setSelected(null);
    setStatus("idle");
    setScore(0);
    setStreak(0);
    setWantToStop(false);
  };

  const stopGame = () => {
    setStatus("done");
  };

  const isFinished = status === "done";
  const isIdle = status === "idle";

  return (
    <main className={styles.app}>
      <div className={styles.modal}>
        <header className={styles.header}>
          <div>
            <h1>Toán bong bóng biển</h1>
            <p>Tính nhẩm thật nhanh cùng đại dương nhé.</p>
          </div>
          <button className={styles.closeButton} onClick={goHome}>×</button>
        </header>

        <section className={styles.board}>
          <div className={`${styles.fish} ${styles.fishOne}`}>🐟</div>
          <div className={`${styles.fish} ${styles.fishTwo}`}>🐠</div>
          <div className={`${styles.fish} ${styles.fishThree}`}>🐡</div>
          <div className={`${styles.fish} ${styles.fishFour}`}>🐟</div>

          {showNotification && (
            <div className={`${styles.notification} ${styles[notificationType!]}`}>
              {notificationType === "correct" ? (
                <>
                  <div className={styles.notificationEmoji}>🎉</div>
                  <div className={styles.notificationText}>Giỏi quá!</div>
                  <div className={styles.notificationSubtext}>Trả lời đúng rồi!</div>
                </>
              ) : (
                <>
                  <div className={styles.notificationEmoji}>💪</div>
                  <div className={styles.notificationText}>Thử lại nhé!</div>
                  <div className={styles.notificationSubtext}>Chưa đúng, cố gắng thêm!</div>
                </>
              )}
            </div>
          )}

          {!isIdle && (
            <div className={styles.topBar}>
              <div className={styles.levelBadge}>
                <div>Câu {displayedQuestionNumber + 1}</div>
                <div className={styles.streak}>{streak > 0 ? `🔥 ${streak}` : "Đúng: " + score}</div>
              </div>
              <div className={styles.progressWrap}>
                <div className={styles.progressBar} style={{ width: `${progress}%` }} />
              </div>
              <button className={styles.audioButton} onClick={playSpeech}>🔊</button>
            </div>
          )}

          {isIdle ? (
            <div className={styles.startScreen}>
              <span className={styles.startEmoji}>🫧</span>
              <h2>Bóng Biển - Toán</h2>
              <p>Chơi game toán học vui vẻ với bóng biển!</p>
              <p className={styles.rules}>Trả lời càng nhiều câu hỏi càng tốt. Cấp độ sẽ tăng dần!</p>
              <button className={styles.startButton} onClick={start}>Bắt đầu</button>
            </div>
          ) : !isFinished ? (
            <div className={styles.gameContent}>
              <div className={styles.questionArea}>
                <div className={styles.bubble}>{level.left}</div>
                <div className={styles.operator}>{level.op}</div>
                <div className={styles.bubble}>{level.right}</div>
                <div className={styles.operator}>=</div>
                <div className={`${styles.bubble} ${styles.answerBubble}`}>
                  {selected !== null && status === "correct" ? level.answer : "?"}
                </div>
              </div>

              <div className={styles.feedbackLine}>
                {status === "playing" && <span>Chọn đáp án đúng ở phía dưới.</span>}
                {status === "correct" && <span className={styles.correctText}>Giỏi quá! Con trả lời đúng rồi.</span>}
                {status === "wrong" && <span className={styles.wrongText}>Chưa đúng, thử lại nhé.</span>}
              </div>

              <div className={styles.choices}>
                {level.choices.map((choice) => {
                  const isSelected = selected === choice;
                  const correct = choice === level.answer && status === "correct";
                  const wrong = isSelected && status === "wrong";

                  return (
                    <button
                      key={choice}
                      className={`${styles.choiceButton} ${isSelected ? styles.selectedChoice : ""} ${correct ? styles.correctChoice : ""} ${wrong ? styles.wrongChoice : ""}`}
                      onClick={() => handleChoice(choice)}
                      disabled={status !== "playing"}
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>

              <button className={styles.stopButton} onClick={stopGame}>
                ⏹️ Dừng chơi
              </button>
            </div>
          ) : (
            <div className={styles.resultBox}>
              <div className={styles.resultEmoji}>🏆</div>
              <h2>Kết quả!</h2>
              <p>Con trả lời đúng <strong className={styles.scoreHighlight}>{score}</strong> / {displayedQuestionNumber} câu</p>
              <p className={styles.accuracy}>Độ chính xác: <strong>{displayedQuestionNumber > 0 ? Math.round((score / displayedQuestionNumber) * 100) : 0}%</strong></p>
              <p className={styles.difficulty}>Cấp độ: <strong>Level {Math.floor(displayedQuestionNumber / 5)}</strong></p>
              <div className={styles.resultButtons}>
                <button className={styles.playAgainButton} onClick={restart}>Chơi lại</button>
                <button className={styles.homeButton} onClick={goHome}>Trang chủ</button>
              </div>
            </div>
          )}

          <div className={styles.seaFloor}>
            <span className={styles.coralLeft}>🐙</span>
            <span className={styles.coralMid}>🦀</span>
            <span className={styles.coralRight}>🐚</span>
          </div>
        </section>
      </div>
    </main>
  );
}
