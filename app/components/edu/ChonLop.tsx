'use client';

import { useEffect, useState } from 'react';
import { CONG_CU_TOAN, congCuNoiBat } from '../../lib/congCuToan';
import Link from 'next/link';

// "BÉ HỌC LỚP MẤY?" — một câu hỏi duy nhất ở đầu trang chủ.
//
// Vì sao làm cái này: trang chủ trước đây đổ ra 17 lối vào cùng lúc, ai vào cũng
// phải tự đoán nên bắt đầu từ đâu. Duolingo giải bài toán đó bằng cách hỏi ĐÚNG
// MỘT câu rồi mới mở nội dung — chọn xong thì phần còn lại là của riêng bé.
//
// Lựa chọn được nhớ lại, nên lần sau bé vào là thấy thẳng lớp của mình, không
// phải chọn lại. Muốn đổi thì bấm "Đổi lớp".

const KEY = 'bhh_lop_cua_be';

type Nhom = {
  ma: string;
  nhan: string;
  phu: string;
  emoji: string;
  mau: string;
  /**
   * Vài việc chính của lứa tuổi này — bốn chứ không phải mười, để bé bấm được
   * ngay: ba mục học theo bài, cộng một công cụ để bé tự thao tác.
   */
  viec: { href: string; emoji: string; ten: string; mo: string }[];
};

/** Công cụ Toán nổi bật của một lớp, lấy từ danh sách dùng chung. */
function congCuChoLop(g: number) {
  const href = congCuNoiBat[g];
  const c = CONG_CU_TOAN.find((x) => x.href === href) ?? CONG_CU_TOAN[0];
  return { href: c.href, emoji: c.emoji, ten: c.ten, mo: 'Công cụ bấm được, tự làm tự chấm' };
}

const NHOM: Nhom[] = [
  {
    ma: 'mau-giao', nhan: '4–5 tuổi', phu: 'Mẫu giáo', emoji: '🧸', mau: '#f472b6',
    viec: [
      { href: '/bang-chu-cai', emoji: '🔤', ten: 'Bảng chữ cái', mo: 'Nhận mặt 29 chữ' },
      { href: '/vong-tron-am', emoji: '🎡', ten: 'Vòng tròn âm vần', mo: 'Tập đánh vần' },
      { href: '/tro-choi/dem-so', emoji: '🔢', ten: 'Tập đếm số', mo: 'Đếm và so sánh' },
      { href: '/bang-cong-tru', emoji: '➕', ten: 'Bảng cộng trừ', mo: 'Làm quen phép cộng trong 10' },
    ],
  },
  ...([1, 2, 3, 4, 5] as const).map((g) => ({
    ma: `lop-${g}`,
    nhan: `Lớp ${g}`,
    phu: `${g + 5} tuổi`,
    emoji: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'][g - 1],
    mau: ['#ef4444', '#f97316', '#22c55e', '#0ea5e9', '#8b5cf6'][g - 1],
    viec: [
      { href: `/khoa-hoc/toan-lop-${g}`, emoji: '🔢', ten: `Toán lớp ${g}`, mo: 'Học theo bài, có bài tập' },
      { href: `/khoa-hoc/tieng-viet-lop-${g}`, emoji: '📖', ten: `Tiếng Việt lớp ${g}`, mo: 'Đọc, viết, chính tả' },
      { href: '/luyen-nghe', emoji: '🎧', ten: 'Tiếng Anh', mo: 'Nghe và học từ vựng' },
      // Việc thứ tư: công cụ Toán hợp nhất với lứa tuổi này. Ba việc đầu là
      // học theo bài, mục này là chỗ bé tự thao tác — hai kiểu khác nhau nên
      // để cạnh nhau thay vì thay thế.
      congCuChoLop(g),
    ],
  })),
];

