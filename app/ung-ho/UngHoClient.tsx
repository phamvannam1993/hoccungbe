'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Copy, Check, Coffee } from 'lucide-react';

/**
 * Thông tin ủng hộ. Đổi ở đây nếu thay tài khoản.
 * QR được sinh tự động bằng VietQR (img.vietqr.io) từ các trường dưới → luôn khớp
 * số tài khoản, không cần upload ảnh QR thủ công.
 * bankBin: mã BIN VietQR của ngân hàng (Techcombank = 970407, Vietcombank = 970436,
 * MB = 970422, BIDV = 970418, ACB = 970416, VPBank = 970432, VietinBank = 970415).
 */
const SUPPORT = {
  bankName: 'ACB',
  bankBin: '970416',
  accountNumber: '2471717',
  accountName: 'PHAM VAN NAM',
  note: 'UNG HO BE HAY HOC',
};

const accountRaw = SUPPORT.accountNumber.replace(/\s+/g, '');
const qrUrl = `https://img.vietqr.io/image/${SUPPORT.bankBin}-${accountRaw}-compact2.png?accountName=${encodeURIComponent(
  SUPPORT.accountName,
)}&addInfo=${encodeURIComponent(SUPPORT.note)}`;

function Row({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value.replace(/\s+/g, ' ').trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 py-3 last:border-0">
      <span className="text-sm font-semibold text-slate-400">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-right text-base font-black text-slate-800 sm:text-lg">{value}</span>
        <button
          type="button"
          onClick={copy}
          aria-label={`Chép ${label}`}
          className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-600"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
    </div>
  );
}

export default function UngHoClient() {
  return (
    <div className="mt-6 grid gap-5 lg:grid-cols-2">
      {/* Thẻ QR */}
      <div className="flex flex-col items-center rounded-[28px] border-4 border-emerald-100 bg-white p-6 text-center shadow-sm sm:p-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrUrl}
          alt={`Mã QR chuyển khoản ${SUPPORT.bankName} ủng hộ Bé Hay Học`}
          width={320}
          height={320}
          className="h-auto w-full max-w-[300px] rounded-2xl"
        />
        <p className="mt-4 text-base font-black text-slate-800">📷 Quét mã bằng ứng dụng ngân hàng</p>
        <p className="mt-1 text-sm font-semibold text-slate-400">
          Sau khi quét, bạn tự nhập số tiền muốn ủng hộ và kiểm tra lại thông tin trước khi chuyển.
        </p>
      </div>

      {/* Thẻ thông tin chuyển khoản */}
      <div className="rounded-[28px] border-4 border-sky-100 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-black uppercase tracking-widest text-sky-500">Thông tin chuyển khoản</p>
        <h2 className="mt-1 text-2xl font-black text-slate-800 kid-display sm:text-3xl">Ủng hộ Bé Hay Học</h2>

        <div className="mt-5">
          <Row label="Ngân hàng" value={SUPPORT.bankName} />
          <Row label="Số tài khoản" value={SUPPORT.accountNumber} />
          <Row label="Chủ tài khoản" value={SUPPORT.accountName} />
          <Row label="Nội dung gợi ý" value={SUPPORT.note} />
        </div>

        <p className="mt-5 leading-7 text-slate-500">
          Mỗi sự ủng hộ, dù nhỏ, đều là một lời động viên để chúng tôi tiếp tục chăm chút nội dung và trải nghiệm học cho các bé. 💚
        </p>

        <Link
          href="/"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-black text-white shadow-md transition hover:brightness-105"
        >
          <Coffee size={18} /> Quay lại học
        </Link>
      </div>
    </div>
  );
}
