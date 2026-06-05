'use client';

import React, { PointerEvent, useEffect, useMemo, useRef, useState } from 'react';
import styles from './letterTracing.module.css';
import { TRACE_LETTERS, TraceLetter } from './letters';
import { speakText } from '@/app/components/edu/utils/speech';

type Point = { x: number; y: number };
type ArrowInfo = { d: string; x: number; y: number };

const SVG_W = 600;
const SVG_H = 520;
const HIT_RADIUS = 22;
const SAMPLE_STEP = 7;
const COMPLETE_COVERAGE = 0.62;
const DEFAULT_STROKE_WIDTH = 16;

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function getFirstMovePoint(path: string): Point {
  const match = path.match(/M\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/i);
  if (!match) return { x: 60, y: 60 };

  return {
    x: Number(match[1]),
    y: Number(match[2]),
  };
}

function makeEmptyPaths(total: number) {
  return Array.from({ length: total }, () => '');
}

export default function LetterTracingGame() {
  const title = 'Bé tập viết chữ';
  const letters: TraceLetter[] = TRACE_LETTERS;

  const [letterIndex, setLetterIndex] = useState(0);
  const [activeStrokeIndex, setActiveStrokeIndex] = useState(0);
  const [drawnPaths, setDrawnPaths] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('Kéo đầu bút theo nét số 1 nhé!');
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDemoing, setIsDemoing] = useState(false);
  const [pencilPoint, setPencilPoint] = useState<Point | null>(null);
  const [pencilAngle, setPencilAngle] = useState(35);
  const [arrowInfos, setArrowInfos] = useState<ArrowInfo[]>([]);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const samplePointsRef = useRef<Point[]>([]);
  const coveredRef = useRef<Set<number>>(new Set());
  const goodRef = useRef(0);
  const totalRef = useRef(0);
  const lastPointRef = useRef<Point | null>(null);
  const activeDrawPathRef = useRef('');
  const animationRef = useRef<number | null>(null);

  const currentLetter = letters[letterIndex] ?? letters[0];
  const strokeTotal = currentLetter.paths.length;
  const isComplete = activeStrokeIndex >= strokeTotal;

  const progressText = useMemo(() => {
    if (isComplete) return 'Hoàn thành rồi! Bé viết rất đẹp.';
    if (score >= 90) return 'Rất tốt! Bé viết rất sát nét.';
    if (score >= 70) return 'Tốt rồi! Bé tô thêm đoạn còn thiếu nhé.';
    if (score > 0) return `Đang luyện nét số ${activeStrokeIndex + 1}, hãy đi chậm và bám nét mờ.`;
    return message;
  }, [activeStrokeIndex, isComplete, message, score]);

  function getStrokeWidth(index: number) {
    return currentLetter.strokeWidths?.[index] ?? DEFAULT_STROKE_WIDTH;
  }

  function stopDemo() {
    if (animationRef.current) {
      window.cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setIsDemoing(false);
    setPencilPoint(null);
  }

  function getSvgPoint(event: PointerEvent<SVGSVGElement>): Point {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };

    const pt = svg.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;

    const matrix = svg.getScreenCTM();
    if (!matrix) return { x: 0, y: 0 };

    const transformed = pt.matrixTransform(matrix.inverse());

    return {
      x: transformed.x,
      y: transformed.y,
    };
  }

  function buildStrokeSamples(strokeIndex: number) {
    const path = pathRefs.current[strokeIndex];
    const points: Point[] = [];

    if (!path) {
      samplePointsRef.current = points;
      return;
    }

    const length = path.getTotalLength();

    for (let d = 0; d <= length; d += SAMPLE_STEP) {
      const p = path.getPointAtLength(d);
      points.push({ x: p.x, y: p.y });
    }

    samplePointsRef.current = points;
    coveredRef.current = new Set();
    goodRef.current = 0;
    totalRef.current = 0;
  }

  function rebuildArrowInfos() {
    const infos = currentLetter.paths.map((pathData, index) => {
      const path = pathRefs.current[index];
      const fallback = getFirstMovePoint(pathData);

      if (!path) {
        return {
          d: `M ${fallback.x} ${fallback.y} L ${fallback.x + 32} ${fallback.y + 18}`,
          x: fallback.x,
          y: fallback.y,
        };
      }

      const length = path.getTotalLength();
      const p1 = path.getPointAtLength(Math.min(length * 0.08, length));
      const p2 = path.getPointAtLength(Math.min(length * 0.24, length));

      return {
        d: `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`,
        x: p1.x,
        y: p1.y,
      };
    });

    setArrowInfos(infos);
  }

  function resetLetter(nextIndex = letterIndex) {
    stopDemo();

    const letter = letters[nextIndex] ?? letters[0];

    pathRefs.current = [];
    samplePointsRef.current = [];
    coveredRef.current = new Set();
    goodRef.current = 0;
    totalRef.current = 0;
    lastPointRef.current = null;
    activeDrawPathRef.current = '';

    setLetterIndex(nextIndex);
    setActiveStrokeIndex(0);
    setDrawnPaths(makeEmptyPaths(letter.paths.length));
    setScore(0);
    setMessage('Kéo đầu bút theo nét số 1 nhé!');
    setIsDrawing(false);
    setPencilPoint(null);
    setArrowInfos([]);
  }

  useEffect(() => {
    resetLetter(letterIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      rebuildArrowInfos();
      buildStrokeSamples(activeStrokeIndex);
    }, 80);

    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [letterIndex, activeStrokeIndex]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      speakText(currentLetter.speak);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [letterIndex, currentLetter.speak]);

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

      for (let i = bestIndex - 3; i <= bestIndex + 3; i += 1) {
        if (i >= 0 && i < samples.length) {
          coveredRef.current.add(i);
        }
      }
    }

    const accuracy = totalRef.current ? goodRef.current / totalRef.current : 0;
    const coverage = samples.length ? coveredRef.current.size / samples.length : 0;
    const nextScore = Math.round(clamp((accuracy * 0.42 + coverage * 0.58) * 100, 0, 100));

    setScore(nextScore);

    if (best > HIT_RADIUS) {
      setMessage(`Chưa đúng nét số ${activeStrokeIndex + 1}, bé kéo chậm lại nhé!`);
    } else {
      setMessage(`Tốt rồi, tiếp tục nét số ${activeStrokeIndex + 1} nhé!`);
    }

    return best <= HIT_RADIUS;
  }

  function updatePencil(point: Point) {
    if (lastPointRef.current) {
      const dx = point.x - lastPointRef.current.x;
      const dy = point.y - lastPointRef.current.y;

      if (Math.abs(dx) + Math.abs(dy) > 0.6) {
        setPencilAngle((Math.atan2(dy, dx) * 180) / Math.PI + 70);
      }
    }

    setPencilPoint(point);
  }

  function appendDrawPoint(point: Point) {
    if (!activeDrawPathRef.current) {
      activeDrawPathRef.current = `M ${point.x} ${point.y}`;
    } else {
      activeDrawPathRef.current += ` L ${point.x} ${point.y}`;
    }

    setDrawnPaths((prev) => {
      const next = [...prev];

      while (next.length < strokeTotal) {
        next.push('');
      }

      next[activeStrokeIndex] = activeDrawPathRef.current;
      return next;
    });
  }

  function handlePointerDown(event: PointerEvent<SVGSVGElement>) {
    if (isDemoing || isComplete) return;

    event.currentTarget.setPointerCapture(event.pointerId);

    const point = getSvgPoint(event);
    updatePencil(point);

    const isValid = updateCoverage(point);
    if (!isValid) return;

    activeDrawPathRef.current = '';
    setIsDrawing(true);
    appendDrawPoint(point);
    lastPointRef.current = point;
  }

  function handlePointerMove(event: PointerEvent<SVGSVGElement>) {
    if (isDemoing || isComplete) return;

    const point = getSvgPoint(event);
    updatePencil(point);

    if (!isDrawing) return;

    const isValid = updateCoverage(point);
    if (!isValid) return;

    appendDrawPoint(point);
    lastPointRef.current = point;
  }

  function completeStrokeIfEnough() {
    const coverage = samplePointsRef.current.length
      ? coveredRef.current.size / samplePointsRef.current.length
      : 0;

    if (coverage < COMPLETE_COVERAGE) {
      setMessage(`Bé tô thêm cho đủ nét số ${activeStrokeIndex + 1} nhé!`);
      return;
    }

    if (activeStrokeIndex < strokeTotal - 1) {
      const nextStroke = activeStrokeIndex + 1;

      activeDrawPathRef.current = '';
      lastPointRef.current = null;
      coveredRef.current = new Set();
      goodRef.current = 0;
      totalRef.current = 0;

      setActiveStrokeIndex(nextStroke);
      setScore(0);
      setMessage(`Giỏi quá! Bây giờ viết nét số ${nextStroke + 1} nhé!`);
      return;
    }

    setActiveStrokeIndex(strokeTotal);
    setScore(100);
    setMessage('Hoàn thành rồi! Bé viết rất đẹp.');
    window.setTimeout(() => setPencilPoint(null), 180);
  }

  function stopDrawing(event: PointerEvent<SVGSVGElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setIsDrawing(false);
    lastPointRef.current = null;
    completeStrokeIfEnough();
  }

  function nextLetter() {
    const nextIndex = (letterIndex + 1) % letters.length;
    resetLetter(nextIndex);
  }

  function chooseLetter(index: number) {
    resetLetter(index);
  }

  function reset() {
    resetLetter(letterIndex);
  }

  function speak() {
    speakText(currentLetter.speak);
  }

  function playGuide() {
    stopDemo();
    setIsDemoing(true);
    setMessage('Nhìn bút mẫu chạy theo đúng thứ tự nét nhé!');

    setDrawnPaths(makeEmptyPaths(strokeTotal));

    let strokeIndex = 0;
    let distanceOnPath = 0;
    const speed = 6.8;
    let demoPath = '';

    const drawFrame = () => {
      const path = pathRefs.current[strokeIndex];

      if (!path) {
        setIsDemoing(false);
        setPencilPoint(null);
        return;
      }

      const length = path.getTotalLength();
      distanceOnPath = Math.min(distanceOnPath + speed, length);

      const raw = path.getPointAtLength(distanceOnPath);
      const point = { x: raw.x, y: raw.y };

      if (!demoPath) {
        demoPath = `M ${point.x} ${point.y}`;
      } else {
        demoPath += ` L ${point.x} ${point.y}`;
      }

      if (lastPointRef.current) {
        const dx = point.x - lastPointRef.current.x;
        const dy = point.y - lastPointRef.current.y;

        if (Math.abs(dx) + Math.abs(dy) > 0.5) {
          setPencilAngle((Math.atan2(dy, dx) * 180) / Math.PI + 70);
        }
      }

      lastPointRef.current = point;
      setPencilPoint(point);

      setDrawnPaths((prev) => {
        const next = [...prev];
        next[strokeIndex] = demoPath;
        return next;
      });

      if (distanceOnPath >= length) {
        strokeIndex += 1;
        distanceOnPath = 0;
        demoPath = '';
        lastPointRef.current = null;
      }

      if (strokeIndex < strokeTotal) {
        animationRef.current = window.requestAnimationFrame(drawFrame);
      } else {
        animationRef.current = null;
        setIsDemoing(false);
        setPencilPoint(null);
        window.setTimeout(reset, 500);
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

        <div className={styles.strokeBox}>
          {isComplete ? 'Hoàn thành' : `Nét ${activeStrokeIndex + 1} / ${strokeTotal}`}
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
            key={`${item.key}-${index}`}
            className={index === letterIndex ? styles.activeLetter : ''}
            onClick={() => chooseLetter(index)}
            disabled={isDemoing}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className={styles.boardWrap}>
        <div className={styles.board}>
          <svg
            ref={svgRef}
            className={styles.traceSvg}
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={stopDrawing}
            onPointerCancel={stopDrawing}
            onPointerLeave={() => {
              setIsDrawing(false);
              lastPointRef.current = null;
            }}
            aria-label={`Bảng tô ${currentLetter.speak}`}
          >
            <defs>
              <marker id="traceArrowHead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" className={styles.arrowHead} />
              </marker>
            </defs>

            <rect width="100%" height="100%" className={styles.boardBg} />

            <g className={styles.gridLines}>
              {Array.from({ length: 9 }).map((_, index) => (
                <line key={`v-${index}`} x1={index * 75} y1="0" x2={index * 75} y2={SVG_H} />
              ))}
              {Array.from({ length: 8 }).map((_, index) => (
                <line key={`h-${index}`} x1="0" y1={index * 75} x2={SVG_W} y2={index * 75} />
              ))}
              <line x1="0" y1="260" x2={SVG_W} y2="260" className={styles.middleLine} />
            </g>

            <g>
              {currentLetter.paths.map((path, index) => {
                const isDone = index < activeStrokeIndex || isComplete;
                const isActive = index === activeStrokeIndex && !isComplete;

                return (
                  <path
                    key={`${currentLetter.key}-guide-${index}`}
                    ref={(node) => {
                      pathRefs.current[index] = node;
                    }}
                    d={path}
                    className={`${styles.tracePath} ${isActive ? styles.activeTracePath : ''} ${
                      isDone ? styles.doneTracePath : ''
                    }`}
                    style={{ strokeWidth: getStrokeWidth(index) }}
                  />
                );
              })}
            </g>

            <g className={styles.arrowLayer}>
              {arrowInfos.map((arrow, index) => {
                const shouldShow = index === activeStrokeIndex && !isComplete && !isDemoing;

                return (
                  <path
                    key={`${currentLetter.key}-arrow-${index}`}
                    d={arrow.d}
                    className={styles.arrow}
                    style={{ opacity: shouldShow ? 1 : 0 }}
                  />
                );
              })}
            </g>

            <g>
              {currentLetter.paths.map((path, index) => {
                const firstPoint = getFirstMovePoint(path);
                const labelPoint = currentLetter.numberPositions?.[index] ?? {
                  x: firstPoint.x - 24,
                  y: firstPoint.y - 20,
                };

                const isActive = index === activeStrokeIndex && !isComplete;

                return (
                  <g
                    key={`${currentLetter.key}-num-${index}`}
                    className={`${styles.strokeNumber} ${isActive ? styles.activeStrokeNumber : ''}`}
                  >
                    <circle cx={labelPoint.x} cy={labelPoint.y} r="17" />
                    <text x={labelPoint.x} y={labelPoint.y + 1}>
                      {index + 1}
                    </text>
                  </g>
                );
              })}
            </g>

            <g>
              {drawnPaths.map((path, index) => (
                <path
                  key={`${currentLetter.key}-drawn-${index}`}
                  d={path}
                  className={styles.drawnPath}
                  style={{ strokeWidth: getStrokeWidth(index) }}
                />
              ))}
            </g>

            {pencilPoint && (
              <g
                className={styles.pencilSvg}
                transform={`translate(${pencilPoint.x} ${pencilPoint.y}) rotate(${pencilAngle})`}
                aria-hidden="true"
              >
                <polygon points="0,0 -12,-34 12,-34" className={styles.pencilWood} />
                <polygon points="-12,-34 12,-34 10,-50 -10,-50" className={styles.pencilTipBody} />
                <rect x="-11" y="-150" width="22" height="105" rx="9" className={styles.pencilBodySvg} />
                <rect x="-11" y="-165" width="22" height="18" rx="8" className={styles.pencilEraserSvg} />
                <line x1="-4" y1="-145" x2="-4" y2="-55" className={styles.pencilLineDark} />
                <line x1="5" y1="-145" x2="5" y2="-55" className={styles.pencilLineLight} />
              </g>
            )}
          </svg>
        </div>
      </div>

      <div className={styles.status}>
        <div className={styles.progressTrack}>
          <div className={styles.progressBar} style={{ width: `${score}%` }} />
        </div>
        <p>{progressText}</p>
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={speak}>
          Nghe chữ
        </button>
        <button type="button" onClick={playGuide} disabled={isDemoing}>
          Xem bút mẫu
        </button>
        <button type="button" onClick={reset} disabled={isDemoing}>
          Làm lại
        </button>
        <button type="button" onClick={nextLetter} disabled={isDemoing}>
          Chữ tiếp theo
        </button>
      </div>
    </section>
  );
}
