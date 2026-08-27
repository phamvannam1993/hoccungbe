/**
 * Huy hiệu thành tích — mục tiêu rõ ràng để bé phấn đấu, tổng hợp từ dữ liệu đã có
 * (số bài học, chuỗi ngày, điểm tuyệt đối, sao, bộ sưu tập, số môn). Thuần logic, không
 * cần backend/asset (emoji). Mỗi huy hiệu có ngưỡng + tiến độ để hiện thanh "gần đạt".
 */

export type BadgeContext = {
  lessons: number; // tổng bài đã hoàn thành
  perfect: number; // số bài đúng 100%
  subjects: number; // số môn khác nhau đã học
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
  starsEarned: number; // tổng sao từng kiếm
  petsOwned: number; // số thú cưng sở hữu
  itemsOwned: number; // tổng vật phẩm sở hữu
  itemsTotal: number; // tổng vật phẩm
};

export type Badge = {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  /** giá trị hiện tại + mốc cần đạt, để tính tiến độ và trạng thái. */
  progress: (c: BadgeContext) => { cur: number; goal: number };
};

export const BADGES: Badge[] = [
  { id: 'first-step', emoji: '🌟', title: 'Bước đầu tiên', desc: 'Hoàn thành bài học đầu tiên', progress: (c) => ({ cur: c.lessons, goal: 1 }) },
  { id: 'eager', emoji: '📚', title: 'Ham học', desc: 'Hoàn thành 10 bài học', progress: (c) => ({ cur: c.lessons, goal: 10 }) },
  { id: 'super', emoji: '🎓', title: 'Siêu chăm', desc: 'Hoàn thành 50 bài học', progress: (c) => ({ cur: c.lessons, goal: 50 }) },
  { id: 'streak3', emoji: '🔥', title: 'Chuỗi 3 ngày', desc: 'Học 3 ngày liên tiếp', progress: (c) => ({ cur: c.longestStreak, goal: 3 }) },
  { id: 'streak7', emoji: '🔥', title: 'Chuỗi 7 ngày', desc: 'Học 7 ngày liên tiếp', progress: (c) => ({ cur: c.longestStreak, goal: 7 }) },
  { id: 'perfect1', emoji: '💯', title: 'Điểm tuyệt đối', desc: 'Có 1 bài đúng 100%', progress: (c) => ({ cur: c.perfect, goal: 1 }) },
  { id: 'sharpshooter', emoji: '🎯', title: 'Xạ thủ', desc: 'Có 5 bài đúng 100%', progress: (c) => ({ cur: c.perfect, goal: 5 }) },
  { id: 'star-collector', emoji: '⭐', title: 'Nhà sưu tầm sao', desc: 'Kiếm được 50 sao', progress: (c) => ({ cur: c.starsEarned, goal: 50 }) },
  { id: 'pet-friend', emoji: '🐾', title: 'Bạn của thú cưng', desc: 'Sở hữu 3 thú cưng', progress: (c) => ({ cur: c.petsOwned, goal: 3 }) },
  { id: 'collector-king', emoji: '🦄', title: 'Vua sưu tầm', desc: 'Sở hữu mọi vật phẩm', progress: (c) => ({ cur: c.itemsOwned, goal: c.itemsTotal }) },
  { id: 'all-rounder', emoji: '🧠', title: 'Đa tài', desc: 'Học từ 3 môn khác nhau', progress: (c) => ({ cur: c.subjects, goal: 3 }) },
  { id: 'persistent', emoji: '🌈', title: 'Kiên trì', desc: 'Tổng 15 ngày học', progress: (c) => ({ cur: c.totalActiveDays, goal: 15 }) },
];

export function isEarned(b: Badge, c: BadgeContext): boolean {
  const { cur, goal } = b.progress(c);
  return goal > 0 && cur >= goal;
}
