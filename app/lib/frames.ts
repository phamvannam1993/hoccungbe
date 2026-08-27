import { spendStars, STARS_EVENT } from './stars';

/**
 * Khung avatar — viền trang trí quanh ảnh đại diện, mở khoá bằng sao. Thuần CSS
 * (gradient), không cần asset. Sở hữu + khung đang đeo lưu localStorage theo từng bé.
 */

export type Frame = {
  id: string;
  name: string;
  cost: number;
  /** CSS background cho vòng viền. */
  ring: string;
};

export const AVATAR_FRAMES: Frame[] = [
  { id: 'fr-gold', name: 'Vàng kim', cost: 15, ring: 'linear-gradient(135deg,#fde047,#f59e0b)' },
  { id: 'fr-ocean', name: 'Đại dương', cost: 15, ring: 'linear-gradient(135deg,#22d3ee,#3b82f6)' },
  { id: 'fr-forest', name: 'Rừng xanh', cost: 20, ring: 'linear-gradient(135deg,#4ade80,#16a34a)' },
  { id: 'fr-sunset', name: 'Hoàng hôn', cost: 20, ring: 'linear-gradient(135deg,#fb7185,#f97316)' },
  { id: 'fr-galaxy', name: 'Thiên hà', cost: 30, ring: 'linear-gradient(135deg,#7c3aed,#ec4899)' },
  { id: 'fr-rainbow', name: 'Cầu vồng', cost: 40, ring: 'conic-gradient(from 0deg,#f87171,#fbbf24,#34d399,#60a5fa,#a78bfa,#f87171)' },
];

export const AVATAR_EVENT = 'bhh:avatar';

const OWN_KEY = 'bhh_frames_owned_v1';
const EQUIP_KEY = 'bhh_frame_equipped_v1';

function readObj<T>(key: string): Record<string, T> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(key) || '{}');
  } catch {
    return {};
  }
}
function writeObj<T>(key: string, val: Record<string, T>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    /* ignore */
  }
}

export function getOwnedFrames(childId: number): string[] {
  return readObj<string[]>(OWN_KEY)[String(childId)] || [];
}
export function isFrameOwned(childId: number, frameId: string): boolean {
  return getOwnedFrames(childId).includes(frameId);
}

export function getEquippedFrame(childId: number): Frame | null {
  const id = readObj<string>(EQUIP_KEY)[String(childId)];
  return AVATAR_FRAMES.find((f) => f.id === id) || null;
}

/** Mua khung: trừ sao, ghi sở hữu. 'ok' | 'owned' | 'poor'. */
export function buyFrame(childId: number, frame: Frame): 'ok' | 'owned' | 'poor' {
  if (isFrameOwned(childId, frame.id)) return 'owned';
  if (!spendStars(childId, frame.cost)) return 'poor';
  const store = readObj<string[]>(OWN_KEY);
  const key = String(childId);
  store[key] = [...(store[key] || []), frame.id];
  writeObj(OWN_KEY, store);
  window.dispatchEvent(new CustomEvent(STARS_EVENT));
  return 'ok';
}

/** Đeo/gỡ khung (frameId=null để gỡ). Phát AVATAR_EVENT để avatar cập nhật ngay. */
export function equipFrame(childId: number, frameId: string | null) {
  const store = readObj<string>(EQUIP_KEY);
  const key = String(childId);
  if (frameId) store[key] = frameId;
  else delete store[key];
  writeObj(EQUIP_KEY, store);
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent(AVATAR_EVENT));
}
