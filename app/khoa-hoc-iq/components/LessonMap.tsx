'use client';

/* eslint-disable @next/next/no-img-element -- ảnh giao diện tĩnh, nhỏ */
import Link from 'next/link';
import { useRef } from 'react';
import type { Combo, Course, LessonSummary } from '../lib/types';
import { img } from '../lib/assets';
import { useProgress } from '../lib/progress';
import { ACCESS_LABEL, formatDate, formatVnd, useShop } from './ShopProvider';
import { ShopHeader } from './ShopView';

type Props = { course: Course; lessons: LessonSummary[]; unlocked: boolean; expiresAt: number | null; needUnlock: boolean; combo?: Combo };

// Bố cục bản đồ giống HomePage.vue của app 3 Gốc
const GAP_X = 220;
const START_X = 130;
const LOW = 195; // nút bài lẻ (1, 3, 5…) nằm thấp, nhãn ở trên
const HIGH = 115; // nút bài chẵn nằm cao, nhãn ở dưới
const HEIGHT = 330;

function wave(a: { x: number; y: number }, b: { x: number; y: number }) {
  const dx = b.x - a.x;
  const off = b.y < a.y ? -40 : 40;
  return `M${a.x},${a.y} C${a.x + dx * 0.33},${a.y + off} ${b.x - dx * 0.33},${b.y + off} ${b.x},${b.y}`;
}

