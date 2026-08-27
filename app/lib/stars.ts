/**
 * Ví "sao" ⭐ của bé — phần thưởng nhìn thấy được khi hoàn thành bài, dùng để mở
 * khoá bộ sưu tập (nhãn dán, thú cưng…). Lưu localStorage theo từng bé nên chạy cho
 * cả khách chưa đăng nhập và hoạt động offline (PWA). Không phụ thuộc backend.
 *
 * Chống "cày" sao: mỗi bài tập (lessonId:exerciseNumber) chỉ thưởng MỘT lần đầu hoàn
 * thành; làm lại không cộng thêm (vẫn khuyến khích luyện tập nhưng không lạm phát sao).
 */

const KEY = 'bhh_stars_v1';

export type StarState = {
  balance: number; // sao đang có (đã trừ khi mua)
  earned: number; // tổng sao từng kiếm
  awarded: string[]; // các bài đã thưởng: "lessonId:exerciseNumber"
};

type Store = Record<string, StarState>;

export const STARS_EVENT = 'bhh:stars';

function read(): Store {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}') as Store;
  } catch {
    return {};
  }
}

function write(store: Store) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
    window.dispatchEvent(new CustomEvent(STARS_EVENT));
  } catch {
    /* ignore */
  }
}

function blank(): StarState {
  return { balance: 0, earned: 0, awarded: [] };
}

export function getStarState(childId: number): StarState {
  const s = read()[String(childId)];
  return s ? { balance: s.balance || 0, earned: s.earned || 0, awarded: s.awarded || [] } : blank();
}

export function getStars(childId: number): number {
  return getStarState(childId).balance;
}

/** Số sao thưởng cho một bài dựa trên điểm (0–100). Luôn có sao để bé thấy được khích lệ. */
export function starsForScore(score: number): number {
  let stars = 3; // hoàn thành
  if (score >= 80) stars += 2; // làm tốt
  if (score >= 100) stars += 2; // trọn vẹn
  return stars;
}

/**
 * Thưởng sao khi hoàn thành một bài tập. Trả về số sao vừa cộng (0 nếu đã thưởng trước đó).
 */
export function awardForExercise(childId: number, lessonId: number, exerciseNumber: number, score: number): number {
  const store = read();
  const key = String(childId);
  const state = store[key] ? { ...blank(), ...store[key] } : blank();
  const tag = `${lessonId}:${exerciseNumber}`;
  if (state.awarded.includes(tag)) return 0;
  const gain = starsForScore(score);
  state.awarded = [...state.awarded, tag];
  state.balance += gain;
  state.earned += gain;
  store[key] = state;
  write(store);
  return gain;
}

/** Cộng sao thưởng (vd hoàn thành nhiệm vụ tuần) — không dedupe theo bài. */
export function addStars(childId: number, amount: number): number {
  if (amount <= 0) return getStars(childId);
  const store = read();
  const key = String(childId);
  const state = store[key] ? { ...blank(), ...store[key] } : blank();
  state.balance += amount;
  state.earned += amount;
  store[key] = state;
  write(store);
  return state.balance;
}

/** Trừ sao khi mua vật phẩm. Trả về true nếu đủ sao và đã trừ. */
export function spendStars(childId: number, amount: number): boolean {
  const store = read();
  const key = String(childId);
  const state = store[key] ? { ...blank(), ...store[key] } : blank();
  if (state.balance < amount) return false;
  state.balance -= amount;
  store[key] = state;
  write(store);
  return true;
}
