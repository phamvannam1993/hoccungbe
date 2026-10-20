// Mã kích hoạt & quyền truy cập khóa học. CHỈ dùng phía server.
//
// Mã kích hoạt 6 ký tự chữ + số (vd K7M3QX), lưu trong api-hoccungbe (bảng iq_activation_codes): admin
//   tạo ở /admin/ma-kich-hoat, hoặc tự sinh khi phụ huynh bấm Mua (nội dung chuyển khoản = mã, admin
//   duyệt đơn ở /admin/don-hang-iq). Mỗi mã gắn với MỘT tài khoản (tài khoản nhập đầu tiên) và cho học
//   gói đó 1 tháng; mua tiếp khi còn hạn thì nối thêm 1 tháng.
//   Nhập mã: server gọi POST /api/iq-codes/redeem kèm Bearer token của phụ huynh + header x-khv-key.
//   Đăng nhập máy khác: GET /api/iq-codes/me lấy lại các gói còn hạn.
// Mã thử (data/test-codes.json) chỉ dùng được khi chưa chạy production
//   hoặc khi đặt KHV_ALLOW_TEST_CODES=1.
//
// Quyền truy cập lưu trong cookie httpOnly "khv_access" (tài khoản + slug → hạn, ký bằng KHV_SECRET),
// để trang server biết bài nào được mở mà không phải gọi API mỗi lần.

import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import testCodes from '../data/test-codes.json';
import { combos, courses, grades, slugsForPrefix } from './catalog';

export const ACCESS_COOKIE = 'khv_access';
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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

/** Server đã cấu hình KHV_SECRET (hoặc đang chạy dev) chưa. */
export function accessConfigured() {
  return secret() !== null;
}

function testCodesEnabled() {
  return process.env.NODE_ENV !== 'production' || process.env.KHV_ALLOW_TEST_CODES === '1';
}

/**
 * Mã dán từ tin nhắn có thể chứa dấu cách / gạch dài. Mã kiểu mới 6 ký tự ("K7M3QX") bỏ hết dấu ngăn;
 * mã cũ "L2K01-ABCDE-FGHJK" / mã thử "TEST-K01" giữ gạch nối (khớp normalizeCode ở api-hoccungbe).
 */
export function normalizeCode(input: string) {
  const n = input
    .trim()
    .toUpperCase()
    .replace(/[\s_–—.]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  const compact = n.replace(/-/g, '');
  return compact.length <= 8 && !n.startsWith('TEST-') ? compact : n;
}

/** Gói còn hạn trả về từ API: prefix → hạn cuối (ISO). */
type ApiAccess = { prefix: string; expiresAt: string }[];

/** slug → hạn dùng (ms). */
export type AccessMap = Record<string, number>;

const TEST_DAYS = 30;

/** Đổi danh sách gói (combo / khóa) còn hạn thành slug → hạn; trùng thì lấy hạn xa nhất. */
function toAccessMap(items: ApiAccess): AccessMap {
  const out: AccessMap = {};
  for (const it of items) {
    const exp = Date.parse(it.expiresAt);
    if (!Number.isFinite(exp)) continue;
    for (const slug of slugsForPrefix(it.prefix)) out[slug] = Math.max(out[slug] ?? 0, exp);
  }
  return out;
}

/** Đọc id tài khoản trong JWT (KHÔNG kiểm chữ ký — API mới là nơi xác thực; id chỉ để biết đổi tài khoản). */
export function tokenUserId(token: string): number | null {
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1] ?? '', 'base64url').toString('utf8'));
    const id = Number(payload?.sub);
    return Number.isInteger(id) && id > 0 ? id : null;
  } catch {
    return null;
  }
}

export type RedeemOutcome =
  | { ok: true; prefix: string; expiresAt: number; already: boolean; access: AccessMap }
  | { ok: false; reason: 'not_found' | 'revoked' | 'used_up' | 'pending' | 'unavailable' | 'login' };