export default function LessonMap({ course, lessons, unlocked, expiresAt, needUnlock, combo }: Props) {
  const { openBuy, openActivate } = useShop();
  const progress = useProgress()[course.slug] ?? {};
  const scroller = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number } | null>(null);

  const nodes = lessons.map((l, i) => ({ ...l, x: START_X + i * GAP_X, y: i % 2 === 0 ? LOW : HIGH }));
  const isDone = (id: string) => progress[id] !== undefined;
  const doneCount = lessons.filter((l) => isDone(l.id)).length;
  const lastDone = lessons.reduce((acc, l, i) => (isDone(l.id) ? i : acc), -1);
  const current = lessons.findIndex((l) => !isDone(l.id) && !l.locked);
  const width = START_X * 2 + Math.max(0, lessons.length - 1) * GAP_X;

  const shopHref = `/khoa-hoc-iq?lop=${course.grade}`;
  // Thử nghiệm giá: mở khóa = mua trọn lớp (cùng giá 1 khóa); không có gói lớp thì mua khóa lẻ.
  const buyCourse = () =>
    combo
      ? openBuy({ title: combo.title, price: combo.price, codePrefix: combo.codePrefix })
      : openBuy({ title: `Khóa ${course.number} ${(course.subject.split('|')[1] ?? '').toLowerCase()}: ${course.title}`, price: course.price, codePrefix: course.codePrefix });
  const price = combo?.price ?? course.price;
  const scrollBy = (dx: number) => scroller.current?.scrollBy({ left: dx, behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-[#dff5ff] pb-16">
      <ShopHeader title={`Khóa ${course.number}: ${course.title}`} backHref={shopHref}>
        <span className="hidden shrink-0 rounded-[28px] bg-white px-4 py-1 text-base font-extrabold text-[#1d9bbd] sm:inline sm:text-lg">
          BÀI {Math.min(doneCount + 1, lessons.length)}/{lessons.length}
        </span>
      </ShopHeader>

      {needUnlock && !unlocked && (
        <div className="mx-auto mt-4 max-w-6xl px-4">
          <div className="flex flex-col items-center gap-3 rounded-[20px] border-4 border-[#ffc936] bg-white p-4 shadow sm:flex-row">
            <img src={img('icon_lock.png')} alt="" className="h-12" />
            <p className="flex-1 text-center font-bold text-slate-700 sm:text-left">
              Bài này nằm trong phần trả phí. Mở khóa để bé học tiếp toàn bộ khóa nhé!
            </p>
            <button type="button" onClick={buyCourse} className="khv-btn-buy px-6">
              Mở khóa ngay
            </button>
          </div>
        </div>
      )}

      {/* Bản đồ bài học: kéo ngang để xem */}
      <div className="relative mx-auto mt-6 max-w-6xl">
        <div
          ref={scroller}
          className="khv-noscrollbar cursor-grab overflow-x-auto active:cursor-grabbing"
          onMouseDown={(e) => {
            drag.current = { x: e.pageX, left: scroller.current?.scrollLeft ?? 0 };
          }}
          onMouseMove={(e) => {
            if (!drag.current || !scroller.current) return;
            scroller.current.scrollLeft = drag.current.left - (e.pageX - drag.current.x) * 1.5;
          }}
          onMouseUp={() => (drag.current = null)}
          onMouseLeave={() => (drag.current = null)}
        >
          <div className="relative mx-auto select-none" style={{ width, height: HEIGHT }}>
            <svg className="pointer-events-none absolute inset-0" width={width} height={HEIGHT} aria-hidden>
              {nodes.slice(0, -1).map((n, i) => {
                const solid = i < lastDone;
                return (
                  <path
                    key={n.id}
                    d={wave(n, nodes[i + 1])}
                    fill="none"
                    strokeLinecap="round"
                    stroke={solid ? '#0b8eb7' : '#bebebe'}
                    strokeWidth={solid ? 12 : 10}
                    strokeDasharray={solid ? undefined : '13 28'}
                  />
                );
              })}
            </svg>

            {nodes.map((n, i) => {
              const done = isDone(n.id);
              const labelAbove = i % 2 === 0;
              const frame = `${labelAbove ? 'bg_top' : 'bg_bottom'}${done ? '_active' : ''}.png`;
              const stars = progress[n.id] ?? 0;
              const href = `/khoa-hoc-iq/${course.slug}/${n.id}`;
              const body = (
                <>
                  {i === current && (
                    <span
                      className="khv-pulse absolute h-[104px] w-[104px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[10px] border-[#ffaf36]"
                      style={{ left: n.x, top: n.y }}
                    />
                  )}
                  <span className="absolute -translate-x-1/2 -translate-y-1/2 transition hover:scale-110" style={{ left: n.x, top: n.y }}>
                    <img src={img(done ? 'star_1.png' : 'star_2.png')} alt="" className="h-[80px] w-[84px] object-contain" draggable={false} />
                    {n.locked && <img src={img('icon_lock.png')} alt="" className="absolute -bottom-1 -right-2 h-8" draggable={false} />}
                  </span>
                  <span
                    className={`absolute flex h-[110px] w-[150px] -translate-x-1/2 flex-col items-center bg-[length:100%_100%] bg-no-repeat px-2 text-center ${
                      labelAbove ? 'justify-start pt-3' : 'justify-end pb-3'
                    }`}
                    style={{ left: n.x, top: labelAbove ? n.y - 165 : n.y + 50, backgroundImage: `url(${img(frame)})` }}
                  >
                    <span className="text-[11px] font-extrabold uppercase text-[#1d9bbd]">
                      Bài {i + 1}
                      {n.free && !unlocked ? ' · Miễn phí' : ''}
                    </span>
                    <span className="line-clamp-2 text-[15px] font-bold leading-5 text-slate-800">{n.title}</span>
                    <span className="mt-0.5 text-xs">
                      {[1, 2, 3].map((s) => (
                        <span key={s} className={done && s <= stars ? '' : 'opacity-25 grayscale'}>
                          ⭐
                        </span>
                      ))}
                    </span>
                  </span>
                </>
              );
              return n.locked ? (
                <button key={n.id} type="button" onClick={buyCourse} aria-label={`Bài ${i + 1}: ${n.title} (cần mở khóa)`}>
                  {body}
                </button>
              ) : (
                <Link key={n.id} href={href} draggable={false} aria-label={`Bài ${i + 1}: ${n.title}`}>
                  {body}
                </Link>
              );
            })}
          </div>
        </div>
        <button type="button" onClick={() => scrollBy(-440)} className="absolute left-2 top-1/2 hidden -translate-y-1/2 md:block" aria-label="Cuộn trái">
          <img src={img('icon_prev.png')} alt="" className="h-12 w-12" />
        </button>
        <button type="button" onClick={() => scrollBy(440)} className="absolute right-2 top-1/2 hidden -translate-y-1/2 rotate-180 md:block" aria-label="Cuộn phải">
          <img src={img('icon_prev.png')} alt="" className="h-12 w-12" />
        </button>
      </div>

      <div className="mx-auto mt-6 grid max-w-6xl gap-5 px-4 lg:grid-cols-[1fr_360px]">
        <section className="rounded-[24px] bg-white p-5 shadow">
          <h2 className="text-xl font-black text-slate-800">Lộ trình {lessons.length} bài</h2>
          <ol className="mt-3 divide-y divide-slate-100">
            {lessons.map((l, i) => (
              <li key={l.id} className="flex items-center gap-3 py-3">
                <img src={img(isDone(l.id) ? 'star_1.png' : 'star_2.png')} alt="" className="h-10 w-10 object-contain" />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-800">
                    Bài {i + 1}: {l.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    {l.questionCount} câu{l.free && !unlocked ? ' · Học thử miễn phí' : ''}
                    {isDone(l.id) ? ` · ⭐ ${progress[l.id]}/3` : ''}
                  </p>
                </div>
                {l.locked ? (
                  <button type="button" onClick={buyCourse} className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-500">
                    <img src={img('icon_lock.png')} alt="" className="h-5" /> Mở khóa
                  </button>
                ) : (
                  <Link href={`/khoa-hoc-iq/${course.slug}/${l.id}`} className="khv-btn-active px-4 text-sm">
                    {isDone(l.id) ? 'Chơi lại' : 'Vào học'}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </section>

        <aside className="h-fit rounded-[24px] bg-white p-5 shadow">
          <div className="flex items-center gap-3">
            <img src={img('icon_question.png')} alt="" className="h-20" />
            <p className="text-slate-600">{course.subtitle}</p>
          </div>
          <ul className="mt-3 space-y-2 text-sm font-semibold text-slate-700">
            {course.highlights.map((h) => (
              <li key={h}>✅ {h}</li>
            ))}
          </ul>
          {/* Phiếu bài tập in (PDF): đã mua in cả 5 bài; chưa mua in thử Bài 1. */}
          <Link
            href={`/khoa-hoc-iq/in/${course.slug}`}
            className="mt-4 flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#1d9bbd] bg-[#e6f6fb] px-4 py-2.5 text-sm font-extrabold text-[#1f7a93] transition hover:bg-[#d3eef7]"
          >
            🖨 {unlocked ? 'In phiếu bài tập (PDF)' : 'In thử phiếu Bài 1 (PDF)'}
          </Link>
          {unlocked ? (
            <div className="mt-5 rounded-2xl bg-[#e6f6fb] p-4 text-center font-bold text-[#1f7a93]">
              🎉 Bé học được khóa này{expiresAt ? ` đến hết ngày ${formatDate(expiresAt)}` : ''}
              <button type="button" onClick={buyCourse} className="mt-2 block w-full text-sm font-extrabold text-[#1d9bbd] underline">
                Gia hạn thêm {ACCESS_LABEL}
              </button>
            </div>
          ) : (
            <div className="mt-5">
              <p className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#e34a4a]">{formatVnd(price)}</span>
                <span className="text-sm font-bold text-slate-500">/ {ACCESS_LABEL}</span>
                {combo?.oldPrice && <span className="text-slate-400 line-through">{formatVnd(combo.oldPrice)}</span>}
              </p>
              {combo && <p className="mt-1 text-sm font-bold text-[#1f7a93]">Mở trọn {combo.title.replace(/^Trọn bộ /, '')} — bé học được cả 12 khóa.</p>}
              <div className="mt-3 flex gap-2">
                <button type="button" onClick={buyCourse} className="khv-btn-buy flex-1">
                  {combo ? 'Mua trọn lớp' : 'Mua ngay'}
                </button>
                <button type="button" onClick={openActivate} className="khv-btn-active flex-1">
                  Kích hoạt
                </button>
              </div>
              {combo && (
                <Link href={shopHref} className="mt-3 block text-center text-sm font-bold text-[#1d9bbd] underline">
                  Xem 12 khóa trong gói →
                </Link>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
