'use client';

import { createContext, useActionState, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { activateCode, checkOrder, createOrder, type ActivateState, type OrderState } from '../actions';
import type { ShopInfo } from '../lib/types';
import { img } from '../lib/assets';
import PayosQR from './PayosQR';
import { authHref, getAccountToken, getAccountUser } from '../lib/account';

export type BuyTarget = { title: string; price: number; codePrefix: string };

type ShopCtx = { openBuy: (t: BuyTarget) => void; openActivate: () => void };

const Ctx = createContext<ShopCtx>({ openBuy: () => {}, openActivate: () => {} });

export const useShop = () => useContext(Ctx);

export const formatVnd = (n: number) => `${n.toLocaleString('vi-VN')}đ`;

/** Thời hạn mỗi gói (khớp IQ_ACCESS_MONTHS ở api-hoccungbe). */
export const ACCESS_LABEL = '1 tháng';

/** dd/mm/yyyy theo giờ Việt Nam (server và trình duyệt ra cùng một chuỗi). */
export const formatDate = (ms: number) =>
  new Date(ms).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Ho_Chi_Minh' });

export default function ShopProvider({ shop, children }: { shop: ShopInfo; children: React.ReactNode }) {
  const [buy, setBuy] = useState<BuyTarget | null>(null);
  const [activate, setActivate] = useState(false);

  return (
    <Ctx.Provider value={{ openBuy: setBuy, openActivate: () => setActivate(true) }}>
      {children}
      {buy && (
        <BuyModal
          shop={shop}
          target={buy}
          onClose={() => setBuy(null)}
          onActivate={() => {
            setBuy(null);
            setActivate(true);
          }}
        />
      )}
      {activate && <ActivateModal onClose={() => setActivate(false)} />}
    </Ctx.Provider>
  );
}

function Modal({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div
        className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-[22px] bg-white p-6 pt-8 shadow-[0_6px_20px_rgba(0,0,0,0.1)] sm:rounded-[22px]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button type="button" onClick={onClose} className="absolute right-3 top-3" aria-label="Đóng">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img('icon_close_menu.png')} alt="" className="h-9 w-9" />
        </button>
        {children}
      </div>
    </div>
  );
}

/** Nội dung chuyển khoản = mã kích hoạt (mã cũ có gạch nối thì đổi sang dấu cách — nhiều ngân hàng bỏ "-"). */
const transferNote = (code: string) => code.replace(/-/g, ' ');

const POLL_MS = 10_000;
/** Có payOS (tự xác nhận) → kiểm tra dày hơn để khóa mở ngay sau khi chuyển khoản. */
const POLL_PAYOS_MS = 5_000;

