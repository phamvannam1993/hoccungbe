/**
 * Đường dẫn ảnh giao diện (bộ ảnh lấy từ app 3 Gốc, nằm ở public/khoa-hoc-vui/images).
 * Icon admin đã thay ở /admin/iq-icons (lưu trên API) được ưu tiên — xem IconOverrides.
 */
import { emojiKey } from './emoji';

let overrides: Record<string, string> = {};

/** Gọi từ IconOverrides (render trước mọi component dùng img) — cùng một bộ cho mọi người xem. */
export function setIconOverrides(map: Record<string, string>) {
  overrides = map;
}

export const defaultImg = (name: string) => `/khoa-hoc-vui/images/${name}`;

export const img = (name: string) => overrides[name] || defaultImg(name);

/** Ảnh admin đã upload thay cho một emoji trong nội dung bài (undefined = giữ emoji). */
export const emojiImg = (emoji: string): string | undefined => overrides[emojiKey(emoji)];
