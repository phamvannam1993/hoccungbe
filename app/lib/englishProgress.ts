// Tiến độ lộ trình học tiếng Anh (kiểu Duolingo): mỗi chủ đề có "vương miện" (crown)
// tăng dần khi hoàn thành. Lưu localStorage theo từng bé. Bài kế mở khoá khi bài trước
// đã đạt ít nhất 1 crown.

export const MAX_CROWN = 5;
const KEY = 'bhh_en_progress_v1';

type Store = Record<string, Record<string, number>>; // childId -> { slug: crowns }

function read(): Store {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
}
function write(s: Store) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

export function getCrowns(childId: number): Record<string, number> {
  return read()[String(childId)] || {};
}

export function crownOf(childId: number, slug: string): number {
  return getCrowns(childId)[slug] || 0;
}

/** Hoàn thành một bài → +1 crown (tối đa MAX_CROWN). Trả về crown mới + có lên cấp không. */
export function addCrown(childId: number, slug: string): { crowns: number; leveledUp: boolean } {
  const store = read();
  const key = String(childId);
  store[key] = store[key] || {};
  const cur = store[key][slug] || 0;
  const next = Math.min(MAX_CROWN, cur + 1);
  const leveledUp = next > cur;
  store[key][slug] = next;
  write(store);
  return { crowns: next, leveledUp };
}
