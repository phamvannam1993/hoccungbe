const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export async function playFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}/api/play${path}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`playFetch ${path} → ${res.status}`);
  return res.json();
}

export type ApiSubject = {
  id: number; name: string; slug: string;
  emoji: string; color: string; description: string; sortOrder: number;
};

export type ApiTopic = {
  id: number; subjectId: number; name: string; slug: string;
  emoji: string; gameType: string; description: string; sortOrder: number;
};

export type ApiLevel = {
  id: number; topicId: number; name: string; slug: string;
  color: string; difficulty: string; gridSize: number; theme: string;
  sortOrder: number; requiredLevelId: number | null;
};

export type ApiGameLesson = {
  id: number; levelId: number; sortOrder: number; title: string;
  icon: string; timeLimit: number; passingScore: number; questionCount?: number;
};

export type MatrixData = {
  gridSize: number; theme: string;
  grid: (string | null)[][];
  emptyPos: [number, number];
  answer: string; options: string[]; hint?: string;
};

export type PatternData = {
  sequence: (string | null)[];
  emptyPos: number; patternRule: string;
  answer: string; options: string[]; hint?: string;
};

export type ConnectData = {
  pairs: { left: string; right: string }[];
  leftItems: string[]; rightItems: string[]; hint?: string;
};

export type SpotDiffData = {
  gridSize: number;
  imageA: string[][]; imageB: string[][];
  differences: { row: number; col: number }[];
  totalDiff: number;
};

export type MazeData = {
  grid: number[][];
  start: [number, number]; end: [number, number];
  character: string; goal: string; hint?: string;
};

export type QuestionData = MatrixData | PatternData | ConnectData | SpotDiffData | MazeData;

export type ApiQuestion = {
  id: number; lessonId: number; sortOrder: number;
  type: 'matrix' | 'pattern' | 'connect' | 'spot_diff' | 'maze';
  data: QuestionData;
};