/** Tài khoản (token) nhập mã: mã được gắn vào tài khoản, trả về các khóa còn hạn của tài khoản. */
export async function redeemCode(input: string, token: string): Promise<RedeemOutcome> {
  const code = normalizeCode(input);
  if (!/^[A-Z0-9]{4,8}$|^[A-Z0-9]{2,12}(-[A-Z0-9]{1,12}){1,3}$/.test(code)) return { ok: false, reason: 'not_found' };

  if (testCodesEnabled()) {
    const prefix = (testCodes.codes as Record<string, string>)[code];
    if (prefix) {
      const expiresAt = Date.now() + TEST_DAYS * 86400_000;
      return { ok: true, prefix, expiresAt, already: false, access: toAccessMap([{ prefix, expiresAt: new Date(expiresAt).toISOString() }]) };
    }
  }

  const key = process.env.KHV_API_KEY;
  if (!key) return { ok: false, reason: 'unavailable' };
  try {
    const res = await fetch(`${API}/api/iq-codes/redeem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-khv-key': key, Authorization: `Bearer ${token}` },
      body: JSON.stringify({ code }),
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });
    // 401 = token phụ huynh hết hạn / không hợp lệ (sai x-khv-key thì API trả 403 → báo bận).
    if (res.status === 401) return { ok: false, reason: 'login' };
    if (!res.ok) return { ok: false, reason: 'unavailable' };
    const data = (await res.json()) as { ok?: boolean; prefix?: string; reason?: string; expiresAt?: string; already?: boolean; access?: ApiAccess };
    if (data.ok && data.prefix) {
      // Mã hợp lệ nhưng khóa đã bị gỡ khỏi danh mục → coi như mã không còn dùng được.
      if (!slugsForPrefix(data.prefix).length) return { ok: false, reason: 'not_found' };
      return {
        ok: true,
        prefix: data.prefix,
        expiresAt: Date.parse(data.expiresAt ?? '') || Date.now(),
        already: !!data.already,
        access: toAccessMap(data.access ?? []),
      };
    }
    const reason = data.reason === 'revoked' || data.reason === 'used_up' || data.reason === 'pending' ? data.reason : 'not_found';
    return { ok: false, reason };
  } catch {
    return { ok: false, reason: 'unavailable' };
  }
}

/** Các khóa còn hạn của tài khoản trên API; null = token hết hạn; 'error' = API lỗi. */
export async function fetchAccount(token: string): Promise<AccessMap | null | 'error'> {
  try {
    const res = await fetch(`${API}/api/iq-codes/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
      signal: AbortSignal.timeout(6000),
    });
    if (res.status === 401) return null;
    if (!res.ok) return 'error';
    const data: unknown = await res.json();
    return Array.isArray(data) ? toAccessMap(data as ApiAccess) : 'error';
  } catch {
    return 'error';
  }
}

// ── Đơn mua (bấm "Mua" → tạo đơn kèm mã kích hoạt; admin duyệt → mã được kích hoạt) ──

export type Order = {
  code: string;
  prefix: string;
  title: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  adminNote: string | null;
  expiresAt: string | null;
  createdAt: string;
  /** payOS: trang thanh toán và chuỗi VietQR (có khi đã cấu hình payOS). */
  checkoutUrl?: string | null;
  qrCode?: string | null;
};

/** Tên + giá gói theo bảng giá phía web (không tin số tiền từ trình duyệt). */
export function packageInfo(prefix: string): { title: string; price: number } | null {
  const combo = combos.find((c) => c.codePrefix === prefix);
  if (combo) return { title: combo.title, price: combo.price };
  const c = courses.find((x) => x.codePrefix === prefix);
  if (!c) return null;
  const grade = grades.find((g) => g.id === c.grade)?.title ?? '';
  return { title: `Khóa ${c.number} ${grade.toLowerCase()}: ${c.title}`, price: c.price };
}

