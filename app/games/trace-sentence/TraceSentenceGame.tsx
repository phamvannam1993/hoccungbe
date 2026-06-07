"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, Pen } from "lucide-react";
import styles from "./TraceSentenceGame.module.css";
import { sentences } from "./data";

type BrushSize = 'small' | 'medium' | 'large';

const BRUSH_SIZES: Record<BrushSize, { mobile: number; desktop: number }> = {
  small: { mobile: 2, desktop: 5 },
  medium: { mobile: 4, desktop: 10 },
  large: { mobile: 6, desktop: 16 },
};

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
  const [brushSize, setBrushSize] = useState<BrushSize>('medium');
  const [showPenGuide, setShowPenGuide] = useState(false);

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

  useEffect(() => {
    setupCanvas();
  }, [brushSize, isMobile]);

  const getBrushWidth = () => {
    const sizes = BRUSH_SIZES[brushSize];
    return isMobile ? sizes.mobile : sizes.desktop;
  };

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
    ctx.lineWidth = getBrushWidth();
    // Enhanced brush appearance - multiple layers for pen-like effect
    ctx.shadowColor = "rgba(255, 107, 154, 0.5)";
    ctx.shadowBlur = isMobile ? 4 : 12;
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
      const size = getBrushWidth();
      // Position the brush tip center
      cursorRef.current.style.left = `${x - size / 2}px`;
      cursorRef.current.style.top = `${y - size / 2}px`;
      cursorRef.current.style.width = `${size}px`;
      cursorRef.current.style.height = `${size}px`;
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

        <div className={styles.brushToolbox}>
          <div className={styles.brushLabel}>
            <Pen size={16} /> Cái bút:
          </div>
          <div className={styles.brushOptions}>
            {(['small', 'medium', 'large'] as const).map((size) => (
              <button
                key={size}
                onClick={() => setBrushSize(size)}
                className={`${styles.brushBtn} ${brushSize === size ? styles.brushBtnActive : ''}`}
                title={size === 'small' ? 'Bút nhỏ' : size === 'medium' ? 'Bút vừa' : 'Bút to'}
              >
                <div
                  className={styles.brushPreview}
                  style={{
                    width: BRUSH_SIZES[size][isMobile ? 'mobile' : 'desktop'] * 1.5,
                    height: BRUSH_SIZES[size][isMobile ? 'mobile' : 'desktop'] * 1.5,
                  }}
                />
                <span>{size === 'small' ? 'Nhỏ' : size === 'medium' ? 'Vừa' : 'To'}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.brushDemoArea}>
          <span className={styles.demoLabel}>Bút của bé:</span>
          <div className={styles.demoPad}>
            <svg viewBox="0 0 140 140" className={styles.demoSvg}>
              {/* Hand - thumb */}
              <path d="M 20 60 Q 15 50 18 35 Q 20 30 25 32 Q 22 45 28 65 Z" fill="#f5d5b8" stroke="#d4a574" strokeWidth="0.5" />

              {/* Hand - fingers (holding pen) */}
              <ellipse cx="35" cy="75" rx="6" ry="16" fill="#f5d5b8" stroke="#d4a574" strokeWidth="0.5" />
              <ellipse cx="45" cy="70" rx="6" ry="18" fill="#f5d5b8" stroke="#d4a574" strokeWidth="0.5" />

              {/* Hand palm */}
              <ellipse cx="32" cy="85" rx="16" ry="18" fill="#f5d5b8" stroke="#d4a574" strokeWidth="0.5" />

              {/* Pen rotated at angle */}
              <g transform="translate(50, 40) rotate(25)">
                {/* Eraser cap (blue) */}
                <ellipse cx="0" cy="-15" rx="8" ry="6" fill="#6b7fd8" />
                <rect x="-6" y="-15" width="12" height="10" fill="#6b7fd8" rx="1" />

                {/* Pen barrel (wood color) */}
                <path d="M -5 -5 L -6 35 Q -6 40 -2 42 L 2 42 Q 6 40 6 35 L 5 -5 Z" fill="#d4a76a" stroke="#c49850" strokeWidth="0.8" />

                {/* Ferrule (cream/beige) */}
                <rect x="-5" y="35" width="10" height="7" fill="#f5e6d3" />

                {/* Brush tip */}
                <path d="M -4 42 L -5 52 Q -5 55 0 58 Q 5 55 5 52 L 4 42 Z" fill="#ff6b9a" />
                <ellipse cx="0" cy="58" rx="3" ry="2" fill="#cc5a7a" opacity="0.6" />

                {/* Highlight */}
                <ellipse cx="-3" cy="15" rx="1" ry="10" fill="#f0d999" opacity="0.4" />
              </g>

              {/* Wrist */}
              <ellipse cx="30" cy="105" rx="14" ry="12" fill="#f5d5b8" stroke="#d4a574" strokeWidth="0.5" />
            </svg>
          </div>
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

          {cursorPos && (
            <svg
              className={styles.penCursor}
              viewBox="0 0 100 160"
              style={{
                left: `${cursorPos.x - 70}px`,
                top: `${cursorPos.y - 194}px`,
                transform: 'rotate(30deg)',
                transformOrigin: '70px 194px',
              }}
            >
              {/* Eraser cap (blue) */}
              <ellipse cx="50" cy="20" rx="16" ry="12" fill="#6b7fd8" />
              <rect x="34" y="20" width="32" height="18" fill="#6b7fd8" rx="3" />

              {/* Pen barrel (wood color) */}
              <path d="M 40 38 L 36 110 Q 36 120 44 125 L 56 125 Q 64 120 64 110 L 60 38 Z" fill="#d4a76a" stroke="#c49850" strokeWidth="1.5" />

              {/* Ferrule (cream/beige) */}
              <rect x="40" y="110" width="20" height="15" fill="#f5e6d3" />

              {/* Brush tip (pink) */}
              <path d="M 40 125 L 38 145 Q 38 152 50 158 Q 62 152 62 145 L 60 125 Z" fill="#ff6b9a" />
              <ellipse cx="50" cy="158" rx="6" ry="4" fill="#cc5a7a" opacity="0.7" />

              {/* Highlight on barrel */}
              <ellipse cx="43" cy="70" rx="3" ry="25" fill="#f0d999" opacity="0.5" />

              {/* Hand - thumb */}
              <path d="M 25 85 Q 18 75 22 55 Q 25 48 32 52 Q 28 70 36 95 Z" fill="#f5d5b8" stroke="#d4a574" strokeWidth="1" opacity="0.8" />

              {/* Hand - fingers */}
              <ellipse cx="28" cy="100" rx="8" ry="20" fill="#f5d5b8" stroke="#d4a574" strokeWidth="1" opacity="0.8" />
              <ellipse cx="20" cy="95" rx="7" ry="22" fill="#f5d5b8" stroke="#d4a574" strokeWidth="1" opacity="0.8" />

              {/* Hand palm */}
              <ellipse cx="30" cy="115" rx="18" ry="22" fill="#f5d5b8" stroke="#d4a574" strokeWidth="1" opacity="0.8" />
            </svg>
          )}

          <canvas
            ref={canvasRef}
            className={styles.canvas}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={() => { stopDrawing(); setShowPenGuide(false); }}
            onMouseEnter={() => setShowPenGuide(true)}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            onTouchCancel={() => { stopDrawing(); setShowPenGuide(false); }}
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
