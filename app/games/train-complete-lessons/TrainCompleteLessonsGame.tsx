"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { generateTrainLevel, getTrainAnswer } from "./data";
import { speakText, stopSpeaking } from "../../components/edu/utils/speech";
import styles from "./TrainCompleteLessonsGame.module.css";

const VW = 1000;

export default function TrainCompleteLessonsGame() {
  const [round, setRound] = useState(0);
  const [bestRound, setBestRound] = useState(0);
  const [prevAnswerStr, setPrevAnswerStr] = useState<string | undefined>(undefined);
  const [replayKey, setReplayKey] = useState(0);
  const [phase, setPhase] = useState<"watch" | "answer" | "correct" | "wrong">("watch");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [pickedCars, setPickedCars] = useState<number[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  const lastSpokenRound = useRef(-1);
  const sceneRef = useRef<HTMLDivElement>(null);
  const [sceneScale, setSceneScale] = useState(1);

  useEffect(() => {
    const update = () => {
      const w = sceneRef.current?.clientWidth ?? VW;
      setSceneScale(w / VW);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const level = useMemo(() => generateTrainLevel(round, prevAnswerStr), [round, prevAnswerStr]);
  const answer = getTrainAnswer(level);

  const totalCars = useMemo(() => {
    if (level.skill === "add_carriages") return level.trainCars + (level.addCars ?? 0);
    if (level.skill === "make_train") return level.trainCars;
    return level.trainCars;
  }, [level]);

  useEffect(() => {
    if (gameOver) return;
    setPickedCars([]);
    setSelectedAnswer(null);
    setPhase("watch");
    if (audioUnlocked && lastSpokenRound.current !== round) {
      lastSpokenRound.current = round;
      speakText(level.question, { lang: "vi-VN", rate: 0.95 });
    }
    const timer = window.setTimeout(() => setPhase("answer"), 3300);
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

  const chooseAnswer = (value: string) => {
    if (phase !== "answer" || selectedAnswer !== null) return;
    if (level.skill === "make_train") return;
    setSelectedAnswer(value);

    if (value === answer) {
      setPhase("correct");
      speakText(`Đúng rồi! Đáp án là ${answer}.`, { lang: "vi-VN", rate: 0.95 });
      window.setTimeout(advanceRound, 2200);
    } else {
      setPhase("wrong");
      speakText("Chưa đúng.", { lang: "vi-VN", rate: 0.95 });
      setGameOver(true);
    }
  };

  const pickCar = (carId: number) => {
    if (phase !== "answer" || level.skill !== "make_train" || pickedCars.includes(carId)) return;
    const next = [...pickedCars, carId];
    setPickedCars(next);

    if (next.length === Number(answer)) {
      setPhase("correct");
      speakText(`Đúng rồi! Đáp án là ${answer}.`, { lang: "vi-VN", rate: 0.95 });
      window.setTimeout(advanceRound, 2200);
    } else if (next.length > Number(answer)) {
      setPhase("wrong");
      speakText("Chưa đúng.", { lang: "vi-VN", rate: 0.95 });
      setGameOver(true);
    }
  };

  const handleStart = () => {
    setAudioUnlocked(true);
  };

  const handleRestart = () => {
    setRound(0);
    setBestRound(0);
    setPrevAnswerStr(undefined);
    setReplayKey((k) => k + 1);
    setPickedCars([]);
    setSelectedAnswer(null);
    setPhase("watch");
    setGameOver(false);
    lastSpokenRound.current = -1;
  };

  const handleReplay = () => setReplayKey((k) => k + 1);

  const speakQuestion = () => speakText(level.question, { lang: "vi-VN", rate: 0.95 });

  const equation = (() => {
    if (level.skill === "add_carriages") return `${level.trainCars} + ${level.addCars} = ?`;
    if (level.skill === "remove_carriages") return `${level.trainCars} - ${level.removeCars} = ?`;
    if (level.skill === "passengers_add") return `${level.passengersOn} + ${level.passengersAdd} = ?`;
    if (level.skill === "passengers_subtract") return `${level.passengersOn} - ${level.passengersOff} = ?`;
    if (level.skill === "missing_number") {
      const seq = level.sequence ?? [];
      return seq.map((v) => (v === null ? "?" : String(v))).join("  ");
    }
    if (level.skill === "compare") return `${level.compareLeft} ? ${level.compareRight}`;
    if (level.skill === "make_train") return `${pickedCars.length} / ${answer}`;
    if (level.skill === "compose_number") return `${level.compareLeft} + ${level.compareRight} = ?`;
    if (level.skill === "decompose_number") return `${level.trainCars} = ${level.compareLeft} + ?`;
    if (level.skill === "ten_frame") return `${level.trainCars} + ? = ${level.target}`;
    if (level.skill === "even_odd") return `${level.trainCars} là ?`;
    if (level.skill === "ordinal") return `Toa thứ ${level.ordinalIndex}`;
    if (level.skill === "greater_less_symbol") return `${level.compareLeft} ? ${level.compareRight}`;
    if (level.skill === "skip_count") {
      const seq = level.sequence ?? [];
      return seq.map((v) => (v === null ? "?" : String(v))).join("  ");
    }
    if (level.skill === "number_order") {
      const seq = level.sequence ?? [];
      return seq.map(String).join("  ");
    }
    return String(level.trainCars);
  })();

  const message = (() => {
    if (phase === "correct") return `Đúng rồi! Đáp án là ${answer}.`;
    if (phase === "wrong") return "Chưa đúng rồi, bé hãy quan sát lại đoàn tàu nhé.";
    if (phase === "answer") {
      if (level.skill === "make_train") return `Hãy bấm chọn toa tàu: ${pickedCars.length}/${answer} toa.`;
      return "Bây giờ hãy chọn đáp án đúng.";
    }
    if (level.skill === "add_carriages") return `${level.trainCars} toa đang chạy, thêm ${level.addCars} toa được nối vào.`;
    if (level.skill === "remove_carriages") return `${level.trainCars} toa đang chạy, ${level.removeCars} toa được tách ra.`;
    if (level.skill === "passengers_add") return `${level.passengersOn} hành khách trên tàu, thêm ${level.passengersAdd} người lên.`;
    if (level.skill === "passengers_subtract") return `${level.passengersOn} hành khách trên tàu, ${level.passengersOff} người xuống.`;
    if (level.skill === "number_order") return "Quan sát số trên các toa tàu.";
    if (level.skill === "missing_number") return "Tìm toa số còn thiếu trong đoàn tàu.";
    if (level.skill === "compare") return `Quan sát cả hai đoàn tàu: tàu xanh có ${level.compareLeft} toa, tàu đỏ có ${level.compareRight} toa.`;
    if (level.skill === "make_train") return `Bé cần chọn đúng ${answer} toa tàu.`;
    if (level.skill === "compose_number") return `Gộp ${level.compareLeft} toa và ${level.compareRight} toa.`;
    if (level.skill === "decompose_number") return `Tách ${level.trainCars} toa thành ${level.compareLeft} toa và một phần còn thiếu.`;
    if (level.skill === "ten_frame") return `Đoàn tàu cần đủ ${level.target} toa.`;
    if (level.skill === "even_odd") return "Quan sát các toa được ghép thành từng cặp.";
    if (level.skill === "ordinal") return `Tìm toa đứng ở vị trí thứ ${level.ordinalIndex}.`;
    if (level.skill === "greater_less_symbol") return `So sánh ${level.compareLeft} và ${level.compareRight}, chọn dấu đúng.`;
    if (level.skill === "skip_count") return "Đếm cách đều trên các toa tàu.";
    return "Hãy quan sát và đếm số toa tàu.";
  })();

  const carNumbers = level.sequence ?? Array.from({ length: totalCars }, (_, i) => i + 1);

  const renderMiniTrain = (count: number, variant: "blue" | "red", label: string) => (
    <div className={`${styles.fullCompareTrain} ${variant === "blue" ? styles.fullBlueTrain : styles.fullRedTrain}`}>
      <div className={styles.compareLabel}>{label}: {count} toa</div>
      <div className={styles.compareEngine}>
        <span className={styles.compareChimney} />
        <span className={styles.compareWindow} />
        <span className={styles.compareWheelOne} />
        <span className={styles.compareWheelTwo} />
      </div>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={styles.compareCar}>
          <strong>{index + 1}</strong>
          <span />
          <i />
          <b />
        </div>
      ))}
    </div>
  );

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
                Bạn đã trả lời đúng <strong>{bestRound}</strong> câu
              </div>
              <button className={styles.startButton} onClick={handleRestart}>
                ↻ Chơi lại
              </button>
            </div>
          </div>
        )}

        <div className={styles.scene} ref={sceneRef}>
          <div
            className={styles.stage}
            style={{ width: VW, height: 500, transform: `scale(${sceneScale})`, transformOrigin: "top left" }}
            key={round + "-" + replayKey}
          >
            <div className={styles.sun} />
            <div className={`${styles.cloud} ${styles.cloudOne}`} />
            <div className={`${styles.cloud} ${styles.cloudTwo}`} />
            <div className={styles.farHills} />
            <div className={styles.city}><span /><span /><span /><span /><span /></div>
            <div className={styles.ground} />
            <div className={styles.track}><span /><span /></div>

            {level.skill === "compare" || level.skill === "greater_less_symbol" ? (
              <div className={styles.fullCompareWrap}>
                {renderMiniTrain(level.compareLeft ?? 0, "blue", "Tàu xanh")}
                {renderMiniTrain(level.compareRight ?? 0, "red", "Tàu đỏ")}
              </div>
            ) : level.skill === "compose_number" || level.skill === "decompose_number" ? (
              <div className={styles.compareWrapSimple}>
                <div className={styles.compareTrainTop}>
                  {Array.from({ length: level.compareLeft ?? level.trainCars }).map((_, index) => (
                    <div key={index} className={`${styles.smallCar} ${styles.blueCar}`}>{index + 1}</div>
                  ))}
                </div>
                <div className={styles.compareTrainBottom}>
                  {Array.from({ length: level.compareRight ?? 0 }).map((_, index) => (
                    <div key={index} className={`${styles.smallCar} ${styles.redCar}`}>{index + 1}</div>
                  ))}
                </div>
              </div>
            ) : (
              <div className={styles.train}>
                <div className={styles.engine}>
                  <div className={styles.chimney} />
                  <div className={styles.window} />
                  <div className={styles.cowcatcher} />
                  <span className={styles.wheelOne} />
                  <span className={styles.wheelTwo} />
                </div>

                {Array.from({ length: totalCars }).map((_, index) => {
                  const isNew = level.skill === "add_carriages" && index >= level.trainCars;
                  const isRemoved = level.skill === "remove_carriages" && index >= level.trainCars - (level.removeCars ?? 0);
                  const picked = pickedCars.includes(index + 1);
                  const pairMark = level.skill === "even_odd" ? index % 2 === 0 : false;
                  const ordinalMark = level.skill === "ordinal" && index + 1 === level.ordinalIndex;
                  const label = carNumbers[index] === null ? "?" : carNumbers[index] ?? index + 1;

                  return (
                    <button
                      key={index}
                      className={[
                        styles.car,
                        isNew ? styles.newCar : "",
                        isRemoved ? styles.removedCar : "",
                        picked ? styles.pickedCar : "",
                        pairMark ? styles.pairCar : "",
                        ordinalMark ? styles.ordinalCar : "",
                      ].join(" ")}
                      onClick={() => pickCar(index + 1)}
                    >
                      <span className={styles.carNumber}>{label}</span>
                      <span className={styles.carWindow} />
                      <span className={styles.carWheelOne} />
                      <span className={styles.carWheelTwo} />
                    </button>
                  );
                })}
              </div>
            )}

            {(level.skill === "passengers_add" || level.skill === "passengers_subtract") && (
              <div className={styles.passengers}>
                {Array.from({ length: level.passengersOn ?? 0 }).map((_, index) => (
                  <span
                    key={index}
                    className={level.skill === "passengers_subtract" && index >= (level.passengersOn ?? 0) - (level.passengersOff ?? 0) ? styles.offPassenger : ""}
                  >
                    🙂
                  </span>
                ))}
                {level.skill === "passengers_add" && Array.from({ length: level.passengersAdd ?? 0 }).map((_, index) => (
                  <span key={`new-${index}`} className={styles.newPassenger}>🙂</span>
                ))}
              </div>
            )}

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
          </div>{/* end .stage */}
        </div>

        <div className={styles.questionPanel}>
          <div className={styles.questionLeft}>
            <button className={styles.audioButton} onClick={speakQuestion}>🔊</button>
            <div>
              <h1>Đoàn tàu toán học</h1>
              <p>{level.question}</p>
            </div>
          </div>

          {level.skill === "make_train" ? (
            <div className={styles.pickHint}>Bấm trực tiếp vào các toa tàu</div>
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
