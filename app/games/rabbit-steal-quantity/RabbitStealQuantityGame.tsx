"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { generateLevel, allCarrotPositions } from "./data";
import { speakText, stopSpeaking } from "../../components/edu/utils/speech";
import styles from "./RabbitStealQuantityGame.module.css";

type Position = { x: number; y: number };

const START_POSITION: Position = { x: 72, y: 332 };

const VW = 1000;

export default function RabbitStealQuantityGame() {
  const [round, setRound] = useState(0);
  const [bestRound, setBestRound] = useState(0);
  const [prevTarget, setPrevTarget] = useState<number | undefined>(undefined);
  const [rabbitPosition, setRabbitPosition] = useState<Position>(START_POSITION);
  const [isDragging, setIsDragging] = useState(false);
  const [collectedIds, setCollectedIds] = useState<number[]>([]);
  const [message, setMessage] = useState("Kéo thỏ đi cắp từng củ cà rốt nhé.");
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [carrying, setCarrying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [sceneScale, setSceneScale] = useState(1);
  const boardRef = useRef<HTMLDivElement | null>(null);   // scene container
  const stageRef = useRef<HTMLDivElement | null>(null);   // virtual 1000×500 stage
  const lastSpokenRound = useRef<number>(-1);

  useEffect(() => {
    const update = () => {
      const w = boardRef.current?.clientWidth ?? VW;
      setSceneScale(w / VW);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const level = useMemo(() => generateLevel(round, prevTarget), [round, prevTarget]);

  useEffect(() => {
    if (gameOver) return;
    setRabbitPosition(START_POSITION);
    setCollectedIds([]);
    setStatus("idle");
    setCarrying(false);
    setMessage(level.question);
    if (audioUnlocked && lastSpokenRound.current !== round) {
      lastSpokenRound.current = round;
      speakText(level.question, { lang: "vi-VN", rate: 0.95 });
    }
  }, [round, level.question, audioUnlocked, gameOver]);

  useEffect(() => () => stopSpeaking(), []);

  const getClientPoint = (event: React.PointerEvent): Position => {
    // Dùng scene container (không bị transform) để lấy offset chuẩn
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return START_POSITION;
    return {
      x: (event.clientX - rect.left) / sceneScale - 58,
      y: (event.clientY - rect.top) / sceneScale - 58,
    };
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (gameOver) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
    setStatus("idle");
    setMessage(level.hint);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const next = getClientPoint(event);
    setRabbitPosition({
      x: Math.max(16, Math.min(next.x, 1070)),
      y: Math.max(72, Math.min(next.y, 430)),
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    const board = boardRef.current;
    if (!board) return;

    const rabbitCenterX = rabbitPosition.x + 58;
    const rabbitCenterY = rabbitPosition.y + 58;

    const carrotElements = Array.from(board.querySelectorAll<HTMLElement>("[data-carrot]"));

    const matchedCarrot = carrotElements.find((carrot) => {
      const carrotId = Number(carrot.dataset.carrot);
      if (collectedIds.includes(carrotId)) return false;
      const left = Number(carrot.dataset.left);
      const top = Number(carrot.dataset.top);
      const centerX = left + 44;
      const centerY = top + 58;
      const distance = Math.hypot(rabbitCenterX - centerX, rabbitCenterY - centerY);
      return distance < 82;
    });

    if (!matchedCarrot) {
      setRabbitPosition(START_POSITION);
      setCarrying(false);
      setMessage("Thỏ chưa cắp được củ nào. Hãy kéo thỏ chạm vào một củ cà rốt.");
      return;
    }

    const carrotId = Number(matchedCarrot.dataset.carrot);
    const nextCollected = [...collectedIds, carrotId];

    setCollectedIds(nextCollected);
    setCarrying(true);
    setRabbitPosition(START_POSITION);

    if (nextCollected.length < level.targetCount) {
      setMessage(`Thỏ đã cắp ${nextCollected.length} củ. Cần cắp thêm ${level.targetCount - nextCollected.length} củ nữa.`);
    } else {
      setMessage(`Đủ ${level.targetCount} củ rồi! Bấm "Kiểm tra" để hoàn thành.`);
    }

    window.setTimeout(() => {
      setCarrying(false);
    }, 600);
  };

  const checkAnswer = () => {
    if (collectedIds.length === level.targetCount) {
      setStatus("correct");
      setBestRound((b) => Math.max(b, round + 1));
      const msg = `Đúng rồi! Thỏ đã cắp đúng ${level.targetCount} củ cà rốt.`;
      setMessage(msg);
      speakText(msg, { lang: "vi-VN", rate: 0.95 });

      window.setTimeout(() => {
        setPrevTarget(level.targetCount);
        setRound((r) => r + 1);
      }, 2200);
    } else {
      setStatus("wrong");
      let msg: string;
      if (collectedIds.length < level.targetCount) {
        msg = `Chưa đủ rồi. Thỏ mới cắp ${collectedIds.length}/${level.targetCount} củ. Trò chơi kết thúc.`;
      } else {
        msg = `Bị thừa rồi. Thỏ đã cắp ${collectedIds.length}, chỉ cần ${level.targetCount} củ. Trò chơi kết thúc.`;
      }
      setMessage(msg);
      speakText(msg, { lang: "vi-VN", rate: 0.95 });
      setGameOver(true);
    }
  };

  const resetLevel = () => {
    setRabbitPosition(START_POSITION);
    setCollectedIds([]);
    setStatus("idle");
    setCarrying(false);
    setMessage(level.question);
  };

  const speakQuestion = () => {
    speakText(level.question, { lang: "vi-VN", rate: 0.95 });
  };

  const handleStart = () => {
    setAudioUnlocked(true);
    lastSpokenRound.current = round;
    const guide =
      "Kéo chú thỏ chạm vào từng củ cà rốt để cắp. Cắp đủ số lượng yêu cầu rồi bấm kiểm tra. Nếu sai, trò chơi sẽ kết thúc.";
    speakText(`${guide} ${level.question}`, { lang: "vi-VN", rate: 0.95 });
  };

  const handleRestart = () => {
    setRound(0);
    setPrevTarget(undefined);
    setStatus("idle");
    setRabbitPosition(START_POSITION);
    setCollectedIds([]);
    setCarrying(false);
    setGameOver(false);
    lastSpokenRound.current = -1;
  };

  const visibleCarrots = allCarrotPositions.slice(0, level.carrotCount);

  return (
    <main className={styles.app}>
      <section className={styles.game}>
        <div className={styles.scene} ref={boardRef}>
        {!audioUnlocked && (
          <div className={styles.startOverlay}>
            <div className={styles.gameOverBox}>
              <div className={styles.gameOverTitle}>🥕 Thỏ cắp cà rốt</div>
              <ul className={styles.instructions}>
                <li>👀 Nhìn số củ cà rốt cần cắp ở <strong>khung bên phải</strong>.</li>
                <li>🐰 Kéo chú thỏ chạm vào từng củ để cắp.</li>
                <li>✅ Cắp đủ → bấm <strong>Kiểm tra</strong> để sang vòng mới.</li>
                <li>❌ Sai số lượng → kết thúc, bấm <strong>Chơi lại</strong>.</li>
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
                Thỏ đã cắp đúng <strong>{bestRound}</strong> vòng
              </div>
              <button className={styles.startButton} onClick={handleRestart}>
                ↻ Chơi lại
              </button>
            </div>
          </div>
        )}
          <div
            className={styles.stage}
            ref={stageRef}
            style={{
              width: VW,
              height: 500,
              transform: `scale(${sceneScale})`,
              transformOrigin: "top left",
            }}
          >
            <div className={styles.skyGlow} />
            <div className={styles.sun} />
            <div className={`${styles.cloud} ${styles.cloudOne}`} />
            <div className={`${styles.cloud} ${styles.cloudTwo}`} />

            <div className={styles.farHills} />
            <div className={styles.nearHill} />

            <div className={styles.fence}>
              {Array.from({ length: 15 }).map((_, index) => <span key={index} />)}
            </div>

            <div className={styles.treeLeft}><span /><span /><span /></div>
            <div className={styles.treeRight}><span /><span /><span /></div>

            <div className={styles.gardenRows}><span /><span /><span /></div>

            <div className={styles.carrotsLayer}>
              {visibleCarrots.map((carrot) => {
                const isCollected = collectedIds.includes(carrot.id);
                return (
                  <button
                    key={`${level.id}-${carrot.id}`}
                    className={[
                      styles.carrotTarget,
                      isCollected ? styles.collectedCarrot : "",
                    ].join(" ")}
                    data-carrot={carrot.id}
                    data-left={carrot.left}
                    data-top={carrot.top}
                    style={{ left: carrot.left, top: carrot.top }}
                    onClick={() => {
                      setMessage(isCollected ? "Củ này đã bị thỏ cắp rồi." : "Hãy kéo thỏ chạm vào củ này để cắp.");
                    }}
                  >
                    <span className={styles.leaves}><i /><i /><i /></span>
                    <span className={styles.carrotBody} />
                  </button>
                );
              })}
            </div>

            <div className={styles.basket}>
              <span className={styles.basketTitle}>Giỏ thỏ</span>
              <strong>{collectedIds.length}</strong>
              <span>/ {level.targetCount} củ</span>
              <div className={styles.miniCarrots}>
                {Array.from({ length: Math.min(level.targetCount, 12) }).map((_, index) => (
                  <i key={index} className={index < collectedIds.length ? styles.filledMini : ""} />
                ))}
              </div>
            </div>

            <div
              className={[
                styles.rabbit,
                isDragging ? styles.draggingRabbit : "",
                status === "correct" ? styles.happyRabbit : "",
                status === "wrong" ? styles.wrongRabbit : "",
              ].join(" ")}
              style={{ transform: `translate(${rabbitPosition.x}px, ${rabbitPosition.y}px)` }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            >
              <div className={styles.earBack} />
              <div className={styles.earFront} />
              <div className={styles.rabbitBody} />
              <div className={styles.rabbitHead} />
              <div className={styles.eye} />
              <div className={styles.nose} />
              <div className={styles.cheek} />
              <div className={styles.tail} />
              <div className={styles.footOne} />
              <div className={styles.footTwo} />
              {carrying && (
                <div className={styles.carriedCarrot}>
                  <span />
                </div>
              )}
            </div>

            <div className={styles.topHud}>
              <div className={styles.badge}>Vòng {round + 1}</div>
              <div className={styles.score}>⭐ {bestRound}</div>
            </div>

            <div className={styles.sceneActions}>
              <button className={styles.checkButton} onClick={checkAnswer}>✓ Kiểm tra</button>
              <button className={styles.replayButton} onClick={resetLevel}>↻ Chơi lại</button>
            </div>
          </div>
        </div>{/* end .scene */}

        <div className={styles.questionPanel}>
          <div className={styles.questionLeft}>
            <button className={styles.audioButton} onClick={speakQuestion}>🔊</button>
            <div>
              <h1>Thỏ cắp cà rốt</h1>
              <p>{message}</p>
            </div>
          </div>

          <div className={styles.targetBox}>
            <span>Cần cắp</span>
            <strong>{level.targetCount}</strong>
            <small>củ cà rốt</small>
          </div>
        </div>
      </section>
    </main>
  );
}
