// Tài khoản phụ huynh đăng nhập ở trang chính (/dang-nhap) — token lưu trong localStorage.

export type AccountUser = { id: number; fullName?: string; email?: string };

export function getAccountToken(): string | null {
  try {
    return localStorage.getItem('bhh_token');
  } catch {
    return null;
  }
}

export function getAccountUser(): AccountUser | null {
  try {
    const u = JSON.parse(localStorage.getItem('bhh_user') ?? 'null');
    return u && typeof u === 'object' ? (u as AccountUser) : null;
  } catch {
    return null;
  }
}

/** Link đăng nhập / đăng ký, xong quay lại đúng trang đang xem. */
export function authHref(kind: 'login' | 'register') {
  const next = typeof window === 'undefined' ? '/khoa-hoc-iq' : window.location.pathname + window.location.search;
  return `${kind === 'login' ? '/dang-nhap' : '/dang-ky'}?next=${encodeURIComponent(next)}`;
}
