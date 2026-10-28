// Sự kiện GA4 cho phễu mua gói (gtag nạp ở app/layout.tsx). Gọi được ở mọi nơi phía trình duyệt;
// chưa có gtag (chặn quảng cáo, chạy server) thì bỏ qua.
//
// Phễu trong GA4 (Khám phá → Phễu): view_item_list → begin_checkout → add_payment_info → purchase.
// Lời mời nâng cấp: view_promotion (thấy) → select_promotion (bấm), promotion_id = vị trí đặt.

type GaItem = { item_id: string; item_name: string; price: number; item_category?: string };

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  try {
    window.gtag('event', event, params);
  } catch {}
}

export const gaItem = (codePrefix: string, title: string, price: number): GaItem => ({
  item_id: codePrefix,
  item_name: title,
  price,
  item_category: 'Toán IQ',
});

const checkout = (item: GaItem) => ({ currency: 'VND', value: item.price, items: [item] });

/** Xem bảng giá (trang cửa hàng / bảng mở khóa của khóa học). */
export const trackViewPricing = (list: string, items: GaItem[]) =>
  track('view_item_list', { item_list_id: list, item_list_name: list, items });

/** Bấm Mua. */
export const trackBeginCheckout = (item: GaItem) => track('begin_checkout', checkout(item));

/** Đơn đã tạo, hiện QR / chuyển sang payOS. */
export const trackPaymentInfo = (item: GaItem, payment_type: string) =>
  track('add_payment_info', { ...checkout(item), payment_type });

/** Đơn đã duyệt (tiền về). Mỗi mã đơn chỉ gửi một lần trên máy này. */
export function trackPurchase(code: string, item: GaItem) {
  const key = `ga_purchase_${code}`;
  try {
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, '1');
  } catch {}
  track('purchase', { transaction_id: code, ...checkout(item) });
}

/** Lời mời nâng cấp: `spot` = vị trí ('cuoi-bai-hoc', 'bao-cao', 'het-luot-choi'…). */
export const trackUpsellView = (spot: string) =>
  track('view_promotion', { promotion_id: spot, promotion_name: 'Toán IQ', creative_slot: spot });

export const trackUpsellClick = (spot: string) =>
  track('select_promotion', { promotion_id: spot, promotion_name: 'Toán IQ', creative_slot: spot });
