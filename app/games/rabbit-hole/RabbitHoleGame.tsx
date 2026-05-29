"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { generateLevel, getHolePositions } from "./data";
import { speakText, stopSpeaking } from "../../components/edu/utils/speech";
import styles from "./RabbitHoleGame.module.css";

type Position = { x: number; y: number };

const START_POSITION: Position = { x: 90, y: 340 };

export default function RabbitHoleGame() {
  const [round, setRound] = useState(0);
  const [bestRound, setBestRound] = useState(0);
  const [prevTarget, setPrevTarget] = useState<number | undefined>(undefined);
  const [rabbitPosition, setRabbitPosition] = useState<Position>(START_POSITION);
  const [isDragging, setIsDragging] = useState(false);
  const [message, setMessage] = useState("Kéo chú thỏ vào đúng hang nhé.");
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [gameOver, setGameOver] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const boardRef = useRef<HTMLDivElement | null>(null);
  const [sceneScale, setSceneScale] = useState(1);

  // Virtual scene size (positions tính theo 1000x500)
  const VW = 1000;
  const VH = 500;

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
  const positions = useMemo(() => getHolePositions(level.holeNumbers.length), [level.holeNumbers.length]);

  useEffect(() => {
    if (gameOver) return;
    setRabbitPosition(START_POSITION);
    setStatus("idle");
    setMessage(level.question);
    if (audioUnlocked) speakText(level.question, { lang: "vi-VN", rate: 0.95 });
  }, [round, level.question, audioUnlocked, gameOver]);

  useEffect(() => () => stopSpeaking(), []);

  const getClientPoint = (event: React.PointerEvent) => {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return START_POSITION;
    // Chuyển toạ độ pointer về toạ độ virtual stage (1000x500)
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
      x: Math.max(16, Math.min(next.x, 930)),
      y: Math.max(60, Math.min(next.y, 420)),
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    const board = boardRef.current;
    if (!board) return;

    const rabbitCenterX = rabbitPosition.x + 58;
    const rabbitCenterY = rabbitPosition.y + 58;
    const holeElements = Array.from(board.querySelectorAll<HTMLElement>("[data-hole]"));

    const matchedHole = holeElements.find((hole) => {
      const left = Number(hole.dataset.left);
      const top = Number(hole.dataset.top);
      const centerX = left + 72;
      const centerY = top + 56;
      const distance = Math.hypot(rabbitCenterX - centerX, rabbitCenterY - centerY);
      return distance < 95;
    });

    if (!matchedHole) {
      setRabbitPosition(START_POSITION);
      setMessage("Bạn thả hơi xa hang rồi. Thử kéo lại nhé.");
      return;
    }

    const selectedHole = Number(matchedHole.dataset.hole);

    if (selectedHole === level.targetHole) {
      setStatus("correct");
      setBestRound((b) => Math.max(b, round + 1));
      setRabbitPosition({
        x: Number(matchedHole.dataset.left) + 26,
        y: Number(matchedHole.dataset.top) - 42,
      });
      const msg = `Đúng rồi! Thỏ đã vào hang số ${level.targetHole}.`;
      setMessage(msg);
      speakText(msg, { lang: "vi-VN", rate: 0.95 });

      window.setTimeout(() => {
        setPrevTarget(level.targetHole);
        setRound((r) => r + 1);
      }, 1400);
    } else {
      setStatus("wrong");
      const msg = `Sai rồi! Đây là hang số ${selectedHole}, thỏ cần hang số ${level.targetHole}. Trò chơi kết thúc.`;
      setMessage(msg);
      speakText(msg, { lang: "vi-VN", rate: 0.95 });
      setGameOver(true);
    }
  };

  const resetLevel = () => {
    setRabbitPosition(START_POSITION);
    setStatus("idle");
    setMessage(level.question);
  };

  const speakQuestion = () => {
    speakText(level.question, { lang: "vi-VN", rate: 0.95 });
  };

  const handleStart = () => setAudioUnlocked(true);

  const handleRestart = () => {
    setRound(0);
    setPrevTarget(undefined);
    setStatus("idle");
    setRabbitPosition(START_POSITION);
    setGameOver(false);
  };

  return (
    <main className={styles.app}>
      <section className={styles.game}>
        {!audioUnlocked && (
          <div className={styles.startOverlay}>
            <button className={styles.startButton} onClick={handleStart}>
              ▶ Bắt đầu
            </button>
          </div>
        )}
        {gameOver && (
          <div className={styles.startOverlay}>
            <div className={styles.gameOverBox}>
              <div className={styles.gameOverTitle}>Trò chơi kết thúc</div>
              <div className={styles.gameOverScore}>
                Bạn đã đưa thỏ về đúng hang <strong>{bestRound}</strong> lần
              </div>
              <button className={styles.startButton} onClick={handleRestart}>
                ↻ Chơi lại
              </button>
            </div>
          </div>
        )}
        <div className={styles.scene} ref={boardRef}>
          <div
            className={styles.stage}
            style={{
              width: VW,
              height: VH,
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

          <div className={styles.treeLeft}><span /><span /><span /></div>
          <div className={styles.treeRight}><span /><span /><span /></div>
          <div className={styles.flowersBack} />

          <div className={styles.holesLayer}>
            {level.holeNumbers.map((holeNumber, index) => {
              const pos = positions[index];
              return (
                <button
                  key={`${level.id}-${holeNumber}-${index}`}
                  className={[
                    styles.hole,
                    status === "correct" && holeNumber === level.targetHole ? styles.correctHole : "",
                  ].join(" ")}
                  data-hole={holeNumber}
                  data-left={pos.left}
                  data-top={pos.top}
                  style={{ left: pos.left, top: pos.top }}
                  onClick={() => {
                    setMessage(`Đây là hang số ${holeNumber}. Hãy kéo thỏ vào hang đúng nhé.`);
                  }}
                >
                  <span className={styles.holeNumber}>{holeNumber}</span>
                  <span className={styles.holeShadow} />
                </button>
              );
            })}
          </div>

          <div className={styles.carrotPatch}><span /><span /><span /></div>

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
          </div>
          </div>

          <div className={styles.topHud}>
            <div className={styles.badge}>Lượt {round + 1}</div>
            <div className={styles.score}>⭐ {bestRound}</div>
          </div>

          <button className={styles.replayButton} onClick={resetLevel}>↻ Chơi lại</button>
        </div>

        <div className={styles.questionPanel}>
          <div className={styles.questionLeft}>
            <button className={styles.audioButton} onClick={speakQuestion}>🔊</button>
            <div>
              <h1>Thỏ vào hang</h1>
              <p>{message}</p>
            </div>
          </div>

          <div className={styles.targetBox}>
            <span>Hang cần tìm</span>
            <strong>{level.targetHole}</strong>
          </div>
        </div>
      </section>
    </main>
  );
}
