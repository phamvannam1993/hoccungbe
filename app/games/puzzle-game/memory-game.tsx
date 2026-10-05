'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { speakText, stopSpeaking } from '../../components/edu/utils/speech';
import styles from './PuzzleGame.module.css';

interface Card {
  id: string;
  pairId: number;
  color: string;
  circleColor: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const COLORS = [
  { bg: '#ff6b6b', circle: '#66bb6a' },
  { bg: '#ffd93d', circle: '#8b6f47' },
  { bg: '#6bcf7f', circle: '#ff6b6b' },
  { bg: '#4d96ff', circle: '#4d96ff' },
  { bg: '#ff9ff3', circle: '#ab47bc' },
  { bg: '#ab47bc', circle: '#ff9ff3' },
  { bg: '#ff6f00', circle: '#ffffff' },
  { bg: '#0097a7', circle: '#2c2c2c' },
  { bg: '#7e57c2', circle: '#ffb300' },
];

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [round, setRound] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const lastSpokenRound = useRef(-1);

  // Initialize game
  useEffect(() => {
    const newCards: Card[] = [];
    COLORS.forEach((color, idx) => {
      newCards.push(
        {
          id: `${idx}-0`,
          pairId: idx,
          color: color.bg,
          circleColor: color.circle,
          isFlipped: false,
          isMatched: false,
        },
        {
          id: `${idx}-1`,
          pairId: idx,
          color: color.bg,
          circleColor: color.circle,
          isFlipped: false,
          isMatched: false,
        }
      );
    });

    // Shuffle cards
    const shuffled = newCards.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setScore(0);
    setMoves(0);
    setGameWon(false);

    if (audioUnlocked && lastSpokenRound.current !== round) {
      lastSpokenRound.current = round;
      const timer = window.setTimeout(() => {
        speakText('Hãy tìm các cặp thẻ giống nhau', { lang: 'vi-VN', rate: 0.95 });
      }, 400);
      return () => window.clearTimeout(timer);
    }
  }, [round, audioUnlocked]);

  useEffect(() => () => stopSpeaking(), []);

  // Check for matches
  useEffect(() => {
    if (flipped.length === 2) {
      setIsChecking(true);
      const [first, second] = flipped;
      const firstCard = cards.find((c) => c.id === first);
      const secondCard = cards.find((c) => c.id === second);

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        // Match found!
        speakText('Tuyệt vời! Bạn tìm được cặp đôi', { lang: 'vi-VN', rate: 1.0 });
        setMatched([...matched, first, second]);
        setScore((s) => s + 10);
        setMoves((m) => m + 1);
        setFlipped([]);
        setIsChecking(false);

        // Check if game won
        if (matched.length + 2 === cards.length) {
          setGameWon(true);
          speakText('Chúc mừng! Bạn chiến thắng', { lang: 'vi-VN', rate: 1.0 });
        }
      } else {
        // No match - wait longer so child can see both cards
        speakText('Thử lại nhé', { lang: 'vi-VN', rate: 1.0 });
        const timer = setTimeout(() => {
          setFlipped([]);
          setMoves((m) => m + 1);
          setIsChecking(false);
        }, 2500); // 2.5 seconds - enough time for child to remember
        return () => clearTimeout(timer);
      }
    }
  }, [flipped, cards, matched]);

  const handleCardClick = (cardId: string) => {
    // Disable clicking while checking, while game is won, or if card already matched/flipped
    if (isChecking || gameWon || !audioUnlocked) return;
    if (flipped.length < 2 && !flipped.includes(cardId) && !matched.includes(cardId)) {
      setFlipped([...flipped, cardId]);
    }
  };

  const handleStart = () => setAudioUnlocked(true);

  const handleRestart = () => {
    setRound((r) => r + 1);
  };

  return (
    <main className={styles.app}>
      <section className={styles.game}>
        {!audioUnlocked && (
          <div className={styles.overlay}>
            <div className={styles.overlayBox}>
              <div className={styles.overlayTitle}>🎨 Tìm Cặp Đôi</div>
              <ul className={styles.instructions} style={{ listStyle: 'none', padding: 0, margin: '20px 0' }}>
                <li style={{ textAlign: 'left', marginBottom: '10px' }}>
                  👆 Click để lật thẻ
                </li>
                <li style={{ textAlign: 'left', marginBottom: '10px' }}>
                  🎯 Tìm 2 thẻ giống nhau
                </li>
                <li style={{ textAlign: 'left', marginBottom: '10px' }}>
                  ✅ Khớp cặp → +10 điểm
                </li>
                <li style={{ textAlign: 'left', marginBottom: '10px' }}>
                  🏆 Tìm hết tất cả → win!
                </li>
              </ul>
              <button className={styles.startButton} onClick={handleStart}>
                ▶ Bắt đầu chơi
              </button>
            </div>
          </div>
        )}

        {gameWon && (
          <div className={styles.overlay}>
            <div className={styles.overlayBox}>
              <div className={styles.overlayTitle}>🎉 Chiến Thắng!</div>
              <div className={styles.overlayScore}>
                <div style={{ marginBottom: '15px' }}>
                  Điểm: <strong style={{ fontSize: '28px' }}>{score}</strong>
                </div>
                <div>
                  Số lần thử: <strong style={{ fontSize: '24px' }}>{moves}</strong>
                </div>
              </div>
              <button className={styles.startButton} onClick={handleRestart}>
                ↻ Chơi Lại
              </button>
            </div>
          </div>
        )}

        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>🎨 Tìm Cặp Màu Sắc</h1>
            <span className={styles.subtitle}>
              Điểm: {score} · Lần thử: {moves}
            </span>
          </div>
          <button
            className={styles.audioBtn}
            onClick={() => speakText('Hãy tìm các cặp thẻ giống nhau', { lang: 'vi-VN' })}
          >
            🔊
          </button>
        </header>

        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${(matched.length / cards.length) * 100}%` }}
          />
        </div>

        <div className={styles.board}>
          <div className={styles.instruction}>Nhấp vào các thẻ để tìm cặp giống nhau</div>

          <div className={styles.memoryGrid}>
            {cards.map((card) => {
              const isFlipped = flipped.includes(card.id) || matched.includes(card.id);
              const isMatched = matched.includes(card.id);

              return (
                <div
                  key={card.id}
                  className={`${styles.memoryCard} ${isFlipped ? styles.flipped : ''} ${
                    isMatched ? styles.matched : ''
                  }`}
                  onClick={() => handleCardClick(card.id)}
                >
                  <div className={styles.cardInner}>
                    <div className={styles.cardFront}>?</div>
                    <div
                      className={styles.cardBack}
                      style={{ background: card.color }}
                    >
                      <div
                        className={styles.circle}
                        style={{ backgroundColor: card.circleColor }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
