// Phòng thi đấu Sân chơi Trí tuệ: phòng mời bằng mã 6 ký tự, chơi không cần cùng lúc
// (mỗi bé vào làm 10 câu khi rảnh trong 48 giờ, server giữ lượt tốt nhất của mỗi tên).
// Đề sinh tại máy từ `seed` của phòng (buildRoomChallenge) nên mọi người cùng đề.

import { apiFetch } from './api';

export type RoomPlayer = { name: string; avatar?: string | null; score: number; correct: number; timeSec: number; rank: number };
export type RoomView = {
  code: string;
  title: string;
  hostName: string;
  grade: number;
  seed: string;
  expiresAt: string;
  expired: boolean;
  players: RoomPlayer[];
};

export const ROOM_CODE_LEN = 6;
// Bảng chữ của mã phòng: bỏ 0/O và 1/I cho bé đỡ nhầm.
const CODE_CHARS = /[^A-HJ-NP-Z2-9]/g;

/** Chuẩn hoá mã bé gõ: viết hoa, bỏ khoảng trắng/ký tự lạ, tối đa 6 ký tự. */
export function normalizeCode(raw: string): string {
  return raw.toUpperCase().replace(CODE_CHARS, '').slice(0, ROOM_CODE_LEN);
}

export type RoomErrorKind = 'not-ready' | 'not-found' | 'closed' | 'network' | 'other';
export class RoomError extends Error {
  constructor(public kind: RoomErrorKind, message: string) { super(message); }
}

export const NOT_READY_MSG = 'Phòng thi đấu chưa sẵn sàng. Bé quay lại sau nhé!';

// Phân loại lỗi từ apiFetch (nó ném Error(message) lấy từ body JSON của server).
function classify(e: unknown): RoomError {
  if (e instanceof RoomError) return e;
  const msg = e instanceof Error ? e.message : '';
  // Server chưa có route này (Nest trả "Cannot GET /api/..."): tính năng chưa triển khai.
  if (/^Cannot (GET|POST)\b/.test(msg) || msg === 'Lỗi 404') return new RoomError('not-ready', NOT_READY_MSG);
  if (/không tìm thấy phòng|mã phòng không đúng/i.test(msg)) return new RoomError('not-found', msg);
  if (/đã kết thúc|đã đủ người/i.test(msg)) return new RoomError('closed', msg);
  if (e instanceof TypeError) return new RoomError('network', 'Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại nhé!');
  // Lỗi phía máy chủ (5xx): không đưa chữ kỹ thuật cho bé đọc.
  if (/internal server error|^Lỗi 5\d\d$/i.test(msg)) return new RoomError('other', 'Phòng thi đấu đang bảo trì. Bé thử lại sau ít phút nhé!');
  return new RoomError('other', msg || 'Có lỗi xảy ra, thử lại nhé!');
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  try { return await apiFetch<T>(path, init); } catch (e) { throw classify(e); }
}

export function createRoom(hostName: string, grade: number, title?: string): Promise<RoomView> {
  return call<RoomView>('/challenge-rooms', {
    method: 'POST',
    body: JSON.stringify({ hostName, grade, ...(title?.trim() ? { title: title.trim() } : {}) }),
  });
}

export function getRoom(code: string): Promise<RoomView> {
  return call<RoomView>(`/challenge-rooms/${encodeURIComponent(code)}`);
}

export function submitRoom(
  code: string,
  run: { name: string; avatar?: string; score: number; correct: number; time: number },
): Promise<RoomView & { myRank: number }> {
  return call<RoomView & { myRank: number }>(`/challenge-rooms/${encodeURIComponent(code)}/submit`, {
    method: 'POST',
    body: JSON.stringify(run),
  });
}

// ── Phòng gần đây (trên máy này) để bé quay lại xem bảng điểm ──
const RECENT_KEY = 'bhh_sanchoi_rooms';
export type RecentRoom = { code: string; title: string; expiresAt: string };

export function recentRooms(): RecentRoom[] {
  if (typeof window === 'undefined') return [];
  try {
    const arr = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]') as RecentRoom[];
    const now = Date.now();
    return arr.filter((r) => new Date(r.expiresAt).getTime() > now);
  } catch { return []; }
}

export function rememberRoom(r: RoomView) {
  try {
    const list = [{ code: r.code, title: r.title, expiresAt: r.expiresAt }, ...recentRooms().filter((x) => x.code !== r.code)].slice(0, 8);
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch { /* ignore */ }
}

export function roomUrl(code: string): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}/san-choi-tri-tue/phong/${code}`;
}

export function shareText(room: Pick<RoomView, 'code' | 'title' | 'hostName'>): string {
  return `${room.hostName} mời bạn vào phòng thi đấu “${room.title}” trên Sân chơi Trí tuệ! Mã phòng: ${room.code} — ${roomUrl(room.code)}`;
}
