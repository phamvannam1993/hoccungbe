'use client';

import { setIconOverrides } from '../lib/assets';

/**
 * Nạp bản đồ icon đã thay (từ API) trước khi các component con gọi img().
 * Đặt ngay trong render (không dùng effect) để server và trình duyệt vẽ cùng một ảnh.
 */
export default function IconOverrides({ icons, children }: { icons: Record<string, string>; children: React.ReactNode }) {
  setIconOverrides(icons);
  return <>{children}</>;
}
