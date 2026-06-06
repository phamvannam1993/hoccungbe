"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2 } from "lucide-react";
import styles from "./TraceSentenceGame.module.css";
import { sentences } from "./data";

export default function TraceSentenceGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pathPointsRef = useRef<Array<{ x: number; y: number }>>([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Bé hãy tô theo nét chữ nhé!");
  const [isCompleted, setIsCompleted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);

  const currentSentence = sentences[currentIndex];

  const playAudio = (text: string) => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    // Using Google Translate TTS API for Vietnamese
    const encodedText = encodeURIComponent(text);
    audioRef.current.src = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=vi&client=tw-ob`;
    audioRef.current.play().catch(() => {});
  };

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    setupCanvas();

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setupCanvas();
      resetGame();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    resetGame();
    playAudio(currentSentence.text);
  }, [currentIndex]);

  const setupCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scale = window.devicePixelRatio || 1;

    canvas.width = rect.width * scale;
    canvas.height = rect.height * scale;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = isMobile ? 5 : 16;
    // Add shadow/glow for solid look
    ctx.shadowColor = "rgba(255, 107, 154, 0.4)";
    ctx.shadowBlur = isMobile ? 3 : 8;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.strokeStyle = "#ff6b9a";
  };

  const getPointerPosition = (
    event:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();

    if ("touches" in event) {
      const touch = event.touches[0] || event.changedTouches[0];

      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const drawSmoothCurve = (points: Array<{ x: number; y: number }>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || points.length < 2) return;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    if (points.length === 2) {
      ctx.lineTo(points[1].x, points[1].y);
    } else {
      for (let i = 1; i < points.length - 2; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }
      ctx.quadraticCurveTo(
        points[points.length - 2].x,
        points[points.length - 2].y,
        points[points.length - 1].x,
        points[points.length - 1].y
      );
    }
    ctx.stroke();
  };

  const startDrawing = (
    event:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    event.preventDefault();

    // Prevent multiple touch points
    if ('touches' in event && event.touches.length > 1) {
      return;
    }

    const { x, y } = getPointerPosition(event);
    pathPointsRef.current = [{ x, y }];

    setIsDrawing(true);
    if (progress === 0) {
      setMessage("Tốt lắm, bé tiếp tục tô nhé!");
    }
  };

  const updateCursorPreview = (x: number, y: number) => {
    setCursorPos({ x, y });
    if (cursorRef.current) {
      const brushSize = isMobile ? 5 : 16;
      cursorRef.current.style.left = `${x - brushSize / 2}px`;
      cursorRef.current.style.top = `${y - brushSize / 2}px`;
      cursorRef.current.style.width = `${brushSize}px`;
      cursorRef.current.style.height = `${brushSize}px`;
    }
  };

  const draw = (
    event:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    event.preventDefault();

    const { x, y } = getPointerPosition(event);
    updateCursorPreview(x, y);

    if (!isDrawing) return;

    pathPointsRef.current.push({ x, y });

    // Draw smooth curve every 3 points for performance
    if (pathPointsRef.current.length >= 3) {
      drawSmoothCurve(pathPointsRef.current);
      pathPointsRef.current = [pathPointsRef.current[pathPointsRef.current.length - 1]];
    }

    updateProgress();
  };

  const stopDrawing = () => {
    if (pathPointsRef.current.length > 1) {
      drawSmoothCurve(pathPointsRef.current);
    }
    pathPointsRef.current = [];
    setIsDrawing(false);
  };

  const updateProgress = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let paintedPixels = 0;

    for (let i = 3; i < data.length; i += 4) {
      if (data[i] > 0) {
        paintedPixels++;
      }
    }

    const estimatedTotal = Math.max(12000, currentSentence.text.length * 1850);

    const newProgress = Math.min(
      100,
      Math.round((paintedPixels / estimatedTotal) * 100)
    );

    setProgress(newProgress);

    if (newProgress >= 80 && !isCompleted) {
      setIsCompleted(true);
      const msg = `Giỏi quá! Bé đã tô xong câu: ${currentSentence.text}`;
      setMessage(msg);
      playAudio(msg);
    }
  };

  const resetGame = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    setProgress(0);
    setIsCompleted(false);
    setMessage("Bé hãy tô theo nét chữ nhé!");
  };

  const goToSentence = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPreviousSentence = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const goToNextSentence = () => {
    if (progress < 80) {
      setMessage("Bé tô thêm một chút nữa nhé!");
      return;
    }

    if (currentIndex < sentences.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      setMessage("Tuyệt vời! Bé đã hoàn thành tất cả các câu.");
    }
  };

  return (
    <main className={styles.page}>
      <audio ref={audioRef} crossOrigin="anonymous" />
      <section className={styles.card}>
        <div className={styles.header}>
          <div>
            <p className={styles.label}>Dạng game</p>
            <h1 className={styles.title}>Tô theo nét câu</h1>
          </div>

          <div className={styles.star}>🌟</div>
        </div>

        <div className={styles.topRow}>
          <div className={styles.lessonStatus}>
            Câu {currentIndex + 1}/{sentences.length}
          </div>

          <label className={styles.selectLabel}>
            Chọn câu:
            <select
              value={currentIndex}
              onChange={(event) => goToSentence(Number(event.target.value))}
              className={styles.select}
            >
              {sentences.map((sentence, index) => (
                <option key={sentence.id} value={index}>
                  {index + 1}. {sentence.text}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className={styles.instruction}>
          <div className={styles.instructionContent}>
            <p>{message}</p>
            <button
              onClick={() => playAudio(message)}
              className={styles.audioBtn}
              title="Nghe lại"
            >
              <Volume2 size={18} />
            </button>
          </div>
        </div>

        <div className={styles.sampleBox}>
          <span>Câu mẫu:</span>
          <strong>{currentSentence.text}</strong>
          <button
            onClick={() => playAudio(currentSentence.text)}
            className={styles.sampleAudioBtn}
            title="Nghe câu"
          >
            <Volume2 size={16} />
          </button>
        </div>

        <div className={styles.tracingArea}>
          <div className={styles.guideLineTop}></div>
          <div className={styles.guideLineMiddle}></div>
          <div className={styles.guideLineBottom}></div>

          <div
            className={`${styles.traceText} ${
              currentSentence.text.length > 12 ? styles.traceTextSmall : ""
            }`}
          >
            {currentSentence.text}
          </div>

          <div ref={cursorRef} className={styles.cursorPreview} />

          <canvas
            ref={canvasRef}
            className={styles.canvas}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>

        <div className={styles.progressBox}>
          <div className={styles.progressInfo}>
            <span>Tiến độ tô</span>
            <strong>{progress}%</strong>
          </div>

          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button className={styles.resetButton} onClick={resetGame}>
            Làm lại
          </button>

          <button
            className={styles.prevButton}
            onClick={goToPreviousSentence}
            disabled={currentIndex === 0}
          >
            Câu trước
          </button>

          <button className={styles.nextButton} onClick={goToNextSentence}>
            {currentIndex === sentences.length - 1
              ? "Hoàn thành"
              : "Câu tiếp theo"}
          </button>
        </div>

        {isCompleted && (
          <div className={styles.reward}>
            🎉 Giỏi quá! Bé đã tô xong câu này.
          </div>
        )}

        <div className={styles.sentenceList}>
          {sentences.map((sentence, index) => (
            <button
              key={sentence.id}
              className={`${styles.sentenceChip} ${
                index === currentIndex ? styles.sentenceChipActive : ""
              }`}
              onClick={() => goToSentence(index)}
            >
              {index + 1}. {sentence.text}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
