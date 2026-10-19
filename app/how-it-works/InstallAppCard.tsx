'use client';

import { useState, useSyncExternalStore } from 'react';
import { Download, Smartphone, Monitor, Apple, CheckCircle2 } from 'lucide-react';
import { INSTALL_EVENT, INSTALL_READY_EVENT, pendingInstall } from '../lib/pwa';

type Platform = 'android' | 'ios' | 'desktop';

const subscribe = (cb: () => void) => {
  window.addEventListener(INSTALL_READY_EVENT, cb);
  window.addEventListener('appinstalled', cb);
  return () => {
    window.removeEventListener(INSTALL_READY_EVENT, cb);
    window.removeEventListener('appinstalled', cb);
  };
};
const detect = (): Platform => {
  const ua = navigator.userAgent;
  if (/iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return 'ios';
  if (/android/i.test(ua)) return 'android';
  return 'desktop';
};
const standalone = () =>
  window.matchMedia?.('(display-mode: standalone)').matches || (navigator as { standalone?: boolean }).standalone === true;

const STEPS: Record<Platform, { title: string; steps: string[] }> = {
  android: {
    title: 'Điện thoại Android',
    steps: ['Mở behayhoc.com bằng Chrome.', 'Bấm nút "Cài ngay" ở trên — hoặc menu ⋮ → "Cài đặt ứng dụng".', 'Bấm "Cài đặt". Biểu tượng Bé Hay Học hiện ngay trên màn hình chính.'],
  },
  ios: {
    title: 'iPhone / iPad',
    steps: [
      'Mở behayhoc.com bằng Safari (nếu đang mở trong Zalo/Facebook: bấm ••• → "Mở trong Safari").',
      'Bấm nút Chia sẻ (ô vuông có mũi tên lên) ở thanh dưới.',
      'Kéo xuống chọn "Thêm vào MH chính" → bấm "Thêm".',
    ],
  },
  desktop: {
    title: 'Máy tính',
    steps: ['Mở behayhoc.com bằng Chrome hoặc Edge.', 'Bấm nút "Cài ngay" ở trên — hoặc biểu tượng cài đặt ⊕ ở cuối thanh địa chỉ.', 'Bấm "Cài đặt". Bé Hay Học mở thành cửa sổ riêng như phần mềm.'],
  },
};

const TABS: { key: Platform; label: string; Icon: typeof Smartphone }[] = [
  { key: 'android', label: 'Android', Icon: Smartphone },
  { key: 'ios', label: 'iPhone', Icon: Apple },
  { key: 'desktop', label: 'Máy tính', Icon: Monitor },
];

/** Thẻ "Cài Bé Hay Học như app": nút cài thẳng (Chrome/Android/Edge) + hướng dẫn theo từng loại máy. */
export default function InstallAppCard() {
  const detected = useSyncExternalStore(subscribe, detect, () => 'android' as Platform);
  const canOneTap = useSyncExternalStore(subscribe, () => !!pendingInstall(), () => false);
  const installed = useSyncExternalStore(subscribe, standalone, () => false);
  const [picked, setPicked] = useState<Platform | null>(null);
  const tab = picked ?? detected;

  return (
    <div className="grid gap-8 rounded-[32px] bg-gradient-to-br from-sky-500 via-blue-600 to-violet-600 p-6 text-white shadow-xl sm:p-10 lg:grid-cols-[1fr_1.1fr]">
      <div>
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-black uppercase tracking-widest">
          <Download size={14} /> Miễn phí · không cần kho ứng dụng
        </span>
        <h2 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">Cài Bé Hay Học lên máy như một app</h2>
        <p className="mt-4 text-base leading-7 text-sky-50">
          Mở nhanh bằng một chạm từ màn hình chính, toàn màn hình không thanh địa chỉ, nhẹ máy và học được cả khi mạng yếu.
        </p>
        <ul className="mt-5 space-y-2 text-sm font-semibold text-sky-50">
          {['Không tốn dung lượng như app thường', 'Tự cập nhật bài mới, không phải tải lại', 'Dùng chung tài khoản và tiến độ của bé'].map((t) => (
            <li key={t} className="flex items-center gap-2">
              <CheckCircle2 size={18} className="shrink-0 text-emerald-300" /> {t}
            </li>
          ))}
        </ul>
        {installed ? (
          <p className="mt-7 inline-flex items-center gap-2 rounded-full bg-emerald-400/90 px-5 py-3 font-black text-emerald-950">
            <CheckCircle2 size={20} /> Bố mẹ đang dùng app Bé Hay Học rồi!
          </p>
        ) : (
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(INSTALL_EVENT))}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-black text-blue-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <Download size={20} /> {canOneTap ? 'Cài ngay' : tab === 'ios' ? 'Xem cách cài trên iPhone' : 'Cài ngay'}
          </button>
        )}
      </div>

      <div className="rounded-3xl bg-white p-5 text-slate-800 shadow-lg sm:p-6">
        <div className="flex gap-2 rounded-2xl bg-slate-100 p-1" role="tablist">
          {TABS.map(({ key, label, Icon }) => (
            <button
              key={key}
              role="tab"
              aria-selected={tab === key}
              onClick={() => setPicked(key)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-extrabold transition ${
                tab === key ? 'bg-white text-blue-700 shadow' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>
        <p className="mt-5 text-sm font-black uppercase tracking-wider text-blue-600">{STEPS[tab].title}</p>
        <ol className="mt-3 space-y-3">
          {STEPS[tab].steps.map((s, i) => (
            <li key={s} className="flex gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-600 text-sm font-black text-white">{i + 1}</span>
              <span className="pt-1 text-[15px] leading-6 text-slate-700">{s}</span>
            </li>
          ))}
        </ol>
        {tab === 'ios' && (
          <p className="mt-4 rounded-2xl bg-amber-50 p-3 text-xs leading-5 text-amber-800">
            Apple chưa cho trang web tự cài bằng một nút trên iPhone, nên bố mẹ làm 3 bước trên (chỉ mất khoảng 10 giây).
          </p>
        )}
      </div>
    </div>
  );
}
