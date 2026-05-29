"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { generateLevel, getAnswer } from "./data";
import { speakText, stopSpeaking } from "../../components/edu/utils/speech";
import styles from "./ApplePickingCompleteGame.module.css";

const appleSlots = [
  { x: 360, y: 142 }, { x: 455, y: 104 }, { x: 555, y: 142 },
  { x: 650, y: 112 }, { x: 740, y: 160 }, { x: 405, y: 225 },
  { x: 520, y: 232 }, { x: 625, y: 230 }, { x: 715, y: 252 },
  { x: 485, y: 315 }, { x: 600, y: 325 }, { x: 760, y: 335 },
];

export default function ApplePickingCompleteGame() {
  const [round, setRound] = useState(0);
  const [bestRound, setBestRound] = useState(0);
  const [prevAnswerStr, setPrevAnswerStr] = useState<string | undefined>(undefined);
  const [replayKey, setReplayKey] = useState(0);
  const [phase, setPhase] = useState<"watch" | "answer" | "correct" | "wrong">("watch");
  const [pickedIds, setPickedIds] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  const lastSpokenRound = useRef(-1);

  const level = useMemo(() => generateLevel(round, prevAnswerStr), [round, prevAnswerStr]);
  const answer = getAnswer(level);

  const apples = useMemo(() => {
    const addCount = level.addApples ?? 0;
    const allCount = level.skill === "addition" ? level.totalApples + addCount : level.totalApples;
    return Array.from({ length: allCount }, (_, index) => ({
      id: index + 1,
      x: appleSlots[index % appleSlots.length].x,
      y: appleSlots[index % appleSlots.length].y,
      isNew: level.skill === "addition" && index >= level.totalApples,
      autoPicked: level.skill === "subtraction" && index >= level.totalApples - (level.pickApples ?? 0),
      leftGroup: (level.skill === "compare" || level.skill === "number_bond")
        ? index < (level.compareLeft ?? 0)
        : false,
      rightGroup: (level.skill === "compare" || level.skill === "number_bond")
        ? index >= (level.compareLeft ?? 0) && index < (level.compareLeft ?? 0) + (level.compareRight ?? 0)
        : false,
    }));
  }, [level]);

  useEffect(() => {
    if (gameOver) return;
    setPickedIds([]);
    setSelectedAnswer(null);
    setPhase("watch");
    const timer = window.setTimeout(() => {
      setPhase("answer");
      if (audioUnlocked) {
        speakText(level.question, { lang: "vi-VN", rate: 0.95 });
        lastSpokenRound.current = round;
      }
    }, 3400);
    return () => window.clearTimeout(timer);
  }, [round, replayKey, audioUnlocked, gameOver]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  const advanceRound = () => {
    setPrevAnswerStr(answer);
    setRound((r) => r + 1);
    setReplayKey((k) => k + 1);
    setBestRound((b) => Math.max(b, round + 1));
  };

  const clickApple = (id: number) => {
    const canPick = level.skill === "pick" || level.skill === "make_number";
    if (!canPick || phase !== "answer" || pickedIds.includes(id)) return;

    const nextPicked = [...pickedIds, id];
    setPickedIds(nextPicked);

    if (nextPicked.length === Number(answer)) {
      setPhase("correct");
      const msg = `Đúng rồi! Đáp án là ${answer}.`;
      speakText(msg, { lang: "vi-VN", rate: 0.95 });
      window.setTimeout(advanceRound, 2200);
    } else if (nextPicked.length > Number(answer)) {
      setPhase("wrong");
      speakText("Chưa đúng.", { lang: "vi-VN", rate: 0.95 });
      setGameOver(true);
    }
  };

  const chooseAnswer = (value: string) => {
    if (phase !== "answer" || selectedAnswer !== null) return;
    const isPickingLevel = level.skill === "pick" || level.skill === "make_number";
    if (isPickingLevel) return;

    setSelectedAnswer(value);

    if (value === answer) {
      setPhase("correct");
      const msg = `Đúng rồi! Đáp án là ${answer}.`;
      speakText(msg, { lang: "vi-VN", rate: 0.95 });
      window.setTimeout(advanceRound, 2200);
    } else {
      setPhase("wrong");
      speakText("Chưa đúng. Trò chơi kết thúc.", { lang: "vi-VN", rate: 0.95 });
      setGameOver(true);
    }
  };

  const handleStart = () => {
    setAudioUnlocked(true);
    lastSpokenRound.current = round;
    speakText(level.question, { lang: "vi-VN", rate: 0.95 });
  };

  const handleRestart = () => {
    setRound(0);
    setBestRound(0);
    setPrevAnswerStr(undefined);
    setReplayKey((k) => k + 1);
    setPickedIds([]);
    setSelectedAnswer(null);
    setPhase("watch");
    setGameOver(false);
    lastSpokenRound.current = -1;
  };

  const handleReplay = () => setReplayKey((k) => k + 1);

  const speakQuestion = () => speakText(level.question, { lang: "vi-VN", rate: 0.95 });

  const equation = (() => {
    if (level.skill === "addition") return `${level.totalApples} + ${level.addApples} = ?`;
    if (level.skill === "subtraction") return `${level.totalApples} - ${level.pickApples} = ?`;
    if (level.skill === "pick" || level.skill === "make_number") return `${pickedIds.length} / ${answer}`;
    if (level.skill === "compare") return `${level.compareLeft} ? ${level.compareRight}`;
    if (level.skill === "number_bond") return `${level.compareLeft} + ${level.compareRight} = ?`;
    if (level.skill === "missing_addend") return `${level.knownPart} + ? = ${level.missingTotal}`;
    if (level.skill === "before_after") return `${level.beforeAfterNumber} → ?`;
    if (level.skill === "ten_frame") return `${level.totalApples} + ? = 10`;
    return `${level.totalApples}`;
  })();

  const message = (() => {
    if (phase === "correct") return `Đúng rồi! Đáp án là ${answer}.`;
    if (phase === "wrong") return "Chưa đúng rồi, bé hãy quan sát và thử lại nhé.";
    if (phase === "answer") {
      if (level.skill === "pick" || level.skill === "make_number") return `Hãy bấm vào táo để hái: ${pickedIds.length}/${answer} quả.`;
      return "Bây giờ hãy chọn đáp án đúng.";
    }
    if (level.skill === "addition") return `${level.totalApples} quả táo trên cây, thêm ${level.addApples} quả mới xuất hiện.`;
    if (level.skill === "subtraction") return `${level.totalApples} quả táo trên cây, ${level.pickApples} quả được hái xuống.`;
    if (level.skill === "compare") return `Nhóm trái có ${level.compareLeft} quả, nhóm phải có ${level.compareRight} quả.`;
    if (level.skill === "number_bond") return `Tách số thành ${level.compareLeft} quả và ${level.compareRight} quả.`;
    if (level.skill === "missing_addend") return `Đã có ${level.knownPart} quả, cần đủ ${level.missingTotal} quả.`;
    if (level.skill === "before_after") return `Hãy tìm số đứng sau ${level.beforeAfterNumber}.`;
    if (level.skill === "ten_frame") return "Quan sát khung 10 và tìm số còn thiếu.";
    return "Hãy quan sát và đếm số táo trên cây.";
  })();

  const basketCount = level.skill === "pick" || level.skill === "make_number"
    ? pickedIds.length
    : level.skill === "subtraction"
      ? level.pickApples ?? 0
      : 0;

  return (
    <main className={styles.app}>
      <section className={styles.game}>
        <div className={styles.scene}>
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
                  Bạn đã trả lời đúng <strong>{bestRound}</strong> câu
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
          <div className={styles.nearGround} />

          <div className={styles.tree}>
            <div className={styles.trunk} />
            <div className={styles.branchOne} />
            <div className={styles.branchTwo} />
            <div className={styles.crown}><span /><span /><span /><span /><span /></div>
          </div>

          {(level.skill === "ten_frame" || level.skill === "missing_addend") && (
            <div className={styles.tenFrame}>
              {Array.from({ length: 10 }).map((_, index) => (
                <span key={index} className={index < (level.skill === "missing_addend" ? (level.knownPart ?? 0) : level.totalApples) ? styles.filledCell : ""} />
              ))}
            </div>
          )}

          <div className={styles.applesLayer} key={round + '-' + replayKey}>
            {apples.map((apple) => (
              <button
                key={apple.id}
                className={[
                  styles.apple,
                  apple.isNew ? styles.newApple : "",
                  apple.autoPicked ? styles.autoPickedApple : "",
                  pickedIds.includes(apple.id) ? styles.pickedApple : "",
                  apple.leftGroup ? styles.leftApple : "",
                  apple.rightGroup ? styles.rightApple : "",
                ].join(" ")}
                style={{ left: apple.x, top: apple.y }}
                onClick={() => clickApple(apple.id)}
              >
                <span className={styles.leaf} />
              </button>
            ))}
          </div>

          <div className={styles.basket}>
            <span>Giỏ táo</span>
            <strong>{basketCount}</strong>
            <small>{level.skill === "pick" || level.skill === "make_number" ? `/ ${answer} quả` : "quả đã hái"}</small>
          </div>

          <div className={styles.topHud}>
            <div className={styles.badge}>Vòng {round + 1}</div>
            <div className={styles.score}>⭐ {bestRound}</div>
          </div>

          <div className={styles.lessonTag}>{level.title}</div>
          <div className={[styles.message, styles[phase]].join(" ")}>{message}</div>
          <div className={styles.equationBox}>{equation}</div>

          <div className={styles.sceneActions}>
            <button onClick={handleReplay}>↻ Xem lại</button>
          </div>
        </div>

        <div className={styles.questionPanel}>
          <div className={styles.questionLeft}>
            <button className={styles.audioButton} onClick={speakQuestion}>🔊</button>
            <div>
              <h1>Hái táo</h1>
              <p>{level.question}</p>
            </div>
          </div>

          {level.skill === "pick" || level.skill === "make_number" ? (
            <div className={styles.pickHint}>Bấm trực tiếp vào quả táo trên cây</div>
          ) : (
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
          )}
        </div>
      </section>
    </main>
  );
}
