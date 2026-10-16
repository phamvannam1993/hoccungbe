'use server';

import { cookies, headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { ACCESS_COOKIE, accessConfigured, encodeAccess, getUnlockedSlugs, redeemCode } from './lib/access';
import { getCourse } from './lib/catalog';

export type ActivateState = { ok: boolean; message: string } | null;

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
  if (!code.trim()) return { ok: false, message: 'Vui lòng nhập mã kích hoạt.' };
  if (!accessConfigured()) return { ok: false, message: 'Hệ thống chưa cấu hình KHV_SECRET, chưa thể kích hoạt.' };

  const ip = await clientIp();
  const now = Date.now();
  // Không biết IP (chưa qua proxy gắn x-forwarded-for) thì không khóa, tránh một người làm khóa tất cả.
  const f = ip ? fails.get(ip) : undefined;
  if (f && f.resetAt > now && f.count >= MAX_FAILS) {
    return { ok: false, message: 'Bố mẹ nhập sai nhiều lần quá. Vui lòng thử lại sau 15 phút nhé.' };
  }

  const slugs = redeemCode(code);
  if (slugs.length === 0) {
    if (!ip) return { ok: false, message: 'Mã kích hoạt không đúng. Bố mẹ kiểm tra lại giúp con nhé!' };
    const cur = f && f.resetAt > now ? f : { count: 0, resetAt: now + WINDOW_MS };
    cur.count += 1;
    if (fails.size > 5000) for (const [k, v] of fails) if (v.resetAt <= now) fails.delete(k);
    fails.set(ip, cur);
    return { ok: false, message: 'Mã kích hoạt không đúng. Bố mẹ kiểm tra lại giúp con nhé!' };
  }
  if (ip) fails.delete(ip);

  const current = await getUnlockedSlugs();
  const value = encodeAccess([...current, ...slugs]);
  if (!value) return { ok: false, message: 'Hệ thống chưa cấu hình KHV_SECRET, chưa thể kích hoạt.' };

  const store = await cookies();
  store.set(ACCESS_COOKIE, value, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 365 * 2,
  });
  revalidatePath('/khoa-hoc-vui', 'layout');

  const names = slugs.map((s) => getCourse(s)?.title).filter(Boolean);
  const label = names.length > 2 ? `${names.length} khóa học` : names.join(', ');
  return { ok: true, message: `Kích hoạt thành công: ${label}. Chúc bé học vui!` };
}
