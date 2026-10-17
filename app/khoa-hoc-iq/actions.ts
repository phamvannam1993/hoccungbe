'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import {
  accessConfigured,
  clearAccessCookie,
  createOrderOnApi,
  fetchAccount,
  fetchMyOrders,
  normalizeCode,
  type Order,
  readAccessCookie,
  redeemCode,
  tokenUserId,
  writeAccessCookie,
} from './lib/access';
import { getCourse, slugsForPrefix } from './lib/catalog';

export type ActivateState = { ok: boolean; message: string; needLogin?: boolean } | null;

const fmtDate = (ms: number) =>
  new Date(ms).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Ho_Chi_Minh' });

// Chống dò mã: mỗi IP tối đa MAX_FAILS lần nhập sai trong WINDOW_MS (lưu trong bộ nhớ tiến trình).
const MAX_FAILS = 10;
const WINDOW_MS = 15 * 60 * 1000;
const fails = new Map<string, { count: number; resetAt: number }>();

async function clientIp() {
  const h = await headers();
  return h.get('x-forwarded-for')?.split(',')[0].trim() || h.get('x-real-ip') || null;
}

export async function activateCode(_prev: ActivateState, formData: FormData): Promise<ActivateState> {
  const code = String(formData.get('code') ?? '').slice(0, 64);
  const token = String(formData.get('token') ?? '').slice(0, 2048);
  if (!code.trim()) return { ok: false, message: 'Vui lòng nhập mã kích hoạt.' };
  const userId = token ? tokenUserId(token) : null;
  if (!userId) return { ok: false, needLogin: true, message: 'Bố mẹ đăng nhập tài khoản trước khi nhập mã nhé. Mã sẽ được gắn với tài khoản.' };
  if (!accessConfigured()) return { ok: false, message: 'Hệ thống chưa cấu hình KHV_SECRET, chưa thể kích hoạt.' };

  const ip = await clientIp();
  const now = Date.now();
  // Không biết IP (chưa qua proxy gắn x-forwarded-for) thì không khóa, tránh một người làm khóa tất cả.
  const f = ip ? fails.get(ip) : undefined;
  if (f && f.resetAt > now && f.count >= MAX_FAILS) {
    return { ok: false, message: 'Bố mẹ nhập sai nhiều lần quá. Vui lòng thử lại sau 15 phút nhé.' };
  }

  const outcome = await redeemCode(code, token);
  if (!outcome.ok && outcome.reason === 'login') {
    return { ok: false, needLogin: true, message: 'Phiên đăng nhập đã hết hạn. Bố mẹ đăng nhập lại rồi nhập mã nhé.' };
  }
  if (!outcome.ok && outcome.reason === 'unavailable') {
    return { ok: false, message: 'Hệ thống kích hoạt đang bận. Bố mẹ thử lại sau ít phút nhé.' };
  }
  if (!outcome.ok && outcome.reason === 'pending') {
    return { ok: false, message: 'Mã này đang chờ admin xác nhận chuyển khoản. Duyệt xong khóa học sẽ tự mở, bố mẹ không cần nhập mã nhé.' };
  }
  if (!outcome.ok && outcome.reason !== 'not_found') {
    return {
      ok: false,
      message:
        outcome.reason === 'used_up'
          ? 'Mã này đã được kích hoạt cho một tài khoản khác. Bố mẹ liên hệ hỗ trợ nếu cần nhé.'
          : 'Mã này đã bị thu hồi. Bố mẹ liên hệ hỗ trợ nếu cần nhé.',
    };
  }
  if (!outcome.ok) {
    if (!ip) return { ok: false, message: 'Mã kích hoạt không đúng. Bố mẹ kiểm tra lại giúp con nhé!' };
    const cur = f && f.resetAt > now ? f : { count: 0, resetAt: now + WINDOW_MS };
    cur.count += 1;
    if (fails.size > 5000) for (const [k, v] of fails) if (v.resetAt <= now) fails.delete(k);
    fails.set(ip, cur);
    return { ok: false, message: 'Mã kích hoạt không đúng. Bố mẹ kiểm tra lại giúp con nhé!' };
  }
  if (ip) fails.delete(ip);

  // Cookie = toàn bộ khóa còn hạn của tài khoản (API trả về), giữ thêm khóa từ mã thử nếu cùng tài khoản.
  const prev = await readAccessCookie();
  const access = prev?.u === userId ? { ...prev.a } : {};
  for (const [slug, exp] of Object.entries(outcome.access)) access[slug] = Math.max(access[slug] ?? 0, exp);
  if (!(await writeAccessCookie({ u: userId, a: access, t: Date.now() }))) {
    return { ok: false, message: 'Hệ thống chưa cấu hình KHV_SECRET, chưa thể kích hoạt.' };
  }
  revalidatePath('/khoa-hoc-iq', 'layout');

  const slugs = slugsForPrefix(outcome.prefix);
  const names = slugs.map((s) => getCourse(s)?.title).filter(Boolean);
  const label = names.length > 2 ? `trọn ${names.length} khóa` : names.join(', ');
  const until = fmtDate(Math.max(...slugs.map((s) => access[s] ?? outcome.expiresAt)));
  if (outcome.already) return { ok: true, message: `Mã này đã được kích hoạt cho tài khoản của bố mẹ từ trước: ${label}, học đến hết ngày ${until}.` };
  return { ok: true, message: `Kích hoạt thành công: ${label}. Bé học được đến hết ngày ${until}. Chúc bé học vui!` };
}

