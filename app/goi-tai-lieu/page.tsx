import type { Metadata } from 'next';
import Link from 'next/link';
import { getAccess } from '../khoa-hoc-iq/lib/access';
import { PACKS, packKey, type Pack } from './packs';
import BuyPack from './[slug]/BuyPack';

export const metadata: Metadata = {
  title: 'Gói tài liệu in: bộ đề ôn thi học kỳ 1, 30 đề giữa kì lớp 1, card Phonics',
  description:
    'Bộ đề ôn thi học kỳ 1 lớp 1–5 (Toán, Tiếng Việt, Tiếng Anh) in A4 kèm đáp án và lời giải; trọn bộ card Phonics tiếng Anh in sẵn. Mua một lần, in trong 12 tháng.',
  alternates: { canonical: '/goi-tai-lieu' },
};

// Không lấy formatDate của ShopProvider: module 'use client' — trang server không gọi hàm của nó được.
const formatDate = (ms: number) =>
  new Date(ms).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Ho_Chi_Minh' });

function PackCard({ pack, until }: { pack: Pack; until: number | null }) {
  return (
    <article id={pack.slug} className="flex scroll-mt-24 flex-col rounded-3xl border-[3px] border-[#d7eef6] bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="text-4xl" aria-hidden>
          {pack.emoji}
        </span>
        <div className="min-w-0">
          <h2 className="text-lg font-black leading-snug text-slate-800">{pack.title}</h2>
          <p className="mt-1 text-sm text-slate-600">{pack.subtitle}</p>
        </div>
      </div>
      <ul className="mt-3 flex-1 space-y-1 text-sm font-semibold text-slate-700">
        {pack.bullets.map((b) => (
          <li key={b}>✅ {b}</li>
        ))}
      </ul>
      <div className="mt-4 border-t border-slate-100 pt-4">
        {until ? (
          <>
            <p className="text-center text-sm font-extrabold text-[#1f7a93]">✅ Đã mua · dùng đến {formatDate(until)}</p>
            <Link href={`/goi-tai-lieu/${pack.slug}`} className="khv-btn-active mt-2 block text-center">
              MỞ BẢN IN
            </Link>
          </>
        ) : (
          <>
            <BuyPack pack={pack} list="goi-tai-lieu" />
            <Link href={`/goi-tai-lieu/${pack.slug}`} className="mt-3 block text-center text-sm font-bold text-[#1d9bbd] underline">
              Xem thử bản in
            </Link>
          </>
        )}
      </div>
    </article>
  );
}

export default async function GoiTaiLieuPage() {
  const access = await getAccess();
  const phonics = PACKS.filter((p) => p.kind === 'phonics');
  const exams = PACKS.filter((p) => p.kind === 'de-hk1' || p.kind === 'thi-lop-1');
  const until = (p: Pack) => access[packKey(p.slug)] ?? null;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-8">
      <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#e19a21]">Dành cho bố mẹ</p>
      <h1 className="mt-1 text-3xl font-black text-slate-800 sm:text-4xl">Gói tài liệu in cho bé</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Mua một lần, in hoặc lưu PDF bao nhiêu lần cũng được trong 12 tháng. Thanh toán bằng QR ngân hàng, gói tự mở ngay khi tiền về.
      </p>

      <h2 className="mt-8 text-xl font-black text-slate-800">📝 Ôn thi học kỳ 1</h2>
      <div className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {exams.map((p) => (
          <PackCard key={p.slug} pack={p} until={until(p)} />
        ))}
      </div>

      <h2 className="mt-10 text-xl font-black text-slate-800">🔤 Tiếng Anh</h2>
      <div className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {phonics.map((p) => (
          <PackCard key={p.slug} pack={p} until={until(p)} />
        ))}
      </div>
    </div>
  );
}