export type CreateOrderOutcome = { ok: true; order: Order } | { ok: false; reason: 'login' | 'unavailable' | 'invalid'; message?: string };

export async function createOrderOnApi(prefix: string, token: string): Promise<CreateOrderOutcome> {
  const info = packageInfo(prefix);
  if (!info) return { ok: false, reason: 'invalid' };
  const key = process.env.KHV_API_KEY;
  if (!key) return { ok: false, reason: 'unavailable' };
  try {
    const res = await fetch(`${API}/api/iq-orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-khv-key': key, Authorization: `Bearer ${token}` },
      body: JSON.stringify({ prefix, title: info.title, amount: info.price }),
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });
    if (res.status === 401) return { ok: false, reason: 'login' };
    const data = (await res.json().catch(() => ({}))) as Order & { message?: string | string[] };
    if (res.status === 400) return { ok: false, reason: 'invalid', message: Array.isArray(data.message) ? data.message[0] : data.message };
    if (!res.ok || !data.code) return { ok: false, reason: 'unavailable' };
    return { ok: true, order: data };
  } catch {
    return { ok: false, reason: 'unavailable' };
  }
}

/** Đơn của tài khoản; null = token hết hạn; 'error' = API lỗi. */
export async function fetchMyOrders(token: string): Promise<Order[] | null | 'error'> {
  try {
    const res = await fetch(`${API}/api/iq-orders/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
      signal: AbortSignal.timeout(6000),
    });
    if (res.status === 401) return null;
    if (!res.ok) return 'error';
    const data: unknown = await res.json();
    return Array.isArray(data) ? (data as Order[]) : 'error';
  } catch {
    return 'error';
  }
}

// ── Cookie quyền truy cập ──

/** u = id tài khoản, a = slug → hạn (ms), t = lần đồng bộ với API gần nhất (ms). */
export type AccessCookie = { u: number | null; a: AccessMap; t: number };

export function encodeAccess(data: AccessCookie): string | null {
  const key = secret();
  if (!key) return null;
  const payload = Buffer.from(JSON.stringify(data)).toString('base64url');
  return `${payload}.${hmac(key, payload)}`;
}

function decodeAccess(value: string | undefined): AccessCookie | null {
  const key = secret();
  if (!value || !key) return null;
  const [payload, sig] = value.split('.');
  if (!payload || !sig || !safeEqual(sig, hmac(key, payload))) return null;
  try {
    const d = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!d || typeof d !== 'object' || Array.isArray(d) || typeof d.a !== 'object' || !d.a) return null;
    const a: AccessMap = {};
    for (const [slug, exp] of Object.entries(d.a)) if (typeof exp === 'number') a[slug] = exp;
    return { u: typeof d.u === 'number' ? d.u : null, a, t: typeof d.t === 'number' ? d.t : 0 };
  } catch {
    return null;
  }
}

export async function readAccessCookie(): Promise<AccessCookie | null> {
  const store = await cookies();
  return decodeAccess(store.get(ACCESS_COOKIE)?.value);
}

/** slug → hạn (ms) của các khóa còn hạn. */
export async function getAccess(): Promise<AccessMap> {
  const now = Date.now();
  const c = await readAccessCookie();
  const out: AccessMap = {};
  for (const [slug, exp] of Object.entries(c?.a ?? {})) if (exp > now) out[slug] = exp;
  return out;
}

export async function getUnlockedSlugs(): Promise<string[]> {
  return Object.keys(await getAccess());
}

/** Ghi cookie; trả false nếu chưa cấu hình KHV_SECRET. */
export async function writeAccessCookie(data: AccessCookie): Promise<boolean> {
  const value = encodeAccess(data);
  if (!value) return false;
  const store = await cookies();
  store.set(ACCESS_COOKIE, value, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 400,
  });
  return true;
}

export async function clearAccessCookie() {
  const store = await cookies();
  store.delete(ACCESS_COOKIE);
}
