'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { generatePuzzleLevel } from './data';
import type { PuzzleLevel } from './data';
import { speakText, stopSpeaking } from '../../components/edu/utils/speech';
import { fetchAllPuzzles, fetchPuzzlePieces } from '../../lib/api-puzzle';
import styles from './PuzzleGame.module.css';

interface DBPuzzle {
  id: number;
  title: string;
  description: string;
  instruction: string;
  puzzleType: string;
  difficulty: string;
  pieceCount: number;
  points: number;
  imageUrl?: string;
  gridRows?: number;
  gridCols?: number;
  pieces?: Array<{ position: number; content: string }>;
}

interface EdgePattern {
  top: 'flat' | 'tab' | 'blank';
  right: 'flat' | 'tab' | 'blank';
  bottom: 'flat' | 'tab' | 'blank';
  left: 'flat' | 'tab' | 'blank';
}

interface PuzzlePieceWithConfig {
  id: string;
  position: number;
  content: string;
  display?: 'image' | 'text' | 'emoji';
  configJson?: {
    edges?: EdgePattern;
    [key: string]: any;
  };
  [key: string]: any;
}

type PuzzleLevelWithImage = Omit<PuzzleLevel, 'pieces'> & {
  imageUrl?: string;
  gridRows?: number;
  gridCols?: number;
  pieces: PuzzlePieceWithConfig[];
};

interface GridMeta {
  rows: number;
  cols: number;
  totalSlots: number;
}

const inferGridFromPieceCount = (pieceCount: number): GridMeta => {
  const safeCount = Math.max(1, pieceCount || 1);

  const preset: Record<number, GridMeta> = {
    1: { rows: 1, cols: 1, totalSlots: 1 },
    2: { rows: 1, cols: 2, totalSlots: 2 },
    3: { rows: 1, cols: 3, totalSlots: 3 },
    4: { rows: 2, cols: 2, totalSlots: 4 },
    6: { rows: 2, cols: 3, totalSlots: 6 },
    8: { rows: 2, cols: 4, totalSlots: 8 },
    9: { rows: 3, cols: 3, totalSlots: 9 },
    10: { rows: 2, cols: 5, totalSlots: 10 },
    12: { rows: 3, cols: 4, totalSlots: 12 },
    15: { rows: 3, cols: 5, totalSlots: 15 },
    16: { rows: 4, cols: 4, totalSlots: 16 },
    20: { rows: 4, cols: 5, totalSlots: 20 },
    24: { rows: 4, cols: 6, totalSlots: 24 },
    25: { rows: 5, cols: 5, totalSlots: 25 },
  };

  if (preset[safeCount]) return preset[safeCount];

  const cols = Math.ceil(Math.sqrt(safeCount));
  const rows = Math.ceil(safeCount / cols);

  return {
    rows,
    cols,
    totalSlots: rows * cols,
  };
};

const getGridMeta = (level: PuzzleLevelWithImage): GridMeta => {
  const pieceCount = Math.max(level.pieces?.length || 0, 1);
  const inferred = inferGridFromPieceCount(pieceCount);

  const cols = Number(level.gridCols) > 0 ? Number(level.gridCols) : inferred.cols;
  const rows = Number(level.gridRows) > 0 ? Number(level.gridRows) : inferred.rows;

  return {
    rows,
    cols,
    totalSlots: rows * cols,
  };
};

const getDisplayType = (puzzleType: string, imageUrl?: string) => {
  if (imageUrl && imageUrl.trim() !== '') return 'image';
  if (puzzleType === 'image') return 'image';
  if (puzzleType === 'letters') return 'text';
  if (puzzleType === 'numbers') return 'text';
  return 'emoji';
};


