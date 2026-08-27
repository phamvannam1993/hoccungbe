import { spendStars, STARS_EVENT } from './stars';

/**
 * Bộ sưu tập mở khoá bằng sao ⭐ — động lực để bé quay lại học. Vật phẩm dùng emoji
 * nên không tốn asset, hiển thị tức thì. Sở hữu lưu localStorage theo từng bé (chạy
 * cho cả khách, offline).
 */

export type Collectible = {
  id: string;
  emoji: string;
  name: string;
  cost: number;
  category: 'sticker' | 'pet';
  /** Ảnh minh hoạ (ưu tiên hơn emoji nếu có) — vd icon thú cưng trong /assets/icons. */
  image?: string;
};

export const COLLECTION_CATEGORIES: { key: Collectible['category']; label: string; emoji: string }[] = [
  { key: 'sticker', label: 'Nhãn dán', emoji: '✨' },
  { key: 'pet', label: 'Thú cưng', emoji: '🐾' },
];

// Chi phí tăng dần → bé có mục tiêu ngắn (rẻ) và dài hạn (đắt).
export const COLLECTIBLES: Collectible[] = [
  // Nhãn dán
  { id: 'st-star', emoji: '⭐', name: 'Ngôi sao', cost: 10, category: 'sticker' },
  { id: 'st-heart', emoji: '❤️', name: 'Trái tim', cost: 10, category: 'sticker' },
  { id: 'st-rainbow', emoji: '🌈', name: 'Cầu vồng', cost: 15, category: 'sticker' },
  { id: 'st-balloon', emoji: '🎈', name: 'Bóng bay', cost: 15, category: 'sticker' },
  { id: 'st-rocket', emoji: '🚀', name: 'Tên lửa', cost: 20, category: 'sticker' },
  { id: 'st-crown', emoji: '👑', name: 'Vương miện', cost: 25, category: 'sticker' },
  { id: 'st-medal', emoji: '🏅', name: 'Huy chương', cost: 30, category: 'sticker' },
  { id: 'st-trophy', emoji: '🏆', name: 'Cúp vàng', cost: 40, category: 'sticker' },
  { id: 'st-gift', emoji: '🎁', name: 'Hộp quà', cost: 20, category: 'sticker' },
  { id: 'st-magic', emoji: '🪄', name: 'Đũa thần', cost: 35, category: 'sticker' },
  // Thú cưng — dùng ảnh trong public/assets/icons (emoji làm dự phòng)
  { id: 'pet-cat', emoji: '🐱', name: 'Mèo con', cost: 20, category: 'pet', image: '/assets/icons/meo_con.jpg' },
  { id: 'pet-dog', emoji: '🐶', name: 'Cún con', cost: 20, category: 'pet', image: '/assets/icons/cun_con.jpg' },
  { id: 'pet-rabbit', emoji: '🐰', name: 'Thỏ trắng', cost: 25, category: 'pet', image: '/assets/icons/tho_trang.jpg' },
  { id: 'pet-panda', emoji: '🐼', name: 'Gấu trúc', cost: 35, category: 'pet', image: '/assets/icons/gau_truc.jpg' },
  { id: 'pet-fox', emoji: '🦊', name: 'Cáo nhỏ', cost: 35, category: 'pet', image: '/assets/icons/cao_nho.jpg' },
  { id: 'pet-penguin', emoji: '🐧', name: 'Chim cánh cụt', cost: 40, category: 'pet', image: '/assets/icons/chim_canh_cut.jpg' },
  { id: 'pet-lion', emoji: '🦁', name: 'Sư tử con', cost: 50, category: 'pet', image: '/assets/icons/su_tu_con.jpg' },
  { id: 'pet-unicorn', emoji: '🦄', name: 'Kỳ lân', cost: 60, category: 'pet', image: '/assets/icons/ky_lan.jpg' },
  { id: 'pet-dragon', emoji: '🐲', name: 'Rồng nhỏ', cost: 80, category: 'pet', image: '/assets/icons/rong_nho.jpg' },
  { id: 'pet-dino', emoji: '🦖', name: 'Khủng long', cost: 70, category: 'pet', image: '/assets/icons/khung_long.jpg' },
];

const KEY = 'bhh_collection_v1';

function read(): Record<string, string[]> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
}

function write(store: Record<string, string[]>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
    window.dispatchEvent(new CustomEvent(STARS_EVENT)); // để badge/ví đồng bộ
  } catch {
    /* ignore */
  }
}

export function getOwned(childId: number): string[] {
  return read()[String(childId)] || [];
}

export function isOwned(childId: number, itemId: string): boolean {
  return getOwned(childId).includes(itemId);
}

/**
 * Mua/mở khoá một vật phẩm: trừ sao rồi ghi sở hữu.
 * Trả về 'ok' | 'owned' | 'poor' (không đủ sao).
 */
export function unlock(childId: number, item: Collectible): 'ok' | 'owned' | 'poor' {
  if (isOwned(childId, item.id)) return 'owned';
  if (!spendStars(childId, item.cost)) return 'poor';
  const store = read();
  const key = String(childId);
  store[key] = [...(store[key] || []), item.id];
  write(store);
  return 'ok';
}
