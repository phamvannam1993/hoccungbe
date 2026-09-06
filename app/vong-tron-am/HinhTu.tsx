'use client';

import Image from 'next/image';
import { useState } from 'react';
import { khoaAnh } from '../lib/hinhTu';
import { useVocabImages, isImageUrl } from '../components/edu/utils/vocabImages';

// Ô hình của một từ. Thứ tự ưu tiên:
//   1. `anh` ghi thẳng trong dữ liệu    → dùng cho ảnh cố định, hiếm khi cần
//   2. ảnh admin tải lên ở /admin/am-van
//   3. emoji
//
// Vẫn giữ lối lùi về emoji ngay cả khi đã có URL: ảnh có thể bị xoá hoặc hỏng
// sau khi gán, và lúc đó bé phải thấy emoji chứ không phải một ô trống.

type Props = {
  tu: string;
  emoji: string;
  /** Đường dẫn ghi tay, ưu tiên hơn ảnh admin tải lên. */
  anh?: string;
  /** Cạnh ảnh gốc (px) — chỉ để next/image biết cỡ tải về, KHÔNG quyết định cỡ hiển thị. */
  co: number;
  /**
   * Cỡ hiển thị, đặt bằng class để đổi được theo màn hình
   * (vd "h-10 w-10 text-2xl sm:h-16 sm:w-16 sm:text-4xl").
   * Tách khỏi `co` vì trên điện thoại ô phải nhỏ lại, mà ảnh tải về thì không cần đổi.
   */
  lop?: string;
};

export default function HinhTu({ tu, emoji, anh, co, lop = '' }: Props) {
  const map = useVocabImages();
  const [loi, setLoi] = useState(false);

  // Ảnh ghi tay chấp nhận cả đường dẫn nội bộ ("/anh/bo.webp"); ảnh từ bảng thì
  // phải là URL đầy đủ, vì đó là thứ /api/upload/image trả về.
  const tuBang = map[khoaAnh(tu)];
  const nguon = anh || (isImageUrl(tuBang) ? tuBang : null);

  if (!nguon || loi)
    return <span className={`grid place-items-center leading-none ${lop}`} aria-hidden>{emoji}</span>;

  return (
    <Image
      src={nguon}
      alt={tu}
      width={co}
      height={co}
      className={`object-contain ${lop}`}
      onError={() => setLoi(true)}
    />
  );
}
