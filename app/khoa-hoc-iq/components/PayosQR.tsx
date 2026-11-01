'use client';

/* eslint-disable @next/next/no-img-element -- ảnh QR tạo tại chỗ (data URL) */
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

/** Vẽ chuỗi VietQR của payOS thành ảnh QR. */
export default function PayosQR({ value, size = 200 }: { value: string; size?: number }) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    QRCode.toDataURL(value, { width: size * 2, margin: 1, errorCorrectionLevel: 'M' })
      .then((url) => alive && setSrc(url))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [value, size]);
  return src ? (
    <img src={src} alt="Mã QR thanh toán" width={size} height={size} className="rounded-xl bg-white" />
  ) : (
    <div style={{ width: size, height: size }} className="animate-pulse rounded-xl bg-slate-100" />
  );
}