export default function ChonLop() {
  const [ma, setMa] = useState<string | null>(null);

  // Đọc lựa chọn cũ trong effect: localStorage không có lúc dựng trang ở máy chủ,
  // khởi tạo state trực tiếp là lệch hydration.
  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMa(localStorage.getItem(KEY));
    } catch { /* trình duyệt chặn lưu thì coi như chưa chọn */ }
  }, []);

  function chon(x: string | null) {
    setMa(x);
    try {
      if (x) localStorage.setItem(KEY, x);
      else localStorage.removeItem(KEY);
    } catch { /* bỏ qua */ }
  }

  const nhom = NHOM.find((n) => n.ma === ma) ?? null;

  // Mặc định VẼ SẴN phần chọn lớp, rồi mới đổi nếu đọc được lựa chọn cũ.
  // Cách ngược lại — chừa một ô trống chờ đọc localStorage — làm người vào lần
  // đầu (đa số) nhìn thấy một khoảng trắng, và máy tìm kiếm cũng không thấy gì.

  if (!nhom) {
    return (
      <section className="mx-auto w-full max-w-[1440px] px-4 py-5 sm:px-6" aria-label="Chọn lớp của bé">
        <h2 className="kid-display text-center text-2xl font-black text-slate-800 sm:text-3xl">
          Bé đang học lớp mấy?
        </h2>
        <p className="mt-1.5 text-center text-sm font-bold text-slate-500">
          Chọn một lần thôi — lần sau vào là vào thẳng lớp của bé.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
          {NHOM.map((n) => (
            <button key={n.ma} onClick={() => chon(n.ma)}
              className="flex items-center gap-2.5 rounded-3xl border-2 border-white bg-white p-3 text-left shadow-[0_5px_0_rgba(148,163,184,.22)] transition hover:-translate-y-0.5 sm:p-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-2xl"
                style={{ background: `${n.mau}1a` }} aria-hidden>{n.emoji}</span>
              <span className="min-w-0">
                <span className="kid-display block text-base font-black" style={{ color: n.mau }}>{n.nhan}</span>
                <span className="block text-[11px] font-bold text-slate-400">{n.phu}</span>
              </span>
            </button>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-5 sm:px-6" aria-label={`Học ${nhom.nhan}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="kid-display flex min-w-0 items-center gap-2 text-xl font-black text-slate-800 sm:text-2xl">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-xl"
            style={{ background: `${nhom.mau}1a` }} aria-hidden>{nhom.emoji}</span>
          <span className="truncate">Học cùng bé {nhom.nhan.toLowerCase()}</span>
        </h2>
        <button onClick={() => chon(null)}
          className="shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-black text-slate-500">
          Đổi lớp
        </button>
      </div>

      {/* Ba việc, không phải mười. Bấm cái nào cũng vào học được ngay. */}
      <ul className="grid gap-3 sm:grid-cols-3">
        {nhom.viec.map((v) => (
          <li key={v.href}>
            <Link href={v.href}
              className="flex h-full items-center gap-3 rounded-3xl border-2 border-white bg-white p-4 shadow-[0_5px_0_rgba(148,163,184,.22)] transition hover:-translate-y-0.5 sm:flex-col sm:items-start">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-2xl"
                style={{ background: `${nhom.mau}1a` }} aria-hidden>{v.emoji}</span>
              <span className="min-w-0">
                <span className="kid-display block text-sm font-black text-slate-800 sm:text-base">{v.ten}</span>
                <span className="block text-[11px] font-bold text-slate-500">{v.mo}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <Link href={nhom.ma.startsWith('lop-') ? `/${nhom.ma}` : '/tro-choi'}
        className="mt-3 block rounded-3xl py-3.5 text-center text-sm font-black text-white transition active:translate-y-0.5"
        style={{ background: nhom.mau, boxShadow: `0 5px 0 ${nhom.mau}80` }}>
        Xem tất cả nội dung {nhom.nhan.toLowerCase()} →
      </Link>
    </section>
  );
}