export default function PuzzleGame() {
  const [round, setRound] = useState(0);
  const [bestRound, setBestRound] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [placedPieces, setPlacedPieces] = useState<Set<string>>(new Set());
  const [draggedPiece, setDraggedPiece] = useState<string | null>(null);
  const [replayKey, setReplayKey] = useState(0);
  const [dbPuzzles, setDbPuzzles] = useState<PuzzleLevelWithImage[]>([]);
  const [loading, setLoading] = useState(true);
  const lastSpokenRound = useRef(-1);

  useEffect(() => {
    const loadPuzzles = async () => {
      try {
        const puzzles = await fetchAllPuzzles();

        const convertedPuzzles: PuzzleLevelWithImage[] = await Promise.all(
          puzzles.map(async (p: DBPuzzle) => {
            const fetchedPieces = await fetchPuzzlePieces(p.id);

            const inferredGrid = inferGridFromPieceCount(
              Number(p.pieceCount) || fetchedPieces.length || 1,
            );

            const gridRows = Number(p.gridRows) > 0 ? Number(p.gridRows) : inferredGrid.rows;
            const gridCols = Number(p.gridCols) > 0 ? Number(p.gridCols) : inferredGrid.cols;
            const totalSlots = gridRows * gridCols;

            
            const displayType = getDisplayType(p.puzzleType, p.imageUrl);

            const mappedPieces: PuzzlePieceWithConfig[] = fetchedPieces
              .map((piece: any, index: number) => ({
                id: `${p.id}-${piece.id ?? `piece-${index}`}`,
                position: Number.isInteger(piece.position) ? piece.position : index,
                content: piece.content || `${index + 1}`,
                display: piece.display || displayType,
                configJson: piece.configJson,
              }))
              .filter((piece: PuzzlePieceWithConfig) => {
                return piece.position >= 0 && piece.position < totalSlots;
              });

            const isValidPieces =
              mappedPieces.length === totalSlots &&
              new Set(mappedPieces.map((piece) => piece.position)).size === totalSlots;

            const pieces: PuzzlePieceWithConfig[] = isValidPieces
              ? mappedPieces
              : Array.from({ length: totalSlots }, (_, index) => ({
                  id: `${p.id}-piece-${index}`,
                  position: index,
                  content: `${index + 1}`,
                  display: displayType,
                }));

            return {
              id: p.id,
              type: p.puzzleType as any,
              title: p.title,
              instruction: p.instruction || `Ghép ${totalSlots} mảnh để tạo hình`,
              description: p.description,
              imageUrl: p.imageUrl,
              gridRows,
              gridCols,
              pieces,
            };
          }),
        );

        setDbPuzzles(
          convertedPuzzles.length > 0
            ? convertedPuzzles
            : ([generatePuzzleLevel(0)] as PuzzleLevelWithImage[]),
        );
      } catch (error) {
        console.error('Failed to fetch puzzles:', error);
        setDbPuzzles([]);
      } finally {
        setLoading(false);
      }
    };

    loadPuzzles();
  }, []);

  const level = useMemo<PuzzleLevelWithImage>(() => {
    if (dbPuzzles.length === 0) {
      const generated = generatePuzzleLevel(round) as PuzzleLevelWithImage;
      const grid = getGridMeta(generated);

      return {
        ...generated,
        gridRows: generated.gridRows || grid.rows,
        gridCols: generated.gridCols || grid.cols,
      };
    }

    const levelIndex = round % dbPuzzles.length;
    return dbPuzzles[levelIndex];
  }, [round, dbPuzzles]);

  const gridMeta = useMemo(() => getGridMeta(level), [level]);
  const { rows: gridRows, cols: gridCols, totalSlots } = gridMeta;

  const responsiveGridCols = gridCols;

  const pieces = useMemo(() => {
    return [...level.pieces].sort(() => Math.random() - 0.5).map((p) => ({ ...p }));
  }, [level.id, replayKey, level.pieces]);

  const piecesByPosition = useMemo(() => {
    const map = new Map<number, PuzzlePieceWithConfig>();

    pieces.forEach((piece) => {
      map.set(piece.position, piece);
    });

    return map;
  }, [pieces]);

  useEffect(() => {
    setPlacedPieces(new Set());
    setDraggedPiece(null);

    if (audioUnlocked && lastSpokenRound.current !== round) {
      lastSpokenRound.current = round;

      const timer = window.setTimeout(() => {
        speakText(level.instruction, { lang: 'vi-VN', rate: 0.95 });
      }, 400);

      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, [round, replayKey, audioUnlocked, level.instruction]);

  useEffect(() => () => stopSpeaking(), []);

  const edgesMatch = (edge1: string, edge2: string): boolean => {
    if (edge1 === 'flat' && edge2 === 'flat') return true;
    if (edge1 === 'tab' && edge2 === 'blank') return true;
    if (edge1 === 'blank' && edge2 === 'tab') return true;
    return false;
  };

  const canPlacePieceAt = (piece: PuzzlePieceWithConfig, slotIndex: number): boolean => {
    if (piece.position !== slotIndex) return false;
    if (!piece.configJson?.edges) return true;

    const edges = piece.configJson.edges;

    const topSlot = slotIndex - gridCols;
    if (topSlot >= 0) {
      const topPiece = piecesByPosition.get(topSlot);

      if (topPiece && placedPieces.has(topPiece.id) && topPiece.configJson?.edges) {
        if (!edgesMatch(edges.top, topPiece.configJson.edges.bottom)) return false;
      }
    }

    const bottomSlot = slotIndex + gridCols;
    if (bottomSlot < totalSlots) {
      const bottomPiece = piecesByPosition.get(bottomSlot);

      if (bottomPiece && placedPieces.has(bottomPiece.id) && bottomPiece.configJson?.edges) {
        if (!edgesMatch(edges.bottom, bottomPiece.configJson.edges.top)) return false;
      }
    }

    const leftSlot = slotIndex % gridCols === 0 ? -1 : slotIndex - 1;
    if (leftSlot >= 0) {
      const leftPiece = piecesByPosition.get(leftSlot);

      if (leftPiece && placedPieces.has(leftPiece.id) && leftPiece.configJson?.edges) {
        if (!edgesMatch(edges.left, leftPiece.configJson.edges.right)) return false;
      }
    }

    const rightSlot = slotIndex % gridCols === gridCols - 1 ? -1 : slotIndex + 1;
    if (rightSlot >= 0) {
      const rightPiece = piecesByPosition.get(rightSlot);

      if (rightPiece && placedPieces.has(rightPiece.id) && rightPiece.configJson?.edges) {
        if (!edgesMatch(edges.right, rightPiece.configJson.edges.left)) return false;
      }
    }

    return true;
  };

  const handleDragStart = (pieceId: string) => {
    if (!placedPieces.has(pieceId) && !gameOver) {
      setDraggedPiece(pieceId);
    }
  };

  const handleDragEnd = () => {
    setDraggedPiece(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).style.opacity = '0.8';
  };

  const handleDragLeave = (e: React.DragEvent) => {
    (e.currentTarget as HTMLElement).style.opacity = '1';
  };

  const handleDropOnSlot = (slotIndex: number, e: React.DragEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).style.opacity = '1';

    if (!draggedPiece) return;

    const draggedPieceObj = pieces.find((p) => p.id === draggedPiece);
    if (!draggedPieceObj) return;

    if (placedPieces.has(draggedPiece)) return;

    if (canPlacePieceAt(draggedPieceObj, slotIndex)) {
      const newPlaced = new Set(placedPieces);
      newPlaced.add(draggedPiece);

      setPlacedPieces(newPlaced);
      speakText('Đúng rồi! ✨', { lang: 'vi-VN', rate: 1.0 });

      if (newPlaced.size === level.pieces.length) {
        setBestRound((b) => Math.max(b, round + 1));

        window.setTimeout(() => {
          setRound((r) => r + 1);
          setReplayKey((k) => k + 1);
        }, 1500);
      }
    } else {
      speakText('Không khớp! Thử mảnh khác.', { lang: 'vi-VN', rate: 1.0 });
    }

    setDraggedPiece(null);
  };

  // Touch handlers for mobile drag-drop
  const handleTouchStart = (pieceId: string, e: React.TouchEvent) => {
    if (!placedPieces.has(pieceId) && !gameOver) {
      setDraggedPiece(pieceId);
      (e.currentTarget as HTMLElement).style.opacity = '0.6';
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    (e.currentTarget as HTMLElement).style.opacity = '1';
  };

  const handleSlotTouchStart = (e: React.TouchEvent) => {
    const slot = e.currentTarget as HTMLElement;
    slot.style.opacity = '0.8';
  };

  const handleSlotTouchEnd = (slotIndex: number, e: React.TouchEvent) => {
    const slot = e.currentTarget as HTMLElement;
    slot.style.opacity = '1';

    if (!draggedPiece) return;

    const draggedPieceObj = pieces.find((p) => p.id === draggedPiece);
    if (!draggedPieceObj) return;

    if (placedPieces.has(draggedPiece)) return;

    if (canPlacePieceAt(draggedPieceObj, slotIndex)) {
      const newPlaced = new Set(placedPieces);
      newPlaced.add(draggedPiece);

      setPlacedPieces(newPlaced);
      speakText('Đúng rồi! ✨', { lang: 'vi-VN', rate: 1.0 });

      if (newPlaced.size === level.pieces.length) {
        setBestRound((b) => Math.max(b, round + 1));

        window.setTimeout(() => {
          setRound((r) => r + 1);
          setReplayKey((k) => k + 1);
        }, 1500);
      }
    } else {
      speakText('Không khớp! Thử mảnh khác.', { lang: 'vi-VN', rate: 1.0 });
    }

    setDraggedPiece(null);
  };

  const handleStart = () => setAudioUnlocked(true);

  const handleRestart = () => {
    setRound(0);
    setGameOver(false);
    setPlacedPieces(new Set());
    setDraggedPiece(null);
    setReplayKey((k) => k + 1);
    lastSpokenRound.current = -1;
  };

  const progress = level.pieces.length > 0 ? placedPieces.size / level.pieces.length : 0;

  const slotContent = (slotIndex: number) => {
    const piece = piecesByPosition.get(slotIndex);
    if (!piece) return null;

    return placedPieces.has(piece.id) ? piece : null;
  };

  const renderImageSlice = (
    piece: PuzzlePieceWithConfig,
    puzzleImageUrl: string,
    cols: number,
    rows: number,
  ) => {
    const col = piece.position % cols;
    const row = Math.floor(piece.position / cols);

    const posX = cols === 1 ? 0 : (col / (cols - 1)) * 100;
    const posY = rows === 1 ? 0 : (row / (rows - 1)) * 100;

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundImage: `url(${puzzleImageUrl})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: `${cols * 100}% ${rows * 100}%`,
          backgroundPosition: `${posX}% ${posY}%`,
          backgroundOrigin: 'border-box',
          backgroundClip: 'border-box',
          overflow: 'hidden',
        }}
      />
    );
  };

  const renderPieceContent = (piece: PuzzlePieceWithConfig) => {
    if (piece.display === 'image' && level.imageUrl) {
      return renderImageSlice(piece, level.imageUrl, gridCols, gridRows);
    }

    return piece.content;
  };


  if (loading) {
    return (
      <main className={styles.app}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 'bold' }}>Loading puzzles...</div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.app}>
      <section className={styles.game}>
        {!audioUnlocked && (
          <div className={styles.overlay}>
            <div className={styles.overlayBox}>
              <div className={styles.overlayTitle}>🧩 Ghép Mảnh</div>

              <ul
                className={styles.instructions}
                style={{ listStyle: 'none', padding: 0, margin: '20px 0' }}
              >
                <li style={{ textAlign: 'left', marginBottom: 10 }}>
                  🖱️ Kéo mảnh từ bên trái
                </li>
                <li style={{ textAlign: 'left', marginBottom: 10 }}>
                  📍 Thả vào ô vuông đúng vị trí
                </li>
                <li style={{ textAlign: 'left', marginBottom: 10 }}>
                  ✅ Ghép đầy đủ → sang vòng mới
                </li>
                <li style={{ textAlign: 'left', marginBottom: 10 }}>
                  🎮 Thử các puzzle khác nhau
                </li>
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

              <div className={styles.overlayScore}>
                Vòng tốt nhất: <strong>{bestRound}</strong>
              </div>

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
              {level.type === 'animal' && '🐾 Con Vật'}
              {level.type === 'fruit' && '🍎 Trái Cây'}
              {level.type === 'letters' && '🔤 Chữ Cái'}
              {level.type === 'numbers' && '🔢 Số'}
              {level.type === 'map' && '🗺️ Bản Đồ'}
              {level.type === 'image' && '🖼️ Ghép Hình'}
              {' · '}
              {gridRows}x{gridCols}
              {' · Vòng '}
              {round + 1}
              {' · Tốt nhất: '}
              {bestRound}
            </span>
          </div>

          <button
            className={styles.audioBtn}
            onClick={() => speakText(level.instruction, { lang: 'vi-VN' })}
          >
            🔊
          </button>
        </header>

        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress * 100}%` }} />
        </div>

        <div className={styles.board}>
          <div className={styles.instruction}>{level.instruction}</div>

          {level.type === 'image' && level.imageUrl && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                margin: '8px 0 18px',
              }}
            >
              <div
                style={{
                  width: 120,
                  aspectRatio: `${gridCols} / ${gridRows}`,
                  borderRadius: 14,
                  backgroundImage: `url(${level.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  boxShadow: '0 10px 24px rgba(0,0,0,0.18)',
                  border: '3px solid rgba(255,255,255,0.85)',
                }}
                aria-label="Ảnh mẫu"
                title="Ảnh mẫu"
              />
            </div>
          )}

          <div className={styles.puzzleContainer}>
            <div className={styles.piecesArea}>
              <div className={styles.piecesTitle}>🧩 Các Mảnh</div>

              <div
                className={styles.piecesGrid}
                style={{
                  gridTemplateColumns: `repeat(${responsiveGridCols}, 1fr)`,
                  gap: 15,
                  padding: '25px',
                  minHeight: 'auto',
                }}
              >
                {pieces.map((piece) => (
                  <div
                    key={piece.id}
                    className={`${styles.piece} ${placedPieces.has(piece.id) ? styles.placed : ''}`}
                    draggable={!placedPieces.has(piece.id)}
                    onDragStart={() => handleDragStart(piece.id)}
                    onDragEnd={handleDragEnd}
                    onTouchStart={(e) => handleTouchStart(piece.id, e)}
                    onTouchEnd={handleTouchEnd}
                    style={{
                      aspectRatio: '1 / 1',
                      overflow: 'hidden',
                      opacity: placedPieces.has(piece.id) ? 0.28 : 1,
                      cursor: placedPieces.has(piece.id) ? 'default' : 'grab',
                    }}
                  >
                    {renderPieceContent(piece)}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.puzzleArea}>
              <div className={styles.puzzleTitle}>🎯 Ghép Vào Đây</div>

              <div
                className={styles.puzzleGrid}
                style={
                  {
                    '--grid-cols': gridCols,
                    gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
                    aspectRatio: `${gridCols} / ${gridRows}`,
                    width: '100%',
                    maxWidth: '600px',
                    margin: '0 auto',
                    backgroundImage:
                      level.type === 'image' && level.imageUrl
                        ? `linear-gradient(rgba(255,255,255,0.76), rgba(255,255,255,0.76)), url(${level.imageUrl})`
                        : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: 18,
                    overflow: 'hidden',
                  } as React.CSSProperties
                }
              >
                {Array.from({ length: totalSlots }).map((_, idx) => {
                  const content = slotContent(idx);

                  return (
                    <div
                      key={idx}
                      className={`${styles.slot} ${content ? styles.filled : ''}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDropOnSlot(idx, e)}
                      onTouchStart={handleSlotTouchStart}
                      onTouchEnd={(e) => handleSlotTouchEnd(idx, e)}
                      style={{
                        aspectRatio: '1 / 1',
                        overflow: 'hidden',
                      }}
                    >
                      {content ? (
                        <div
                          className={styles.slotContent}
                          style={{
                            width: '100%',
                            height: '100%',
                            overflow: 'hidden',
                          }}
                        >
                          {renderPieceContent(content)}
                        </div>
                      ) : (
                        <span className={styles.slotLabel}></span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
