'use server';

import { updateTag } from 'next/cache';
import { ICONS_TAG } from '../../khoa-hoc-iq/lib/icons-server';

/** Gọi sau khi upload / khôi phục icon để khu Toán IQ lấy ngay bản mới (không chờ cache 5 phút). */
export async function refreshIqIcons() {
  updateTag(ICONS_TAG);
}
