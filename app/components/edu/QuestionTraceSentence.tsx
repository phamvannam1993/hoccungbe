'use client';

import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import styles from './QuestionTraceSentence.module.css';

interface QuestionTraceSentenceProps {
  sentence: string;
  instruction?: string;
  onScoreReady?: (score: number) => void;
}

export interface QuestionTraceSentenceRef {
  getScore: () => number;
}

const QuestionTraceSentence = forwardRef<QuestionTraceSentenceRef, QuestionTraceSentenceProps>(
  function QuestionTraceSentence({ sentence, instruction, onScoreReady }, ref) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const cursorRef = useRef<HTMLDivElement | null>(null);
    const pathPointsRef = useRef<Array<{ x: number; y: number }>>([]);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [isDrawing, setIsDrawing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);

    useImperativeHandle(ref, () => ({
      getScore: () => progress,
    }), [progress]);

    useEffect(() => {
      setIsMobile(window.innerWidth <= 768);
      setupCanvas();

      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
        setupCanvas();
      };

      window.addEventListener('resize', handleResize);
      playAudio(sentence);

      return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
      resetCanvas();
      playAudio(sentence);
    }, [sentence]);

    const playAudio = (text: string) => {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      const encodedText = encodeURIComponent(text);
      audioRef.current.src = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=vi&client=tw-ob`;
      audioRef.current.play().catch(() => {});
    };

    const setupCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const scale = window.devicePixelRatio || 1;

      canvas.width = rect.width * scale;
      canvas.height = rect.height * scale;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = isMobile ? 5 : 16;
      ctx.shadowColor = 'rgba(255, 107, 154, 0.4)';
      ctx.shadowBlur = isMobile ? 3 : 8;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.strokeStyle = '#ff6b9a';
    };

    const getPointerPosition = (
      event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
    ) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };

      const rect = canvas.getBoundingClientRect();

      if ('touches' in event) {
        const touch = event.touches[0] || event.changedTouches[0];
        return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
      }

      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    const drawSmoothCurve = (points: Array<{ x: number; y: number }>) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
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

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      if ('touches' in e && (e as React.TouchEvent<HTMLCanvasElement>).touches.length > 1) return;

      const { x, y } = getPointerPosition(e);
      pathPointsRef.current = [{ x, y }];
      setIsDrawing(true);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault();

      const { x, y } = getPointerPosition(e);
      updateCursorPreview(x, y);

      if (!isDrawing) return;

      pathPointsRef.current.push({ x, y });

      if (pathPointsRef.current.length >= 3) {
        drawSmoothCurve(pathPointsRef.current);
        pathPointsRef.current = [pathPointsRef.current[pathPointsRef.current.length - 1]];
      }

      updateProgress();
    };

    const handleMouseUp = () => {
      if (pathPointsRef.current.length > 1) {
        drawSmoothCurve(pathPointsRef.current);
      }
      pathPointsRef.current = [];
      setIsDrawing(false);
    };

    const updateProgress = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');

      if (!canvas || !ctx) return;

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let paintedPixels = 0;
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] > 0) paintedPixels++;
      }

      const estimatedTotal = Math.max(12000, sentence.length * 1850);
      const newProgress = Math.min(100, Math.round((paintedPixels / estimatedTotal) * 100));

      setProgress(newProgress);
      if (onScoreReady) onScoreReady(newProgress);
    };

    const resetCanvas = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');

      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      pathPointsRef.current = [];
      setProgress(0);
    };

    return (
      <div className={styles.container}>
        <audio ref={audioRef} crossOrigin="anonymous" />

        {instruction && <p className={styles.instruction}>{instruction}</p>}

        <div className={styles.tracingArea}>
          <div className={styles.guideLineTop}></div>
          <div className={styles.guideLineMiddle}></div>
          <div className={styles.guideLineBottom}></div>

          <div
            className={`${styles.traceText} ${sentence.length > 12 ? styles.traceTextSmall : ''}`}
          >
            {sentence}
          </div>

          <div ref={cursorRef} className={styles.cursorPreview} />

          <canvas
            ref={canvasRef}
            className={styles.canvas}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
          />
        </div>

        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
        <p className={styles.progressText}>{progress}%</p>

        <button onClick={resetCanvas} className={styles.resetButton}>
          Làm lại
        </button>
      </div>
    );
  }
);

QuestionTraceSentence.displayName = 'QuestionTraceSentence';
export default QuestionTraceSentence;
