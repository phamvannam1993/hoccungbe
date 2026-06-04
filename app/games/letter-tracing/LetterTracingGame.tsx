'use client';

import React, { PointerEvent, useEffect, useMemo, useRef, useState } from 'react';
import styles from './letterTracing.module.css';
import { TRACE_LETTERS, TraceLetter } from './letters';
import { speakText } from '@/app/components/edu/utils/speech';

type Point = { x: number; y: number };

const SVG_W = 600;
const SVG_H = 520;
const HIT_RADIUS = 36;
const SAMPLE_STEP = 7;

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function canvasPointFromSvg(point: Point, rect: DOMRect): Point {
  return {
    x: (point.x / SVG_W) * rect.width,
    y: (point.y / SVG_H) * rect.height,
  };
}

export default function LetterTracingGame() {
  const title = 'Bé tập viết chữ';
  const letters: TraceLetter[] = TRACE_LETTERS;
  const [letterIndex, setLetterIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('Tô theo nét mờ để hoàn thành chữ nhé!');
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDemoing, setIsDemoing] = useState(false);
  const [pencilPoint, setPencilPoint] = useState<Point | null>(null);
  const [pencilAngle, setPencilAngle] = useState(-22);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const demoCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const boardRef = useRef<HTMLDivElement | null>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const samplePointsRef = useRef<Point[]>([]);
  const coveredRef = useRef<Set<number>>(new Set());
  const goodRef = useRef(0);
  const totalRef = useRef(0);
  const lastPointRef = useRef<Point | null>(null);
  const animationRef = useRef<number | null>(null);

  const currentLetter = letters[letterIndex] ?? letters[0];

  const progressText = useMemo(() => {
    if (score >= 90) return 'Rất tốt! Bé viết rất sát nét.';
    if (score >= 70) return 'Tốt rồi! Bé tô thêm các đoạn còn thiếu nhé.';
    if (score > 0) return 'Đang luyện tốt, hãy đi chậm và bám vào nét mờ.';
    return message;
  }, [message, score]);

  function setupCanvas(canvas: HTMLCanvasElement | null, color: string, widthScale = 0.032) {
    const board = boardRef.current;
    if (!canvas || !board) return;

    const rect = board.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(rect.height * ratio);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = Math.max(15, rect.width * widthScale);
    ctx.strokeStyle = color;
  }

  function resizeCanvas() {
    setupCanvas(demoCanvasRef.current, 'rgba(37, 99, 235, 0.36)', 0.026);
    setupCanvas(canvasRef.current, '#ef7c43', 0.032);
  }

  function clearCanvas(canvas = canvasRef.current) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function stopDemo() {
    if (animationRef.current) {
      window.cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setIsDemoing(false);
    setPencilPoint(null);
  }

  function rebuildSamples() {
    const points: Point[] = [];

    pathRefs.current.forEach((path) => {
      if (!path) return;
      const length = path.getTotalLength();
      for (let d = 0; d <= length; d += SAMPLE_STEP) {
        const p = path.getPointAtLength(d);
        points.push({ x: p.x, y: p.y });
      }
    });

    samplePointsRef.current = points;
    coveredRef.current = new Set();
    goodRef.current = 0;
    totalRef.current = 0;
    lastPointRef.current = null;
    setScore(0);
    setMessage('Tô theo nét mờ để hoàn thành chữ nhé!');
    clearCanvas(canvasRef.current);
    clearCanvas(demoCanvasRef.current);
    setPencilPoint(null);
  }

  useEffect(() => {
    stopDemo();
    pathRefs.current = [];
    resizeCanvas();
    const t = window.setTimeout(rebuildSamples, 80);
    window.addEventListener('resize', resizeCanvas);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('resize', resizeCanvas);
      stopDemo();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [letterIndex]);

  useEffect(() => {
    const timer = setTimeout(() => {
      speakText(currentLetter.speak);
    }, 300);
    return () => clearTimeout(timer);
  }, [letterIndex, currentLetter.speak]);

  function getSvgPoint(event: PointerEvent<HTMLCanvasElement>): Point {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * SVG_W,
      y: ((event.clientY - rect.top) / rect.height) * SVG_H,
    };
  }

  function getCanvasPoint(svgPoint: Point): Point {
    const canvas = canvasRef.current!;
    return canvasPointFromSvg(svgPoint, canvas.getBoundingClientRect());
  }

  function nearestDistance(point: Point) {
    const samples = samplePointsRef.current;
    let best = Infinity;
    let bestIndex = -1;

    for (let i = 0; i < samples.length; i += 1) {
      const d = distance(point, samples[i]);
      if (d < best) {
        best = d;
        bestIndex = i;
      }
    }
    return { best, bestIndex };
  }

  function updateCoverage(point: Point) {
    const samples = samplePointsRef.current;
    const { best, bestIndex } = nearestDistance(point);
    totalRef.current += 1;

    if (best <= HIT_RADIUS) {
      goodRef.current += 1;
      const coverRange = 5;
      for (let i = bestIndex - coverRange; i <= bestIndex + coverRange; i += 1) {
        if (i >= 0 && i < samples.length) coveredRef.current.add(i);
      }
    }

    const accuracy = totalRef.current ? goodRef.current / totalRef.current : 0;
    const coverage = samples.length ? coveredRef.current.size / samples.length : 0;
    const nextScore = Math.round(clamp((accuracy * 0.44 + coverage * 0.56) * 100, 0, 100));
    setScore(nextScore);

    if (nextScore >= 90) setMessage('Hoàn thành rất đẹp!');
    else if (best > HIT_RADIUS) setMessage('Đi chậm lại và bám sát nét mờ hơn nhé.');
    else setMessage('Tốt rồi, tô tiếp cho đủ nét nhé!');
  }

  function drawTo(point: Point) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const canvasPoint = getCanvasPoint(point);
    const last = lastPointRef.current ? getCanvasPoint(lastPointRef.current) : canvasPoint;
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(canvasPoint.x, canvasPoint.y);
    ctx.stroke();

    if (lastPointRef.current) {
      const dx = point.x - lastPointRef.current.x;
      const dy = point.y - lastPointRef.current.y;
      if (Math.abs(dx) + Math.abs(dy) > 0.5) setPencilAngle((Math.atan2(dy, dx) * 180) / Math.PI + 68);
    }

    lastPointRef.current = point;
    setPencilPoint(point);
    updateCoverage(point);
  }

  function handlePointerDown(event: PointerEvent<HTMLCanvasElement>) {
    if (isDemoing) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDrawing(true);
    const point = getSvgPoint(event);
    lastPointRef.current = point;
    drawTo(point);
  }

  function handlePointerMove(event: PointerEvent<HTMLCanvasElement>) {
    if (!isDrawing || isDemoing) return;
    drawTo(getSvgPoint(event));
  }

  function stopDrawing(event: PointerEvent<HTMLCanvasElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setIsDrawing(false);
    lastPointRef.current = null;
    window.setTimeout(() => setPencilPoint(null), 180);
  }

  function reset() {
    stopDemo();
    coveredRef.current = new Set();
    goodRef.current = 0;
    totalRef.current = 0;
    lastPointRef.current = null;
    setScore(0);
    setMessage('Tô theo nét mờ để hoàn thành chữ nhé!');
    clearCanvas(canvasRef.current);
    clearCanvas(demoCanvasRef.current);
    setPencilPoint(null);
  }

  function nextLetter() {
    stopDemo();
    setLetterIndex((value) => (value + 1) % letters.length);
  }

  function speak() {
    speakText(currentLetter.speak);
  }

  function playGuide() {
    stopDemo();
    clearCanvas(demoCanvasRef.current);
    setIsDemoing(true);
    setMessage('Nhìn bút mẫu chạy theo đúng thứ tự nét nhé!');

    const canvas = demoCanvasRef.current;
    const board = boardRef.current;
    if (!canvas || !board) return;

    const ctx = canvas.getContext('2d');
    const rect = board.getBoundingClientRect();
    if (!ctx) return;

    let pathIndex = 0;
    let lastCanvasPoint: Point | null = null;
    let lastSvgPoint: Point | null = null;
    const speed = 6.2;
    let distanceOnPath = 0;

    const drawFrame = () => {
      const path = pathRefs.current[pathIndex];
      if (!path) {
        setIsDemoing(false);
        setPencilPoint(null);
        return;
      }

      const length = path.getTotalLength();
      distanceOnPath += speed;
      const svgRaw = path.getPointAtLength(Math.min(distanceOnPath, length));
      const svgPoint = { x: svgRaw.x, y: svgRaw.y };
      const canvasPoint = canvasPointFromSvg(svgPoint, rect);

      if (!lastCanvasPoint || distanceOnPath <= speed + 0.5) {
        lastCanvasPoint = canvasPoint;
        lastSvgPoint = svgPoint;
      }

      ctx.beginPath();
      ctx.moveTo(lastCanvasPoint.x, lastCanvasPoint.y);
      ctx.lineTo(canvasPoint.x, canvasPoint.y);
      ctx.stroke();

      if (lastSvgPoint) {
        const dx = svgPoint.x - lastSvgPoint.x;
        const dy = svgPoint.y - lastSvgPoint.y;
        if (Math.abs(dx) + Math.abs(dy) > 0.5) setPencilAngle((Math.atan2(dy, dx) * 180) / Math.PI + 68);
      }

      lastCanvasPoint = canvasPoint;
      lastSvgPoint = svgPoint;
      setPencilPoint(svgPoint);

      if (distanceOnPath >= length) {
        pathIndex += 1;
        distanceOnPath = 0;
        lastCanvasPoint = null;
        lastSvgPoint = null;
      }

      if (pathIndex < currentLetter.paths.length) {
        animationRef.current = window.requestAnimationFrame(drawFrame);
      } else {
        animationRef.current = null;
        setIsDemoing(false);
        window.setTimeout(() => setPencilPoint(null), 320);
        setMessage('Đến lượt bé tô lại theo nét mờ nhé!');
      }
    };

    animationRef.current = window.requestAnimationFrame(drawFrame);
  }

  return (
    <section className={styles.module}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Game luyện viết</p>
          <h2>{title}</h2>
        </div>
        <div className={styles.scoreBox}>
          <span>{score}</span>
          <small>điểm</small>
        </div>
      </div>

      <div className={styles.letterList} aria-label="Chọn chữ">
        {letters.map((item, index) => (
          <button
            type="button"
            key={item.key}
            className={index === letterIndex ? styles.activeLetter : ''}
            onClick={() => setLetterIndex(index)}
            disabled={isDemoing}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className={styles.boardWrap}>
        <div className={styles.board} ref={boardRef}>
          <div className={styles.grid} />

          <svg className={styles.svgLayer} viewBox={`0 0 ${SVG_W} ${SVG_H}`} aria-hidden="true">
            {currentLetter.paths.map((path, index) => (
              <path
                key={`${currentLetter.key}-${index}`}
                ref={(node) => {
                  pathRefs.current[index] = node;
                }}
                d={path}
                className={styles.tracePath}
                style={{ strokeWidth: currentLetter.strokeWidths?.[index] ?? undefined }}
              />
            ))}
          </svg>

          <canvas ref={demoCanvasRef} className={styles.demoCanvas} aria-hidden="true" />

          <canvas
            ref={canvasRef}
            className={styles.canvas}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={stopDrawing}
            onPointerCancel={stopDrawing}
            aria-label={`Bảng tô ${currentLetter.speak}`}
          />

          <div
            className={`${styles.pencil} ${pencilPoint ? styles.pencilVisible : ''}`}
            style={
              pencilPoint
                ? {
                    left: `${(pencilPoint.x / SVG_W) * 100}%`,
                    top: `${(pencilPoint.y / SVG_H) * 100}%`,
                    transform: `translate(-50%, -86%) rotate(${pencilAngle}deg)`,
                  }
                : undefined
            }
            aria-hidden="true"
          >
            <div className={styles.pencilEraser} />
            <div className={styles.pencilBody} />
            <div className={styles.pencilTip} />
          </div>
        </div>
      </div>

      <div className={styles.status}>
        <div className={styles.progressTrack}>
          <div className={styles.progressBar} style={{ width: `${score}%` }} />
        </div>
        <p>{progressText}</p>
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={speak}>Nghe chữ</button>
        <button type="button" onClick={playGuide} disabled={isDemoing}>Xem bút mẫu</button>
        <button type="button" onClick={reset}>Làm lại</button>
        <button type="button" onClick={nextLetter} disabled={isDemoing}>Chữ tiếp theo</button>
      </div>
    </section>
  );
}
