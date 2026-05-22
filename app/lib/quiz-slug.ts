// URL format: /[lessonSlug]/[lessonSlug]-[difficultySlug].html?ex=N
// Example:    /hello-xin-chao/hello-xin-chao-de.html?ex=1

export const DIFF_TO_SLUG: Record<string, string> = {
  easy: 'de',
  medium: 'trung-binh',
  hard: 'nang-cao',
};

export const SLUG_TO_DIFF: Record<string, string> = {
  'de': 'easy',
  'trung-binh': 'medium',
  'nang-cao': 'hard',
};

// Longest first to avoid partial match
const DIFF_SUFFIXES = ['nang-cao', 'trung-binh', 'de'] as const;

export function buildExerciseUrl(
  lessonSlug: string,
  _lessonId: number | string,
  difficulty: 'easy' | 'medium' | 'hard',
  exerciseNumber?: number,
): string {
  const diffSlug = DIFF_TO_SLUG[difficulty];
  const base = `/${lessonSlug}/${lessonSlug}-${diffSlug}.html`;
  return exerciseNumber ? `${base}?ex=${exerciseNumber}` : base;
}

export function parseExerciseParam(exercise: string): {
  lessonSlug: string;
  difficulty: string;
  difficultySlug: string;
} | null {
  // remove .html if still present (in case rewrite didn't strip it)
  const noExt = exercise.replace(/\.html$/, '');

  for (const suffix of DIFF_SUFFIXES) {
    if (noExt.endsWith(`-${suffix}`)) {
      const lessonSlug = noExt.slice(0, -(suffix.length + 1));
      return {
        lessonSlug,
        difficulty: SLUG_TO_DIFF[suffix] ?? 'easy',
        difficultySlug: suffix,
      };
    }
  }
  return null;
}
