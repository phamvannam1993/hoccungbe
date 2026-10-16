'use client';

/* eslint-disable @next/next/no-img-element -- ảnh giao diện tĩnh, nhỏ */
import Link from 'next/link';
import type { Combo, Course, Grade } from '../lib/types';
import { img } from '../lib/assets';
import { useProgress } from '../lib/progress';
import { formatVnd, useShop } from './ShopProvider';

export type ShopCourse = Course & { unlocked: boolean; lessonIds: string[]; questionCount: number };

type Props = { grades: Grade[]; activeGrade: string; courses: ShopCourse[]; combo?: Combo; typeCount: number };

/** Thanh tiêu đề xanh giống Header.vue của app 3 Gốc. */
export function ShopHeader({ title, backHref, children }: { title: string; backHref?: string; children?: React.ReactNode }) {
  const { openActivate } = useShop();
  const progress = useProgress();
  const totalStars = Object.values(progress).reduce((n, c) => n + Object.values(c).reduce((a, b) => a + b, 0), 0);

  return (
    <header className="sticky top-0 z-30 bg-[#1093b7] text-white shadow-md">
      <div className="mx-auto flex min-h-[64px] max-w-6xl items-center gap-3 px-3 py-2 sm:px-4">
        {backHref ? (
          <Link href={backHref} aria-label="Quay lại" className="shrink-0">
            <img src={img('icon_prev.png')} alt="" className="h-10 w-10" />
          </Link>
        ) : (
          <Link href="/khoa-hoc-vui" aria-label="Trang khóa học" className="shrink-0">
            <img src={img('icon_title.png')} alt="" className="h-10 w-10" />
          </Link>
        )}
        <p className="min-w-0 flex-1 truncate text-base font-extrabold sm:text-lg">{title}</p>
        {children}
        <div
          className="relative hidden h-[42px] w-[96px] shrink-0 items-center bg-contain bg-no-repeat pl-7 sm:flex"
          style={{ backgroundImage: `url(${img('bg_coin.png')})` }}
          title="Tổng số sao"
        >
          <img src={img('icon_point.png')} alt="" className="absolute -left-2 top-0 w-10" />
          <span className="w-full text-center text-lg font-extrabold text-[#ffa621]">{totalStars}</span>
        </div>
        <button type="button" onClick={openActivate} className="flex shrink-0 items-center gap-1 rounded-full bg-white/15 py-1 pl-1 pr-3 text-sm font-extrabold hover:bg-white/25">
          <img src={img('icon_store.png')} alt="" className="h-9 w-9" />
          <span>Nhập mã</span>
        </button>
      </div>
    </header>
  );
}

