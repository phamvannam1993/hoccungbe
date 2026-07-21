// Module THƯỜNG (không 'use client') để cả server component (page.tsx) lẫn client
// component (ExamListClient) dùng chung. Nếu để trong file 'use client', các export
// này trở thành client-reference và server đọc ra undefined (gây lỗi hiển thị "toan").

export interface ExamItem {
  id: number;
  title: string;
  slug: string;
  subject: string;
  grade: number;
  semester: number;
  description?: string;
  timeLimitMinutes?: number;
  totalPoints: number;
}

export const SUBJECT_LABEL: Record<string, string> = {
  toan: 'Toán',
  'tieng-viet': 'Tiếng Việt',
  'tieng-anh': 'Tiếng Anh',
};

export const SUBJECT_ICON: Record<string, string> = {
  toan: '🔢',
  'tieng-viet': '📖',
  'tieng-anh': '🌍',
};
