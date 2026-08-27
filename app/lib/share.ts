import { SITE_URL } from './seo';

/**
 * Chia sẻ thành tích của bé → link có preview mạng xã hội đẹp (OG động) để lan truyền.
 * Dữ liệu nhét thẳng vào đường dẫn: /khoe/{kind}/{name}/{title} (mỗi phần
 * encodeURIComponent). Không có dữ liệu nhạy cảm — chỉ tên hiển thị + tên thành tích.
 */

export type ShareKind = 'huy-hieu' | 'dau-truong' | 'khoa-hoc' | 'chuoi-ngay' | 'bao-cao';

export const SHARE_META: Record<ShareKind, { emoji: string; label: string }> = {
  'huy-hieu': { emoji: '🏅', label: 'đạt huy hiệu' },
  'dau-truong': { emoji: '🏆', label: 'thi đấu' },
  'khoa-hoc': { emoji: '🎓', label: 'hoàn thành' },
  'chuoi-ngay': { emoji: '🔥', label: 'giữ chuỗi ngày học' },
  'bao-cao': { emoji: '📊', label: 'có tuần học chăm' },
};

export function buildSharePath(kind: ShareKind, name: string, title: string): string {
  const parts = [kind, name || 'Bé', title].map((s) => encodeURIComponent(s));
  return `/khoe/${parts.join('/')}`;
}

export function buildShareUrl(kind: ShareKind, name: string, title: string): string {
  return `${SITE_URL}${buildSharePath(kind, name, title)}`;
}

/**
 * Mở hộp chia sẻ hệ thống (mobile) hoặc copy link (desktop). Trả về 'shared' | 'copied' | 'fail'.
 */
export async function shareAchievement(kind: ShareKind, name: string, title: string): Promise<'shared' | 'copied' | 'fail'> {
  const url = buildShareUrl(kind, name, title);
  const nm = name || 'Bé';
  const text = `${nm} vừa ${SHARE_META[kind].label} "${title}" trên Bé Hay Học! Cùng cho bé học miễn phí nhé 👉`;

  // 1) Web Share API (điện thoại) — hộp chia sẻ hệ thống.
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({ title: 'Bé Hay Học', text, url });
      return 'shared';
    } catch (e) {
      // Người dùng bấm huỷ → coi như xong, không báo lỗi.
      if (e && (e as { name?: string }).name === 'AbortError') return 'shared';
      // Lỗi khác → rơi xuống copy.
    }
  }

  // 2) Clipboard API (máy tính / trình duyệt không có Web Share).
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(`${text} ${url}`);
      return 'copied';
    }
  } catch {
    /* rơi xuống fallback */
  }

  // 3) Fallback cuối: hiện link để copy tay (đảm bảo luôn có gì đó xảy ra).
  try {
    if (typeof window !== 'undefined' && typeof window.prompt === 'function') {
      window.prompt('Sao chép link này để chia sẻ:', url);
      return 'copied';
    }
  } catch {
    /* ignore */
  }
  return 'fail';
}

/** URL chia sẻ nhanh lên Facebook (mở tab mới) — nút dự phòng đáng tin cho máy tính. */
export function facebookShareUrl(kind: ShareKind, name: string, title: string): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(buildShareUrl(kind, name, title))}`;
}
