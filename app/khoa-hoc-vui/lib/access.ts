// Mã kích hoạt & quyền truy cập khóa học. CHỈ dùng phía server.
//
// Mã kích hoạt: <TIỀN TỐ>-<6 ký tự ngẫu nhiên>-<12 ký tự chữ ký>, ví dụ L2K01-7KQ2MX-1A2B3C4D5E6F.
//   Chữ ký = HMAC-SHA256(KHV_SECRET, "<TIỀN TỐ>-<ngẫu nhiên>"), nên không cần CSDL để kiểm tra.
//   Tạo mã bằng: node scripts/tao-ma-kich-hoat.mjs L2K01 20
// Mã thử (data/test-codes.json) chỉ dùng được khi chưa chạy production
//   hoặc khi đặt KHV_ALLOW_TEST_CODES=1.
//
// Quyền truy cập lưu trong cookie httpOnly "khv_access" (danh sách slug + chữ ký).

import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import testCodes from '../data/test-codes.json';
import { slugsForPrefix } from './catalog';

export const ACCESS_COOKIE = 'khv_access';

function secret(): string | null {
  if (process.env.KHV_SECRET) return process.env.KHV_SECRET;
  return process.env.NODE_ENV === 'production' ? null : 'khv-dev-secret';
}

function hmac(key: string, data: string) {
  return createHmac('sha256', key).update(data).digest('hex');
}

function safeEqual(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

export function signCode(prefix: string, random: string, key: string) {
  return hmac(key, `${prefix}-${random}`).slice(0, 12).toUpperCase();
}

/** Server đã cấu hình KHV_SECRET (hoặc đang chạy dev) chưa. */
export function accessConfigured() {
  return secret() !== null;
}

function testCodesEnabled() {
  return process.env.NODE_ENV !== 'production' || process.env.KHV_ALLOW_TEST_CODES === '1';
}

/** Trả về danh sách slug khóa học mà mã mở được (rỗng nếu mã sai). */
export function redeemCode(input: string): string[] {
  // Mã dán từ tin nhắn có thể chứa dấu cách / gạch dài thay cho gạch nối.
  const code = input
    .trim()
    .toUpperCase()
    .replace(/[\s_–—]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  if (testCodesEnabled()) {
    const prefix = (testCodes.codes as Record<string, string>)[code];
    if (prefix) return slugsForPrefix(prefix);
  }

  const key = secret();
  const m = /^([A-Z0-9]+)-([A-Z0-9]{6})-([A-F0-9]{12})$/.exec(code);
  if (!key || !m) return [];
  const [, prefix, random, sig] = m;
  if (!safeEqual(sig, signCode(prefix, random, key))) return [];
  return slugsForPrefix(prefix);
}

// ── Cookie quyền truy cập ──

export function encodeAccess(slugs: string[]): string | null {
  const key = secret();
  if (!key) return null;
  const payload = Buffer.from(JSON.stringify([...new Set(slugs)].sort())).toString('base64url');
  return `${payload}.${hmac(key, payload)}`;
}

function decodeAccess(value: string | undefined): string[] {
  const key = secret();
  if (!value || !key) return [];
  const [payload, sig] = value.split('.');
  if (!payload || !sig || !safeEqual(sig, hmac(key, payload))) return [];
  try {
    const slugs = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return Array.isArray(slugs) ? slugs.map(String) : [];
  } catch {
    return [];
  }
}

export async function getUnlockedSlugs(): Promise<string[]> {
  const store = await cookies();
  return decodeAccess(store.get(ACCESS_COOKIE)?.value);
}