/** Đồng bộ lại sau ngần này thời gian (admin vừa duyệt đơn, gia hạn / thu hồi ở máy khác, khóa hết hạn). */
const SYNC_EVERY_MS = 60 * 1000;

/**
 * Gọi từ trình duyệt khi mở khu /khoa-hoc-iq: đăng nhập máy mới → lấy lại các khóa của tài khoản;
 * đổi tài khoản / đăng xuất → bỏ quyền của tài khoản cũ. Trả true nếu quyền thay đổi (cần tải lại trang).
 */
export async function syncAccess(token: string | null, force = false): Promise<boolean> {
  const prev = await readAccessCookie();
  const userId = token ? tokenUserId(token.slice(0, 2048)) : null;
  if (!userId) {
    if (!prev) return false;
    await clearAccessCookie();
    revalidatePath('/khoa-hoc-iq', 'layout');
    return Object.keys(prev.a).length > 0;
  }
  if (!force && prev?.u === userId && Date.now() - prev.t < SYNC_EVERY_MS) return false;

  const account = await fetchAccount(token!);
  if (account === 'error') return false; // API trục trặc → giữ nguyên quyền đang có.
  if (account === null) {
    // Token hết hạn: coi như đăng xuất.
    if (!prev) return false;
    await clearAccessCookie();
    revalidatePath('/khoa-hoc-iq', 'layout');
    return Object.keys(prev.a).length > 0;
  }
  const before = prev?.u === userId ? JSON.stringify(Object.keys(prev.a).sort()) : '';
  if (!(await writeAccessCookie({ u: userId, a: account, t: Date.now() }))) return false;
  const changed = before !== JSON.stringify(Object.keys(account).sort());
  if (changed) revalidatePath('/khoa-hoc-iq', 'layout');
  return changed;
}

// ── Đơn mua ──

export type OrderState =
  | { ok: true; order: Order }
  | { ok: false; needLogin?: boolean; message: string };

/** Bấm "Mua": tạo đơn chờ duyệt kèm mã kích hoạt (cũng là nội dung chuyển khoản). Giá tính ở server. */
export async function createOrder(prefix: string, token: string | null): Promise<OrderState> {
  if (!token || !tokenUserId(token.slice(0, 2048))) {
    return { ok: false, needLogin: true, message: 'Bố mẹ đăng nhập tài khoản để mua khóa học nhé. Khóa học sẽ gắn với tài khoản.' };
  }
  const res = await createOrderOnApi(String(prefix).slice(0, 12), token.slice(0, 2048));
  if (res.ok) return res;
  if (res.reason === 'login') return { ok: false, needLogin: true, message: 'Phiên đăng nhập đã hết hạn. Bố mẹ đăng nhập lại nhé.' };
  if (res.reason === 'invalid') return { ok: false, message: res.message || 'Gói học không hợp lệ.' };
  return { ok: false, message: 'Hệ thống đang bận, bố mẹ thử lại sau ít phút nhé.' };
}

/**
 * Kiểm tra đơn: đã duyệt thì cập nhật quyền học ngay (không chờ 10 phút đồng bộ).
 * Trả về đơn mới nhất; `unlocked` = vừa mở khóa (cần tải lại trang).
 */
export async function checkOrder(code: string, token: string | null): Promise<{ order: Order | null; unlocked: boolean }> {
  if (!token) return { order: null, unlocked: false };
  const list = await fetchMyOrders(token.slice(0, 2048));
  if (!Array.isArray(list)) return { order: null, unlocked: false };
  const order = list.find((o) => o.code === normalizeCode(code)) ?? null;
  if (order?.status !== 'approved') return { order, unlocked: false };
  const changed = await syncAccess(token, true);
  return { order, unlocked: changed };
}
