'use client';

/* eslint-disable @next/next/no-img-element -- ảnh admin upload (URL ngoài), cần co theo cỡ chữ & in được */
import { createContext, useContext, useState, type ReactNode } from 'react';
import { useVocabImages } from '../components/edu/utils/vocabImages';
import { phonicsImageKey, resolvePhonicsImage, type VocabFallback } from '../lib/phonicsWords';

// Map ảnh admin lấy MỘT lần ở PhonicsClient rồi chia qua context, để hàng trăm thẻ không mỗi
// thẻ tự gọi hook. fallback = khóa ảnh trang Từ vựng cùng từ (server dựng sẵn, xem phonicsWords.ts).
const Ctx = createContext<{ map: Record<string, string>; fallback: VocabFallback }>({ map: {}, fallback: {} });

export function PhonicsImagesProvider({ fallback, children }: { fallback: VocabFallback; children: ReactNode }) {
  const map = useVocabImages();
  return <Ctx.Provider value={{ map, fallback }}>{children}</Ctx.Provider>;
}

/** URL ảnh của một từ (ảnh riêng Phonics → ảnh Từ vựng), hoặc undefined → dùng emoji. */
export function usePhonicsImage(word: string): string | undefined {
  const { map, fallback } = useContext(Ctx);
  return resolvePhonicsImage(phonicsImageKey(word), map, fallback)?.url;
}

/**
 * Hình của một từ: ảnh admin nếu có, không thì emoji. Ảnh vuông 1em × 1em nên đặt đúng chỗ
 * emoji cũ (cỡ theo font-size của khung cha — kể cả đơn vị cqw trong thẻ in).
 */
export default function PhonicsPic({ word, emoji, className = '' }: { word: string; emoji: string; className?: string }) {
  const url = usePhonicsImage(word);
  const [broken, setBroken] = useState<string | null>(null); // URL ảnh lỗi → quay về emoji
  if (!url || broken === url) return <>{emoji}</>;
  return (
    <img
      src={url}
      alt={word}
      onError={() => setBroken(url)}
      className={`inline-block h-[1em] w-[1em] object-contain align-middle ${className}`}
      draggable={false}
    />
  );
}
