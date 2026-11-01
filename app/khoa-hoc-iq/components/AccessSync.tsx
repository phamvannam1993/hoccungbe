'use client';

import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { syncAccess } from '../actions';
import { getAccountToken } from '../lib/account';

const POLL_MS = 60 * 1000;

/**
 * Khóa học gắn với tài khoản: mở khu Toán IQ trên máy mới (đã đăng nhập) thì lấy lại các khóa
 * còn hạn; đăng xuất / đổi tài khoản (kể cả ở tab khác) thì khóa lại. Đang mở trang thì kiểm tra
 * lại mỗi phút và khi quay lại tab — admin duyệt đơn xong là khóa tự mở, không cần tải lại trang.
 */
export default function AccessSync() {
  const router = useRouter();
  const pathname = usePathname();
  // Trang khóa đang báo "cần mở khóa" (?mo-khoa=1) → hỏi API ngay, có thể vừa được duyệt.
  const needUnlock = useSearchParams().get('mo-khoa') === '1';

  useEffect(() => {
    let alive = true;
    const run = (force = false) =>
      syncAccess(getAccountToken(), force)
        .then((changed) => {
          if (alive && changed) router.refresh();
        })
        .catch(() => {});
    run(needUnlock);
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'bhh_token' || e.key === null) run(true);
    };
    const onVisible = () => {
      if (document.visibilityState === 'visible') run();
    };
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') run();
    }, POLL_MS);
    window.addEventListener('storage', onStorage);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      alive = false;
      clearInterval(timer);
      window.removeEventListener('storage', onStorage);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [router, pathname, needUnlock]);

  return null;
}
