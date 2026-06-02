'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { generateMatchLevel } from './data';
import type { MatchItem } from './data';
import { speakText, stopSpeaking } from '../../components/edu/utils/speech';
import styles from './ForestMatchGame.module.css';

export default function ForestMatchGame() {
  const [round, setRound] = useState(0);
  const [bestRound, setBestRound] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrongPair, setWrongPair] = useState<[string, string] | null>(null);
  const [replayKey, setReplayKey] = useState(0);
  const lastSpokenRound = useRef(-1);

  const level = useMemo(() => generateMatchLevel(round), [round]);

  useEffect(() => {
    setSelectedLeft(null);
    setMatched(new Set());
    setWrongPair(null);
    if (audioUnlocked && lastSpokenRound.current !== round) {
      lastSpokenRound.current = round;
      const timer = window.setTimeout(() => {
        speakText(level.instruction, { lang: 'vi-VN', rate: 0.95 });
      }, 400);
      return () => window.clearTimeout(timer);
    }
  }, [round, replayKey, audioUnlocked, level.instruction]);

  useEffect(() => () => stopSpeaking(), []);

  const handleLeft = (item: MatchItem) => {
    if (matched.has(item.pairId) || gameOver) return;
    setSelectedLeft(item.id === selectedLeft ? null : item.id);
  };

  const handleRight = (item: MatchItem) => {
    if (matched.has(item.pairId) || gameOver || !selectedLeft) return;

    const leftItem = level.left.find((l) => l.id === selectedLeft);
    if (!leftItem) return;

    if (leftItem.pairId === item.pairId) {
      const newMatched = new Set(matched);
      newMatched.add(item.pairId);
      setMatched(newMatched);
      setSelectedLeft(null);
      speakText('Đúng rồi!', { lang: 'vi-VN', rate: 1.0 });

      if (newMatched.size === level.left.length) {
        setBestRound((b) => Math.max(b, round + 1));
        window.setTimeout(() => {
          setRound((r) => r + 1);
          setReplayKey((k) => k + 1);
        }, 1200);
      }
    } else {
      setWrongPair([leftItem.id, item.id]);
      speakText('Thử lại nhé!', { lang: 'vi-VN', rate: 1.0 });
      window.setTimeout(() => {
        setWrongPair(null);
        setSelectedLeft(null);
      }, 700);
    }
  };

  const handleStart = () => setAudioUnlocked(true);

  const handleRestart = () => {
    setRound(0);
    setGameOver(false);
    setMatched(new Set());
    setSelectedLeft(null);
    setWrongPair(null);
    setReplayKey((k) => k + 1);
    lastSpokenRound.current = -1;
  };

  const renderLabel = (item: MatchItem, side: 'left' | 'right') => {
    const isMatchedLeft = side === 'left' && matched.has(item.pairId);
    const isMatchedRight = side === 'right' && matched.has(item.pairId);
    const isSelected = side === 'left' && selectedLeft === item.id;
    const isWrong = wrongPair && (wrongPair[0] === item.id || wrongPair[1] === item.id);

    let cls = styles.card;
    if (isMatchedLeft || isMatchedRight) cls += ` ${styles.cardMatched}`;
    else if (isSelected) cls += ` ${styles.cardSelected}`;
    else if (isWrong) cls += ` ${styles.cardWrong}`;

    const content = (() => {
      if (item.display === 'dots') {
        const n = item.label.length;
        return (
          <div className={styles.dotsGrid} data-count={n}>
            {Array.from({ length: n }).map((_, i) => (
              <span key={i} className={styles.dot} />
            ))}
          </div>
        );
      }
      if (item.display === 'dots-pattern') {
        return <div className={styles.dotsPattern}>{item.label}</div>;
      }
      if (item.display === 'emoji') return <span className={styles.emoji}>{item.label}</span>;
      if (item.display === 'number') return <span className={styles.number}>{item.label}</span>;
      return <span className={styles.text}>{item.label}</span>;
    })();

    return (
      <button
        key={item.id}
        className={cls}
        onClick={() => (side === 'left' ? handleLeft(item) : handleRight(item))}
        disabled={isMatchedLeft || isMatchedRight || gameOver}
      >
        {content}
        {(isMatchedLeft || isMatchedRight) && <span className={styles.checkMark}>✓</span>}
      </button>
    );
  };

  const progress = matched.size / level.left.length;

  return (
    <main className={styles.app}>
      <section className={styles.game}>
        {!audioUnlocked && (
          <div className={styles.overlay}>
            <div className={styles.overlayBox}>
              <div className={styles.overlayTitle}>🎮 Ghép hình</div>
              <ul className={styles.instructions}>
                <li>🖱️ Bấm một thẻ bên trái để chọn.</li>
                <li>🔗 Bấm thẻ khớp bên phải để nối.</li>
                <li>✅ Nối đúng hết → sang vòng mới.</li>
                <li>📈 Có số, hình, chữ để chơi.</li>
              </ul>
              <button className={styles.startButton} onClick={handleStart}>
                ▶ Bắt đầu chơi
              </button>
            </div>
          </div>
        )}

        {gameOver && (
          <div className={styles.overlay}>
            <div className={styles.overlayBox}>
              <div className={styles.overlayTitle}>Trò chơi kết thúc</div>
              <div className={styles.overlayScore}>Vòng tốt nhất: <strong>{bestRound}</strong></div>
              <button className={styles.startButton} onClick={handleRestart}>
                ↻ Chơi lại
              </button>
            </div>
          </div>
        )}

        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>{level.title}</h1>
            <span className={styles.subtitle}>
              {level.difficulty === 'easy' && '⭐ Dễ'}
              {level.difficulty === 'normal' && '⭐⭐ Trung Bình'}
              {level.difficulty === 'hard' && '⭐⭐⭐ Khó'}
              {' '}· Vòng {round + 1} · Tốt nhất: {bestRound}
            </span>
          </div>
          <button className={styles.audioBtn} onClick={() => speakText(level.instruction, { lang: 'vi-VN' })}>
            🔊
          </button>
        </header>

        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress * 100}%` }} />
        </div>

        <div className={styles.board}>
          <div className={styles.instruction}>{level.instruction}</div>

          <div className={styles.columns}>
            <div className={styles.column}>
              {level.left.map((item) => renderLabel(item, 'left'))}
            </div>

            <div className={styles.connectorArea}>
              <svg className={styles.svg} viewBox="0 0 60 100" preserveAspectRatio="none">
                {/* Connector lines will be added here */}
              </svg>
              <div className={styles.arrowHint}>→</div>
            </div>

            <div className={styles.column}>
              {level.right.map((item) => renderLabel(item, 'right'))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
