const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('bhh_token') : null;

  const res = await fetch(`${BASE_URL}/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.message || `Lỗi ${res.status}`);
  }

  return res.json();
}

export type ApiCourse = {
  id: number;
  title: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  thumbnailUrl?: string;
  bannerUrl?: string;
  videoUrl?: string;
  courseType: string;
  difficultyLevel: string;
  targetAgeMin: number;
  targetAgeMax: number;
  totalLessons: number;
  estimatedMinutes: number;
  isPublished: boolean;
  isFree: boolean;
  price: number;
  lessons?: ApiLesson[];
};

export type ApiLesson = {
  id: number;
  courseId: number;
  title: string;
  slug: string;
  volumeId?: number;
  topicId?: number;
  shortDescription?: string;
  content?: string;
  lessonType: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  sortOrder: number;
  durationMinutes: number;
  isPreview: boolean;
  isPublished: boolean;
  quizzes?: { id: number }[];
};

export type ApiVolume = { id: number; courseId: number; name: string; sortOrder: number; };
export type ApiTopic = { id: number; courseId: number; volumeId?: number; name: string; sortOrder: number; };

export type AuthResponse = {
  accessToken: string;
  user: {
    id: number;
    fullName: string;
    email: string;
    role: string;
  };
};

const COURSE_TYPE_EMOJI: Record<string, string> = {
  math: '🔢',
  language: '📖',
  creative: '🎨',
  emotion: '❤️',
  logic: '🧩',
  other: '📚',
};

const COURSE_TYPE_LABEL: Record<string, string> = {
  math: 'Toán học',
  language: 'Ngôn ngữ',
  creative: 'Sáng tạo',
  emotion: 'Cảm xúc',
  logic: 'Tư duy Logic',
  other: 'Khác',
};

const LESSON_TYPE_LABEL: Record<string, string> = {
  video: 'Video',
  story: 'Câu chuyện',
  game: 'Trò chơi',
  quiz: 'Kiểm tra',
  interactive: 'Tương tác',
};

export function courseEmoji(type: string) {
  return COURSE_TYPE_EMOJI[type] || '📚';
}

export function courseTypeLabel(type: string) {
  return COURSE_TYPE_LABEL[type] || type;
}

export function lessonTypeLabel(type: string) {
  return LESSON_TYPE_LABEL[type] || type;
}

export function ageLabel(min: number, max: number) {
  return `${min}–${max} tuổi`;
}
