// Lấy danh sách icon admin đã thay từ api-hoccungbe (GET /api/iq-icons). CHỈ dùng phía server.
import { ICON_KEYS } from './iconRegistry';
import { EMOJI_KEY_RE } from './emoji';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
export const ICONS_TAG = 'iq-icons';

export async function getIconOverrides(): Promise<Record<string, string>> {
  try {
    const res = await fetch(`${API}/api/iq-icons`, {
      next: { revalidate: 300, tags: [ICONS_TAG] },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return {};
    const data: unknown = await res.json();
    if (!data || typeof data !== 'object' || Array.isArray(data)) return {};
    // Chỉ nhận icon có trong danh mục (hoặc emoji) và URL http(s) — API trục trặc thì dùng ảnh mặc định.
    const out: Record<string, string> = {};
    for (const [key, url] of Object.entries(data as Record<string, unknown>)) {
      if ((ICON_KEYS.has(key) || EMOJI_KEY_RE.test(key)) && typeof url === 'string' && /^https?:\/\//.test(url)) out[key] = url;
    }
    return out;
  } catch {
    return {};
  }
}
