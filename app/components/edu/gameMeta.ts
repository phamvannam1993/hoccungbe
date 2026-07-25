import type { Metadata } from 'next';
import { resolveGame } from './GameStructuredData';

/**
 * Metadata CHUẨN cho trang trò chơi — dựng từ gamesData (một nguồn), không nhồi từ khóa.
 * Title format: "Game {tên} – luyện {kỹ năng} cho bé | Bé Hay Học"
 *   vd: "Game Toán Bong Bóng Biển – luyện đếm số cho bé | Bé Hay Học"
 * OG dùng /og-home.jpg (ảnh per-game trước đây trỏ file không tồn tại → OG 404).
 */
export function gameSeoMeta(key: string): Metadata {
  const g = resolveGame(key);
  if (!g) return { title: 'Trò chơi cho bé | Bé Hay Học' };

  const benefit = g.skills?.[0] ? `luyện ${g.skills[0].toLowerCase()} cho bé` : 'vừa học vừa chơi';
  // Layout gốc đã có template "%s | Bé Hay Học" → title KHÔNG kèm brand (tránh lặp).
  const title = `Game ${g.title} – ${benefit}`;
  const ogTitle = `${title} | Bé Hay Học`; // OG tag riêng → thêm brand ở đây.
  const description = (g.description || g.shortDescription || '').replace(/\s+/g, ' ').trim();
  const url = `/tro-choi/${g.slug}`;
  const image = '/og-home.jpg';

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: ogTitle, description, url, type: 'website',
      siteName: 'Bé Hay Học', locale: 'vi_VN',
      images: [{ url: image, width: 1200, height: 630, alt: `${g.title} - Bé Hay Học` }],
    },
    twitter: { card: 'summary_large_image', title: ogTitle, description, images: [image] },
  };
}
