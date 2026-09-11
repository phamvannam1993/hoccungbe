'use client';

import Image from 'next/image';
import { CAC_TO, vietTien } from '../lib/tienViet';

// Tờ tiền: ưu tiên ẢNH THẬT trong `public/tien-viet/`; tờ nào chưa có ảnh thì
// vẽ khối màu thay thế.
//
// Vẽ thay thế chứ không bỏ trống, vì bộ ảnh hiện thiếu 2.000, 100.000 và
// 200.000 đồng — thiếu ảnh mà vẫn học được thì hơn là vỡ giao diện.

export default function ToTienHinh({
  gia, chon = false, onBam, co = 'vua',
}: { gia: number; chon?: boolean; onBam?: () => void; co?: 'nho' | 'vua' }) {
  const t = CAC_TO.find((x) => x.gia === gia) ?? CAC_TO[0];
  // To hơn hẳn bản đầu (108/150) — cỡ cũ nhìn không rõ mặt tờ tiền, mà đây
  // chính là thứ bé cần nhận ra. Tỉ lệ 0,47 bám theo tờ tiền thật.
  const rong = co === 'nho' ? 168 : 260;
  const cao = Math.round(rong * 0.47);

  const noiDung = t.anh ? (
    <Image
      src={t.anh}
      alt={vietTien(gia)}
      width={rong}
      height={cao}
      // `object-contain`: hiện TRỌN tờ tiền, không cắt mép. Các file ảnh có tỉ
      // lệ hơi khác nhau nên tờ nào hụt thì để lọt nền trắng, còn hơn cắt mất
      // số mệnh giá ở góc.
      className="h-full w-full object-contain"
      sizes={`${rong}px`}
    />
  ) : (
    <>
      <span className="pointer-events-none absolute inset-1.5 rounded-lg border border-white/45" />
      <span className="pointer-events-none absolute inset-[7px] rounded-md border border-white/25" />
      <span className="absolute left-2 top-1.5 text-[9px] font-black tracking-wide" style={{ color: t.chu }}>
        VIỆT NAM
      </span>
      <span
        className={`absolute inset-0 grid place-items-center font-black ${co === 'nho' ? 'text-base' : 'text-xl'}`}
        style={{ color: t.chu }}
      >
        {gia.toLocaleString('vi-VN')}
      </span>
      <span className="absolute bottom-1.5 right-2 text-[9px] font-black" style={{ color: t.chu }}>
        ĐỒNG
      </span>
    </>
  );

  return (
    <button
      type="button"
      onClick={onBam}
      disabled={!onBam}
      aria-label={vietTien(gia)}
      // Có ảnh thật thì BỎ HẲN viền và bóng — để ảnh tờ tiền hiện nguyên vẹn,
      // viền vẽ thêm chỉ làm tờ tiền trông như bị đóng khung.
      className={`relative shrink-0 overflow-hidden transition ${
        t.anh ? 'rounded-lg' : 'rounded-xl border-2'} ${
        onBam ? 'cursor-pointer active:translate-y-0.5' : 'cursor-default'} ${
        chon ? 'ring-4 ring-emerald-400' : ''}`}
      style={{
        width: rong, height: cao,
        background: t.anh ? 'transparent' : `linear-gradient(135deg, ${t.mau} 0%, ${t.mau}dd 55%, ${t.mau} 100%)`,
        borderColor: t.anh ? undefined : t.chu,
        boxShadow: t.anh ? undefined : (chon ? `0 6px 0 ${t.chu}55` : `0 3px 0 ${t.chu}44`),
      }}
    >
      {noiDung}
    </button>
  );
}