export default function ShopView({ grades, activeGrade, courses, combo, typeCount }: Props) {
  const { openBuy, openActivate } = useShop();
  const progress = useProgress();
  const totalLessons = courses.reduce((n, c) => n + c.lessonIds.length, 0);
  const gradeTitle = grades.find((g) => g.id === activeGrade)?.title ?? '';
  const ownedAll = courses.length > 0 && courses.every((c) => c.unlocked);

  return (
    <div className="min-h-screen bg-white pb-16">
      <ShopHeader title="CỬA HÀNG KHÓA HỌC · TOÁN IQ" />

      {/* Banner */}
      <section className="relative overflow-hidden bg-cover bg-center text-white" style={{ backgroundImage: `url(${img('bg.png')})` }}>
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 md:flex-row md:py-10">
          <div className="flex-1 text-center md:text-left">
            <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-white/80">Thử thách IQ</p>
            <h1 className="mt-2 text-3xl font-black drop-shadow sm:text-5xl">Toán IQ {gradeTitle.toLowerCase()}</h1>
            <p className="mt-3 max-w-xl text-white/90">
              {courses.length} khóa · {totalLessons} bài thử thách dạng game, {typeCount} dạng câu hỏi. Có đếm ngược, gợi ý cách làm và lời giải từng bước.
            </p>
            <nav className="mt-5 inline-flex rounded-full bg-white/95 p-1 shadow" aria-label="Chọn lớp">
              {grades.map((g) =>
                g.id === activeGrade ? (
                  <span key={g.id} className="whitespace-nowrap rounded-full bg-[#1093b7] px-4 py-2 text-sm font-extrabold text-white sm:px-5">
                    {g.title}
                  </span>
                ) : g.available ? (
                  <Link
                    key={g.id}
                    href={`/khoa-hoc-vui?lop=${g.id}`}
                    scroll={false}
                    className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-extrabold text-[#1093b7] hover:bg-[#e6f6fb] sm:px-5"
                  >
                    {g.title}
                  </Link>
                ) : (
                  <span key={g.id} className="whitespace-nowrap px-3 py-2 text-sm font-bold text-slate-400 sm:px-5" title="Sắp ra mắt">
                    {g.title} <small className="text-[10px]">· sắp có</small>
                  </span>
                ),
              )}
            </nav>
          </div>
          <img src={img('mascot.png')} alt="" className="khv-float w-48 sm:w-64" />
        </div>
      </section>

      {combo && (
        <section className="mx-auto -mt-4 max-w-6xl px-4">
          <div className="relative flex flex-col items-center gap-4 rounded-[24px] border-4 border-[#ffc936] bg-[#fffbea] p-5 shadow-lg sm:flex-row">
            <img src={img('icon_award.png')} alt="" className="h-16 w-16" />
            <div className="flex-1 text-center sm:text-left">
              <p className="text-xs font-extrabold uppercase tracking-widest text-[#e19a21]">Tiết kiệm nhất</p>
              <h2 className="text-xl font-black text-slate-800 sm:text-2xl">{combo.title}</h2>
              <p className="text-sm text-slate-600">{combo.subtitle}</p>
            </div>
            <div className="text-center">
              {combo.oldPrice && <p className="text-sm text-slate-400 line-through">{formatVnd(combo.oldPrice)}</p>}
              <p className="text-3xl font-black text-[#e34a4a]">{formatVnd(combo.price)}</p>
              {ownedAll ? (
                <p className="mt-2 font-extrabold text-[#1f7a93]">✅ Đã sở hữu</p>
              ) : (
                <button
                  type="button"
                  onClick={() => openBuy({ title: combo.title, price: combo.price, codePrefix: combo.codePrefix })}
                  className="khv-btn-buy mt-2 px-8"
                >
                  Mua trọn bộ
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      <p className="mt-10 text-center text-[22px] text-black">Tôi muốn học ...</p>

      <section className="mx-auto mt-4 max-w-6xl px-4">
        <div className="grid justify-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => {
            const done = c.lessonIds.filter((id) => progress[c.slug]?.[id] !== undefined).length;
            const pct = (done / Math.max(1, c.lessonIds.length)) * 100;
            const href = `/khoa-hoc-vui/${c.slug}`;
            return (
              <article
                key={c.slug}
                className="relative flex max-w-[375px] flex-col bg-[length:100%_100%] bg-no-repeat p-3 transition hover:-translate-y-1"
                style={{ backgroundImage: `url(${img(c.unlocked ? 'bg_pro_active.png' : 'bg_pro.png')})` }}
              >
                <Link
                  href={href}
                  className="relative flex h-[170px] items-center justify-center overflow-hidden rounded-[14px]"
                  style={{ background: `linear-gradient(135deg, ${c.colors[0]}, ${c.colors[1]})` }}
                >
                  <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-black text-[#1d9bbd]">KHÓA {c.number}</span>
                  {!c.unlocked && <img src={img('icon_lock.png')} alt="Chưa mở khóa" className="absolute right-3 top-3 h-9 opacity-90" />}
                  <span className="khv-float text-[80px] drop-shadow-lg">{c.emoji}</span>
                </Link>
                <div className="flex flex-1 flex-col px-2 pb-2 pt-3">
                  <Link href={href} className="min-h-[44px] text-[17px] font-extrabold leading-snug text-slate-800">
                    {c.title}
                  </Link>
                  <p className="mt-1 flex-1 text-sm text-slate-500">{c.subtitle}</p>
                  <p className="mt-2 text-xs font-bold text-slate-500">
                    {c.lessonIds.length} bài · {c.questionCount} câu thử thách
                  </p>

                  {c.unlocked ? (
                    <>
                      <div className="relative mt-3 h-6 rounded-md bg-[#f2f2f2]">
                        <div className="h-full rounded-md bg-[#0ea5e9]" style={{ width: `${pct}%` }} />
                        <span className={`absolute inset-0 flex items-center justify-center text-xs font-extrabold ${pct > 45 ? 'text-white' : 'text-slate-600'}`}>
                          {done}/{c.lessonIds.length}
                        </span>
                      </div>
                      <Link href={href} className="khv-btn-active mt-3 text-center">
                        VÀO HỌC
                      </Link>
                    </>
                  ) : (
                    <>
                      <p className="mt-2 flex items-baseline gap-2">
                        <span className="text-base font-bold text-[#e34a4a]">{formatVnd(c.price).replace('đ', ' VNĐ')}</span>
                        {c.oldPrice && <span className="text-xs text-slate-400 line-through">{formatVnd(c.oldPrice)}</span>}
                        <Link href={href} className="ml-auto text-xs font-extrabold text-[#1d9bbd] underline">
                          Học thử bài 1
                        </Link>
                      </p>
                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() => openBuy({ title: `Khóa ${c.number} ${gradeTitle.toLowerCase()}: ${c.title}`, price: c.price, codePrefix: c.codePrefix })}
                          className="khv-btn-buy flex-1"
                        >
                          Mua ngay
                        </button>
                        <button type="button" onClick={openActivate} className="khv-btn-active flex-1">
                          Kích hoạt
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
