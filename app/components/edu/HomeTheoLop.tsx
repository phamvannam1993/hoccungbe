'use client';

import Link from 'next/link';
import { ItemCard } from '../catalog/CatalogCards';
import HomNayCuaBe from './HomNayCuaBe';
import { ALL_GRADES, GRADE_AGE, KIND_META, PALETTE, SUBJECT_META, gradeHref, gradeName, type CatalogItem } from '../../lib/catalog';
import { setLopCuaBe, useLopCuaBe } from '../../lib/lopCuaBe';

// Phần đầu trang chủ theo bản thiết kế "cấu trúc mới": hỏi lớp trước, rồi chỉ hiện đồ của lớp đó.
// Máy chủ vẽ sẵn bản CHƯA CHỌN LỚP (đủ liên kết cho máy tìm kiếm); chọn lớp xong mới lọc ở trình duyệt.

export type GradeBlock = {
  toan: string[];
  tv: string[];
  ta: string[];
  games: string[];
  packs: string[];
  exam: { href: string; toan: number; tiengViet: number; total: number } | null;
};

export type HomeTheoLopData = {
  pool: Record<string, CatalogItem>;
  byGrade: Record<string, GradeBlock>;
  general: GradeBlock;
  term: string;
};

const GRADE_COLOR = ['#db2777', '#ef4444', '#f97316', '#16a34a', '#0284c7', '#7c3aed'];

