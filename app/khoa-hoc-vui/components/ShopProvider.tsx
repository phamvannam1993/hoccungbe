'use client';

import { createContext, useActionState, useContext, useState } from 'react';
import { activateCode, type ActivateState } from '../actions';
import type { ShopInfo } from '../lib/types';
import { img } from '../lib/assets';

export type BuyTarget = { title: string; price: number; codePrefix: string };

type ShopCtx = { openBuy: (t: BuyTarget) => void; openActivate: () => void };

const Ctx = createContext<ShopCtx>({ openBuy: () => {}, openActivate: () => {} });

export const useShop = () => useContext(Ctx);

export const formatVnd = (n: number) => `${n.toLocaleString('vi-VN')}đ`;

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

function BuyModal({ shop, target, onClose, onActivate }: { shop: ShopInfo; target: BuyTarget; onClose: () => void; onActivate: () => void }) {
  const note = `IQ ${target.codePrefix} SDT`;
  const qr = `https://img.vietqr.io/image/${shop.bankId}-${shop.accountNumber}-compact2.png?amount=${target.price}&addInfo=${encodeURIComponent(note)}&accountName=${encodeURIComponent(shop.accountName)}`;

  return (
    <Modal onClose={onClose}>
      <p className="mr-8 rounded-[30px] bg-[#1ea3cf] py-2 text-center text-sm font-extrabold text-white">MUA KHÓA HỌC</p>
      <h2 className="mt-4 text-xl font-black text-slate-800">{target.title}</h2>
      <p className="text-2xl font-black text-[#e34a4a]">{formatVnd(target.price)}</p>

      <ol className="mt-4 space-y-3 text-sm text-slate-700">
        <li>
          <b>Bước 1.</b> Quét mã QR hoặc chuyển khoản:
          <div className="mt-2 flex gap-3 rounded-2xl bg-slate-50 p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qr} alt="Mã QR chuyển khoản" className="h-32 w-32 shrink-0 rounded-xl bg-white object-contain" />
            <div className="space-y-1 text-[13px]">
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
                Nội dung: <b className="text-sky-700">{note.replace('SDT', '<SĐT của bạn>')}</b>
              </p>
            </div>
          </div>
        </li>
        <li>
          <b>Bước 2.</b> Gửi ảnh chuyển khoản qua Zalo{' '}
          <a href={`https://zalo.me/${shop.zalo}`} target="_blank" rel="noreferrer" className="font-bold text-sky-600 underline">
            {shop.zalo}
          </a>{' '}
          hoặc gọi {shop.hotline}.
        </li>
        <li>
          <b>Bước 3.</b> Nhận <b>mã kích hoạt</b> và nhập vào ô bên dưới để mở khóa ngay.
        </li>
      </ol>

      <button
        type="button"
        onClick={onActivate}
        className="khv-btn-active mt-5 w-full"
      >
        Tôi đã có mã kích hoạt
      </button>
    </Modal>
  );
}

function ActivateModal({ onClose }: { onClose: () => void }) {
  const [state, action, pending] = useActionState<ActivateState, FormData>(activateCode, null);

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
      ) : (
        <form action={action} className="mt-5">
          <label htmlFor="khv-code" className="text-sm font-bold text-slate-600">
            Nhập mã kích hoạt
          </label>
          <input
            id="khv-code"
            name="code"
            autoFocus
            autoComplete="off"
            placeholder="VD: L2K01-ABC123-1A2B3C4D5E6F"
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
          <p className="mt-3 text-center text-xs text-slate-400">Mã dùng được trên thiết bị này. Đổi máy thì nhập lại mã.</p>
        </form>
      )}
    </Modal>
  );
}
