/**
 * Puzzle API Client
 * Handles all puzzle-related API calls
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface PuzzlePlayData {
  id: number;
  title: string;
  instruction: string;
  puzzleType: string;
  difficulty: string;
  pieceCount: number;
  pieces: Array<{
    id: string;
    position: number;
    content: string;
    display: string;
  }>;
}

export interface PuzzleProgress {
  id: number;
  userId: number;
  puzzleId: number;
  attemptCount: number;
  completedCount: number;
  bestTime: number;
  pointsEarned: number;
  isCompleted: boolean;
  lastPlayedAt?: string;
  firstCompletedAt?: string;
}

export interface PuzzleSubmitData {
  puzzleId: number;
  placedPieces: string[];
  completionTime?: number;
  attemptCount?: number;
}

// ─── Puzzle Fetching ───────────────────────────────────────────────────────

export async function fetchAllPuzzles() {
  try {
    const res = await fetch(`${API_BASE}/api/puzzles`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error('Failed to fetch puzzles');
    return await res.json();
  } catch (error) {
    console.error('Error fetching puzzles:', error);
    return [];
  }
}

export async function fetchPuzzlePieces(puzzleId: number) {
  try {
    const res = await fetch(`${API_BASE}/api/puzzles/${puzzleId}/pieces`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error('Failed to fetch pieces');
    return await res.json();
  } catch (error) {
    console.error(`Error fetching pieces for puzzle ${puzzleId}:`, error);
    return [];
  }
}

export async function fetchPuzzleById(id: number): Promise<PuzzlePlayData | null> {
  try {
    const res = await fetch(`${API_BASE}/api/puzzles/${id}/play`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error('Failed to fetch puzzle');
    return await res.json();
  } catch (error) {
    console.error(`Error fetching puzzle ${id}:`, error);
    return null;
  }
}

export async function fetchRandomPuzzle(): Promise<PuzzlePlayData | null> {
  try {
    const puzzles = await fetchAllPuzzles();
    if (!puzzles.length) return null;
    const random = puzzles[Math.floor(Math.random() * puzzles.length)];
    return await fetchPuzzleById(random.id);
  } catch (error) {
    console.error('Error fetching random puzzle:', error);
    return null;
  }
}

// ─── Progress Tracking ─────────────────────────────────────────────────────

export async function fetchUserProgress(
  userId: number,
  puzzleId: number,
): Promise<PuzzleProgress | null> {
  try {
    const res = await fetch(`${API_BASE}/api/puzzles/progress/${userId}/${puzzleId}`);
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch progress');
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching progress:', error);
    return null;
  }
}

export async function submitPuzzleResult(
  userId: number,
  data: PuzzleSubmitData,
): Promise<PuzzleProgress | null> {
  try {
    const res = await fetch(`${API_BASE}/api/puzzles/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        userId, // In production, this comes from JWT
      }),
    });
    if (!res.ok) throw new Error('Failed to submit puzzle');
    return await res.json();
  } catch (error) {
    console.error('Error submitting puzzle:', error);
    return null;
  }
}

export async function resetPuzzleProgress(
  userId: number,
  puzzleId: number,
): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/puzzles/progress/${userId}/${puzzleId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to reset progress');
    return true;
  } catch (error) {
    console.error('Error resetting progress:', error);
    return false;
  }
}

// ─── Local Storage Cache ───────────────────────────────────────────────────

const PROGRESS_CACHE_KEY = 'puzzle_progress_cache';

export function savePuzzleProgressLocal(userId: number, progress: PuzzleProgress) {
  try {
    const cache = localStorage.getItem(PROGRESS_CACHE_KEY) || '{}';
    const data = JSON.parse(cache);
    data[`${userId}_${progress.puzzleId}`] = progress;
    localStorage.setItem(PROGRESS_CACHE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to local storage:', error);
  }
}

export function getLocalPuzzleProgress(userId: number, puzzleId: number): PuzzleProgress | null {
  try {
    const cache = localStorage.getItem(PROGRESS_CACHE_KEY) || '{}';
    const data = JSON.parse(cache);
    return data[`${userId}_${puzzleId}`] || null;
  } catch (error) {
    console.error('Error reading from local storage:', error);
    return null;
  }
}

export function clearPuzzleProgressLocal() {
  try {
    localStorage.removeItem(PROGRESS_CACHE_KEY);
  } catch (error) {
    console.error('Error clearing local storage:', error);
  }
}