export default function HomeTheoLop({ data }: { data: HomeTheoLopData }) {
  const [lop] = useLopCuaBe();
  const block = lop == null ? data.general : data.byGrade[String(lop)];
  const items = (hrefs: string[]) => hrefs.map((h) => data.pool[h]).filter(Boolean);
  const name = lop == null ? '' : gradeName(lop);
  const lower = name.toLowerCase();

  const subjects = [
    { key: 'toan', s: SUBJECT_META.toan, title: lop == null ? 'Toán' : `Toán ${lower}`, href: lop == null ? '/hoc-toan' : `${gradeHref(lop)}#toan`, list: block.toan },
    { key: 'tv', s: SUBJECT_META['tieng-viet'], title: lop == null ? 'Tiếng Việt' : `Tiếng Việt ${lower}`, href: lop == null ? '/tieng-viet' : `${gradeHref(lop)}#tieng-viet`, list: block.tv },
    { key: 'ta', s: SUBJECT_META['tieng-anh'], title: 'Tiếng Anh', href: lop == null ? '/tu-vung-tieng-anh' : `${gradeHref(lop)}#tieng-anh`, list: block.ta },
  ];

  return (
    <div className="mx-auto grid w-full max-w-[1200px] gap-5 px-4 pt-5 sm:px-6">
      {/* 1. Bé học lớp mấy? */}
      <section id="chon-lop" className="scroll-mt-24 rounded-[32px] p-5 sm:p-7" style={{ background: PALETTE.purple.soft }} aria-labelledby="chon-lop-h">
        <p className="kid-display text-[13px] font-black uppercase tracking-widest" style={{ color: PALETTE.pink.c }}>
          Bé Hay Học · học mỗi ngày, tự tin vươn xa
        </p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-2">
          <h2 id="chon-lop-h" className="kid-display text-2xl font-black sm:text-3xl" style={{ color: PALETTE.purple.c }}>
            {lop == null ? 'Bé đang học lớp mấy?' : `Đang xem: ${name}`}
          </h2>
          {lop != null && (
            <Link href={gradeHref(lop)} className="kid-display text-sm font-black hover:underline" style={{ color: PALETTE.purple.c }}>
              Trang {lower} đầy đủ →
            </Link>
          )}
        </div>
        <div role="group" aria-label="Chọn lớp của bé" className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {ALL_GRADES.map((g) => {
            const on = lop === g;
            const c = GRADE_COLOR[g];
            return (
              <button
                key={g}
                type="button"
                aria-pressed={on}
                onClick={() => setLopCuaBe(on ? null : g)}
                className="kid-display flex flex-col items-center rounded-2xl border-2 px-2 py-2.5 transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={on ? { background: c, borderColor: c, color: '#fff' } : { background: '#fff', borderColor: `${c}33`, color: c }}
              >
                <span className="text-lg font-black leading-tight sm:text-xl">{gradeName(g)}</span>
                <span className={`text-[11px] font-bold ${on ? 'text-white/85' : 'text-slate-400'}`}>{GRADE_AGE[g]}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs font-bold text-slate-500">
          {lop == null ? 'Chọn một lần, lần sau vào là thấy đúng lớp của bé.' : 'Bấm lại lớp đang chọn để bỏ chọn.'}
        </p>
      </section>

      {/* 2. Hôm nay của bé */}
      <HomNayCuaBe />

      {/* 3. Ba môn của lớp */}
      <section aria-label="Môn học" className="grid gap-4 lg:grid-cols-3">
        {subjects.map(({ key, s, title, href, list }) => (
          <div key={key} className="min-w-0 rounded-[28px] border-2 bg-white p-4" style={{ borderColor: s.palette.border }}>
            <div className="mb-3 flex items-center gap-2">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-xl" style={{ background: s.palette.soft }} aria-hidden>{s.emoji}</span>
              <h2 className="kid-display min-w-0 flex-1 text-lg font-black text-slate-900">{title}</h2>
              <Link href={href} className="shrink-0 rounded-full px-3 py-1 text-xs font-black" style={{ background: s.palette.soft, color: s.palette.c }}>Tất cả →</Link>
            </div>
            <ul className="grid gap-2">
              {items(list).map((it) => (
                <li key={it.href}><ItemCard item={it} compact /></li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* 4. Sắp thi */}
      <section className="rounded-[28px] border-2 bg-white p-4 sm:p-5" style={{ borderColor: KIND_META['de-thi'].palette.border }} aria-labelledby="sap-thi-h">
        <div className="flex flex-wrap items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-xl" style={{ background: KIND_META['de-thi'].palette.soft }} aria-hidden>📝</span>
          <div className="min-w-0 flex-1">
            <h2 id="sap-thi-h" className="kid-display text-lg font-black text-slate-900 sm:text-xl">Sắp thi {data.term}</h2>
            <p className="text-sm text-slate-600">
              {block.exam
                ? `${block.exam.total} đề ${lower} có chấm điểm: ${block.exam.toan} đề Toán${block.exam.tiengViet ? `, ${block.exam.tiengViet} đề Tiếng Việt` : ''}.`
                : lop === 0
                  ? 'Mẫu giáo chưa có đề thi — cho bé chơi đố vui và tập viết là đủ.'
                  : 'Đề giữa kì, cuối kì lớp 1–5, làm trên máy và chấm ngay.'}
            </p>
          </div>
          {block.exam && (
            <Link href={block.exam.href} className="kid-display shrink-0 rounded-full bg-orange-500 px-4 py-2 text-sm font-black text-white shadow-[0_3px_0_#c2410c] hover:bg-orange-600">
              Làm đề {lower} →
            </Link>
          )}
        </div>
        {lop == null && (
          <div className="mt-3 flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((g) => (
              <Link key={g} href={`/thi-lop-${g}`} className="kid-display rounded-full border-2 border-orange-200 px-3.5 py-1.5 text-sm font-black text-orange-700 hover:bg-orange-50">
                Đề lớp {g}
              </Link>
            ))}
          </div>
        )}
        {items(block.packs).length > 0 && (
          <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {items(block.packs).map((it) => (
              <li key={it.href} className="min-w-0"><ItemCard item={it} compact /></li>
            ))}
          </ul>
        )}
      </section>

      {/* 5. Trò chơi hợp lớp */}
      <section className="rounded-[28px] border-2 bg-white p-4 sm:p-5" style={{ borderColor: KIND_META['tro-choi'].palette.border }} aria-labelledby="choi-h">
        <div className="mb-3 flex items-center gap-2">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-xl" style={{ background: KIND_META['tro-choi'].palette.soft }} aria-hidden>🎮</span>
          <h2 id="choi-h" className="kid-display min-w-0 flex-1 text-lg font-black text-slate-900 sm:text-xl">
            {lop == null ? 'Chơi mà học' : `Trò chơi hợp ${lower}`}
          </h2>
          <Link href="/tro-choi" className="shrink-0 rounded-full px-3 py-1 text-xs font-black" style={{ background: KIND_META['tro-choi'].palette.soft, color: KIND_META['tro-choi'].palette.c }}>Kho trò chơi →</Link>
        </div>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {items(block.games).map((it) => (
            <li key={it.href} className="min-w-0"><ItemCard item={it} compact /></li>
          ))}
        </ul>
      </section>
    </div>
  );
}
