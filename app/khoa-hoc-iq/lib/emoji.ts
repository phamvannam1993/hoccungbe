/**
 * Emoji trong nội dung bài (🟥, 🍎, ⭐…) có thể được admin thay bằng ảnh ở /admin/iq-emoji.
 * Khóa lưu trên API = mã Unicode, bỏ ký tự biến thể FE0F: 🟥 → 'emoji-1f7e5', ❤️ → 'emoji-2764'.
 */

/** Một emoji hoàn chỉnh: ký tự hình (+ FE0F, màu da, nối ZWJ), cờ, hoặc phím số 1️⃣. */
export const EMOJI_SOURCE =
  '[0-9#*]\\uFE0F?\\u20E3|[\\u{1F1E6}-\\u{1F1FF}]{2}|\\p{Extended_Pictographic}\\uFE0F?[\\u{1F3FB}-\\u{1F3FF}]?(?:\\u200D\\p{Extended_Pictographic}\\uFE0F?[\\u{1F3FB}-\\u{1F3FF}]?)*';

export const emojiRegex = () => new RegExp(EMOJI_SOURCE, 'gu');

export const EMOJI_KEY_RE = /^emoji-[0-9a-f]{2,6}(?:-[0-9a-f]{2,6}){0,9}$/;

export function emojiKey(emoji: string) {
  const cps = [...emoji].map((c) => c.codePointAt(0)!).filter((cp) => cp !== 0xfe0f);
  return 'emoji-' + cps.map((cp) => cp.toString(16)).join('-');
}

/** Emoji đồng hồ đã được vẽ bằng SVG (xem Clock.tsx) nên không cần thay ảnh. */
export function isClockEmoji(emoji: string) {
  const cp = emoji.codePointAt(0) ?? 0;
  return cp >= 0x1f550 && cp <= 0x1f567;
}
