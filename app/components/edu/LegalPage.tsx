import type { ReactNode } from 'react';
import Link from 'next/link';
import { ShieldCheck, Mail, ArrowRight, CalendarDays } from 'lucide-react';

export type LegalSection = {
  /** Tiêu đề mục (không kèm số thứ tự — số được đánh tự động). */
  title: string;
  /** Nội dung mục (đoạn văn, danh sách…). */
  content: ReactNode;
};

export type LegalPageProps = {
  /** Nhãn nhỏ phía trên tiêu đề, vd "Thông tin pháp lý". */
  kicker: string;
  title: string;
  /** Nhãn breadcrumb (thường trùng tiêu đề). */
  crumb: string;
  /** Đoạn mở đầu ngắn dưới tiêu đề. */
  intro: string;
  /** Ngày cập nhật hiển thị ở hero, vd "16/07/2026". */
  updated: string;
  sections: LegalSection[];
  /** Link chéo tới trang pháp lý còn lại. */
  related: { href: string; label: string };
};

function sectionId(index: number): string {
  return `muc-${index + 1}`;
}

export default function LegalPage({
  kicker,
  title,
  crumb,
  intro,
  updated,
  sections,
  related,
}: LegalPageProps) {
  return (
    <main className="kid-bg text-slate-900">
      {/* Hero — cùng phong cách các trang khác (canh giữa, accent sky) */}
      <section className="mx-auto max-w-5xl px-6 pt-10 lg:px-8 lg:pt-14">
        <nav className="text-sm text-slate-500">
          <Link href="/" className="transition hover:text-sky-700">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-700">{crumb}</span>
        </nav>

        <div className="mx-auto mt-10 max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-sky-600">
            <ShieldCheck size={15} aria-hidden="true" />
            {kicker}
          </span>

          <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            {title}
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">{intro}</p>

          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-500">
            <CalendarDays size={14} aria-hidden="true" />
            Cập nhật lần cuối: {updated}
          </p>
        </div>
      </section>

      {/* Body — mục lục dính bên trái + nội dung dạng thẻ */}
      <section className="mx-auto max-w-5xl px-6 py-12 lg:grid lg:grid-cols-[16rem_1fr] lg:gap-10 lg:px-8 lg:py-16">
        <aside className="mb-10 lg:mb-0">
          <div className="lg:sticky lg:top-24">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              Mục lục
            </p>
            <ol className="mt-4 space-y-1">
              {sections.map((s, i) => (
                <li key={s.title}>
                  <a
                    href={`#${sectionId(i)}`}
                    className="group flex gap-3 rounded-xl px-3 py-2 text-sm text-slate-600 transition hover:bg-white hover:text-sky-700"
                  >
                    <span className="font-black text-slate-300 transition group-hover:text-sky-600">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="leading-6">{s.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </aside>

        <div className="min-w-0 space-y-5">
          {sections.map((s, i) => (
            <article
              key={s.title}
              id={sectionId(i)}
              className="scroll-mt-24 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-base font-black text-sky-600">
                  {i + 1}
                </span>
                <h2 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                  {s.title}
                </h2>
              </div>
              <div className="prose prose-slate mt-4 max-w-none prose-p:leading-8 prose-p:text-slate-600 prose-li:leading-8 prose-li:text-slate-600 prose-a:font-semibold prose-a:text-sky-700 prose-a:no-underline hover:prose-a:underline">
                {s.content}
              </div>
            </article>
          ))}

          {/* CTA liên hệ — gradient đồng bộ các trang khác */}
          <div className="rounded-3xl bg-gradient-to-br from-sky-600 to-violet-600 p-8 text-center text-white shadow-md lg:p-10">
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
              Cần hỗ trợ thêm?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-sky-50">
              Nếu có câu hỏi về {crumb.toLowerCase()}, phụ huynh vui lòng gửi
              email — đội ngũ Bé Hay Học sẽ phản hồi trong thời gian sớm nhất.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="mailto:behayhoc@gmail.com"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-sky-700 shadow-sm transition hover:bg-sky-50"
              >
                <Mail size={18} aria-hidden="true" />
                behayhoc@gmail.com
              </a>
              <Link
                href="/ho-tro"
                className="inline-flex items-center justify-center rounded-full border border-white/40 bg-transparent px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Hỗ trợ
              </Link>
            </div>
          </div>

          <Link
            href={related.href}
            className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-6 py-4 text-sm font-bold text-slate-700 shadow-sm transition hover:border-sky-200 hover:text-sky-700"
          >
            <span>Xem thêm: {related.label}</span>
            <ArrowRight
              size={18}
              className="transition group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </section>
    </main>
  );
}