function BuyModal({ shop, target, onClose, onActivate }: { shop: ShopInfo; target: BuyTarget; onClose: () => void; onActivate: () => void }) {
  const router = useRouter();
  // Modal chỉ mở khi bấm nút (không render ở server) nên đọc localStorage ngay được.
  const [token] = useState(() => getAccountToken());
  const [state, setState] = useState<OrderState | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [copied, setCopied] = useState(false);

  // Bấm "Mua" → tạo (hoặc lấy lại) đơn chờ duyệt kèm mã kích hoạt.
  useEffect(() => {
    if (!token) return;
    let alive = true;
    createOrder(target.codePrefix, token)
      .then((r) => {
        if (!alive) return;
        setState(r);
        // Có payOS → sang thẳng trang thanh toán payOS (thanh toán xong payOS đưa về site, PaymentReturn mở khóa).
        if (r.ok && r.order.status === 'pending' && r.order.checkoutUrl) window.location.assign(r.order.checkoutUrl);
      })
      .catch(() => alive && setState({ ok: false, message: 'Hệ thống đang bận, bố mẹ thử lại sau ít phút nhé.' }));
    return () => {
      alive = false;
    };
  }, [token, target.codePrefix]);

  const order = state?.ok ? state.order : null;
  const pending = order?.status === 'pending';

  // Đơn đang chờ: tự kiểm tra định kỳ, admin duyệt là mở khóa ngay.
  useEffect(() => {
    if (!pending || !order || !token) return;
    let alive = true;
    const timer = setInterval(() => {
      checkOrder(order.code, token)
        .then((r) => {
          if (!alive || !r.order || r.order.status === 'pending') return;
          setState({ ok: true, order: r.order });
          if (r.order.status === 'approved') {
            setUnlocked(true);
            router.refresh();
          }
        })
        .catch(() => {});
    }, order.qrCode || order.checkoutUrl ? POLL_PAYOS_MS : POLL_MS);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [pending, order, token, router]);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const header = (
    <>
      <p className="mr-8 rounded-[30px] bg-[#1ea3cf] py-2 text-center text-sm font-extrabold text-white">MUA KHÓA HỌC</p>
      <h2 className="mt-4 text-xl font-black text-slate-800">{order?.title ?? target.title}</h2>
      <p className="text-2xl font-black text-[#e34a4a]">
        {formatVnd(order?.amount ?? target.price)} <span className="text-base font-bold text-slate-500">/ {ACCESS_LABEL}</span>
      </p>
    </>
  );

  if (!token || (state && !state.ok && state.needLogin)) {
    return (
      <Modal onClose={onClose}>
        {header}
        <div className="mt-5 text-center">
          <p className="font-bold text-slate-700">{state && !state.ok ? state.message : 'Bố mẹ đăng nhập tài khoản để mua khóa học nhé.'}</p>
          <p className="mt-2 text-sm text-slate-500">Khóa học gắn với tài khoản: đăng nhập trên điện thoại, máy tính bảng hay máy tính đều học được.</p>
          <a href={authHref('login')} className="khv-btn-buy mt-5 block w-full">
            ĐĂNG NHẬP
          </a>
          <a href={authHref('register')} className="mt-3 block text-sm font-bold text-sky-600 underline">
            Chưa có tài khoản? Đăng ký miễn phí
          </a>
        </div>
      </Modal>
    );
  }

  if (!state || (state.ok && state.order.status === 'pending' && state.order.checkoutUrl)) {
    return (
      <Modal onClose={onClose}>
        {header}
        <p className="mt-6 flex items-center justify-center gap-2 text-center font-bold text-slate-600">
          <span className="khv-pulse inline-block h-2.5 w-2.5 rounded-full bg-sky-500" />
          {state ? 'Đang chuyển sang trang thanh toán payOS…' : 'Đang tạo đơn…'}
        </p>
        {state?.ok && state.order.checkoutUrl && (
          <a href={state.order.checkoutUrl} className="mt-4 block text-center text-sm font-bold text-sky-600 underline">
            Không tự chuyển? Bấm vào đây
          </a>
        )}
      </Modal>
    );
  }

  if (!state.ok || !order) {
    return (
      <Modal onClose={onClose}>
        {header}
        <p className="mt-5 rounded-2xl bg-rose-50 p-4 text-sm font-semibold text-rose-600">{!state.ok ? state.message : ''}</p>
      </Modal>
    );
  }

  if (order.status === 'approved') {
    return (
      <Modal onClose={onClose}>
        {header}
        <div className="mt-5 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img('icon_tab3.png')} alt="" className="mx-auto h-28" />
          <p className="mt-3 font-bold text-lime-700">
            🎉 Đã kích hoạt mã {order.code}
            {order.expiresAt ? `, bé học được đến hết ngày ${formatDate(Date.parse(order.expiresAt))}` : ''}.
          </p>
          <button type="button" onClick={onClose} className="khv-btn-buy mt-5 w-full">
            {unlocked ? 'Vào học ngay' : 'Đóng'}
          </button>
        </div>
      </Modal>
    );
  }

  if (order.status !== 'pending') {
    return (
      <Modal onClose={onClose}>
        {header}
        <p className="mt-5 rounded-2xl bg-rose-50 p-4 text-sm font-semibold text-rose-600">
          Đơn {order.code} {order.status === 'rejected' ? 'chưa được duyệt' : 'đã hủy'}
          {order.adminNote ? `: ${order.adminNote}` : '.'} Bố mẹ liên hệ Zalo {shop.zalo} để được hỗ trợ nhé.
        </p>
      </Modal>
    );
  }

  const note = transferNote(order.code);

  // payOS: QR + trang thanh toán; tiền về là khóa tự mở (không cần admin).
  if (order.qrCode || order.checkoutUrl) {
    return (
      <Modal onClose={onClose}>
        {header}
        <div className="mt-4 flex flex-col items-center rounded-2xl bg-slate-50 p-4 text-center">
          {order.qrCode && <PayosQR value={order.qrCode} size={200} />}
          <p className="mt-3 text-sm font-bold text-slate-700">Quét mã bằng app ngân hàng bất kỳ — đã điền sẵn số tiền và nội dung.</p>
          <p className="mt-1 text-xs text-slate-500">
            Nội dung chuyển khoản: <b className="font-mono text-sky-700">{note}</b> (cũng là mã kích hoạt)
          </p>
          {order.checkoutUrl && (
            <a href={order.checkoutUrl} target="_blank" rel="noopener noreferrer" className="khv-btn-active mt-4 block w-full px-4 text-center">
              Mở trang thanh toán payOS
            </a>
          )}
        </div>
        <p className="mt-4 text-center text-sm text-slate-600">
          Chuyển khoản xong, khóa học <b>tự mở trong vài giây</b> — học {ACCESS_LABEL} tính từ lúc kích hoạt. Không cần gửi ảnh chuyển khoản.
        </p>
        <p className="mt-3 flex items-center justify-center gap-2 rounded-2xl bg-amber-50 py-2 text-sm font-bold text-amber-700">
          <span className="khv-pulse inline-block h-2 w-2 rounded-full bg-amber-500" /> Đang chờ thanh toán…
        </p>
        <p className="mt-3 text-center text-xs text-slate-400">
          Cần hỗ trợ? Zalo{' '}
          <a href={`https://zalo.me/${shop.zalo}`} target="_blank" rel="noreferrer" className="font-bold text-sky-600 underline">
            {shop.zalo}
          </a>
        </p>
      </Modal>
    );
  }

  const qr = `https://img.vietqr.io/image/${shop.bankId}-${shop.accountNumber}-compact2.png?amount=${order.amount}&addInfo=${encodeURIComponent(note)}&accountName=${encodeURIComponent(shop.accountName)}`;

  return (
    <Modal onClose={onClose}>
      {header}
      <ol className="mt-4 space-y-3 text-sm text-slate-700">
        <li>
          <b>Bước 1.</b> Quét mã QR (đã điền sẵn số tiền và nội dung) hoặc chuyển khoản:
          <div className="mt-2 flex gap-3 rounded-2xl bg-slate-50 p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qr} alt="Mã QR chuyển khoản" className="h-32 w-32 shrink-0 rounded-xl bg-white object-contain" />
            <div className="min-w-0 space-y-1 text-[13px]">
              <p>
                Ngân hàng: <b>{shop.bankName}</b>
              </p>
              <p>
                Số TK: <b>{shop.accountNumber}</b>
              </p>
              <p>
                Chủ TK: <b>{shop.accountName}</b>
              </p>
              <p>
                Số tiền: <b>{formatVnd(order.amount)}</b>
              </p>
            </div>
          </div>
          <div className="mt-2 rounded-2xl border-2 border-dashed border-sky-300 bg-sky-50 p-3 text-center">
            <p className="text-xs font-bold text-slate-500">NỘI DUNG CHUYỂN KHOẢN (cũng là mã kích hoạt)</p>
            <p className="mt-1 font-mono text-lg font-black tracking-wider text-sky-700">{note}</p>
            <button type="button" onClick={() => copy(note)} className="mt-1 text-xs font-bold text-sky-600 underline">
              {copied ? 'Đã sao chép ✓' : 'Sao chép'}
            </button>
          </div>
        </li>
        <li>
          <b>Bước 2.</b> Chờ admin xác nhận tiền về. Duyệt xong mã được kích hoạt và khóa học <b>tự mở</b> trên tài khoản, học {ACCESS_LABEL} tính
          từ lúc kích hoạt. Cần nhanh hơn, bố mẹ gửi ảnh chuyển khoản qua Zalo{' '}
          <a href={`https://zalo.me/${shop.zalo}`} target="_blank" rel="noreferrer" className="font-bold text-sky-600 underline">
            {shop.zalo}
          </a>
          .
        </li>
      </ol>
      <p className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-amber-50 py-2 text-sm font-bold text-amber-700">
        <span className="khv-pulse inline-block h-2 w-2 rounded-full bg-amber-500" /> Đang chờ duyệt…
      </p>
      <button type="button" onClick={onActivate} className="mt-4 w-full text-center text-sm font-bold text-[#1d9bbd] underline">
        Tôi đã có mã kích hoạt khác
      </button>
    </Modal>
  );
}

function ActivateModal({ onClose }: { onClose: () => void }) {
  const [state, action, pending] = useActionState<ActivateState, FormData>(activateCode, null);
  // Modal chỉ mở khi bấm nút (không render ở server) nên đọc localStorage ngay được.
  const [token] = useState(() => getAccountToken());
  const [user] = useState(() => getAccountUser());

  return (
    <Modal onClose={onClose}>
      <p className="mr-8 rounded-[30px] bg-[#1ea3cf] py-2 text-center text-sm font-extrabold text-white">KÍCH HOẠT KHÓA HỌC</p>
      {state?.ok ? (
        <div className="mt-6 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img('icon_tab3.png')} alt="" className="mx-auto h-32" />
          <p className="mt-3 font-bold text-lime-700">{state.message}</p>
          <button type="button" onClick={onClose} className="khv-btn-buy mt-6 w-full">
            Vào học ngay
          </button>
        </div>
      ) : !token || state?.needLogin ? (
        <div className="mt-5 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img('icon_lock.png')} alt="" className="mx-auto h-20" />
          <p className="mt-3 font-bold text-slate-700">
            {state?.needLogin ? state.message : 'Bố mẹ đăng nhập tài khoản để nhập mã nhé.'}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Mã kích hoạt được gắn với tài khoản: đăng nhập trên điện thoại, máy tính bảng hay máy tính đều học được.
          </p>
          <a href={authHref('login')} className="khv-btn-buy mt-5 block w-full">
            ĐĂNG NHẬP
          </a>
          <a href={authHref('register')} className="mt-3 block text-sm font-bold text-sky-600 underline">
            Chưa có tài khoản? Đăng ký miễn phí
          </a>
        </div>
      ) : (
        <form action={action} className="mt-5">
          <input type="hidden" name="token" value={token} />
          <label htmlFor="khv-code" className="text-sm font-bold text-slate-600">
            Nhập mã kích hoạt
          </label>
          <input
            id="khv-code"
            name="code"
            autoFocus
            autoComplete="off"
            placeholder="VD: K7M3QX"
            className="mt-2 h-14 w-full rounded-[14px] border-[3px] border-[#e4e3e3] px-4 text-center text-lg font-black uppercase tracking-wider outline-none focus:border-[#45aeff]"
          />
          {state && !state.ok && <p className="mt-2 text-sm font-semibold text-rose-500">{state.message}</p>}
          <button
            type="submit"
            disabled={pending}
            className="khv-btn-buy mt-4 w-full disabled:opacity-60"
          >
            {pending ? 'Đang kiểm tra…' : 'KÍCH HOẠT'}
          </button>
          <p className="mt-3 text-center text-xs text-slate-500">
            Kích hoạt cho tài khoản <b>{user?.email ?? user?.fullName ?? 'đang đăng nhập'}</b>. Mỗi mã dùng cho 1 tài khoản, học được{' '}
            {ACCESS_LABEL}.
          </p>
        </form>
      )}
    </Modal>
  );
}
