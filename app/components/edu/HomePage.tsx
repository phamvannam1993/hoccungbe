import Link from 'next/link';
import Image from 'next/image';
import type { ApiCourse } from '../../lib/api';
import HomeCourseSection from './HomeCourseSection';
import HomeTheoLop, { type GradeBlock, type HomeTheoLopData } from './HomeTheoLop';
import { ALL_GRADES, type CatalogItem, type Grade } from '../../lib/catalog';
import { examSummary, queryCatalog, upcomingTerm } from '../../lib/catalogFull';

interface Article {
  id: number; title: string; slug: string;
  excerpt?: string; thumbnailUrl?: string;
  category?: string; publishedAt?: string; createdAt: string;
}

async function fetchArticles(): Promise<Article[]> {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${base}/api/articles?limit=12&sortBy=createdAt&sortOrder=desc`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
}

async function fetchCourses(): Promise<ApiCourse[]> {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${base}/api/courses?published=true`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}



// ── Dữ liệu khối "theo lớp" (đọc sổ đăng ký app/lib/catalog.ts) ──
// Mục hợp ĐÚNG lớp (ít lớp) xếp trước mục dùng chung nhiều lớp.
const narrowFirst = (xs: CatalogItem[]) => [...xs].sort((a, b) => a.grades.length - b.grades.length);

function buildTheoLop(): HomeTheoLopData {
  const pool: Record<string, CatalogItem> = {};
  const take = (xs: CatalogItem[], n: number) =>
    xs.slice(0, n).map((x) => {
      pool[x.href] = x;
      return x.href;
    });
  const block = (g: Grade | null): GradeBlock => {
    const sort = g == null ? (x: CatalogItem[]) => x : narrowFirst;
    const exam = g == null ? null : examSummary(g);
    return {
      toan: take(sort(queryCatalog({ grade: g, subject: ['toan', 'tu-duy'], kind: ['cong-cu', 'khoa-hoc'] })), 4),
      tv: take(sort(queryCatalog({ grade: g, subject: 'tieng-viet', kind: 'cong-cu' })), 4),
      ta: take(sort(queryCatalog({ grade: g, subject: 'tieng-anh', kind: 'cong-cu' })), 4),
      games: take(sort(queryCatalog({ grade: g, kind: 'tro-choi' })), 8),
      packs: g == null || g === 0 ? [] : take(queryCatalog({ grade: g, kind: 'tai-lieu' }).filter((x) => x.paid), 2),
      exam: exam && { href: exam.href, toan: exam.toan, tiengViet: exam.tiengViet, total: exam.total },
    };
  };
  const byGrade: Record<string, GradeBlock> = {};
  for (const g of ALL_GRADES) byGrade[String(g)] = block(g);
  return { pool, byGrade, general: block(null), term: upcomingTerm() };
}

// Dải cam kết — trả lời câu hỏi "vì sao nên dùng" ngay trên màn hình đầu.
const DIEM_MANH = [
  { emoji: '⭐', d1: 'Nội dung bám sát', d2: 'chương trình của Bộ GD&ĐT', mau: '#fef3c7' },
  { emoji: '💗', d1: 'Giao diện thân thiện', d2: 'phù hợp với trẻ em', mau: '#fce7f3' },
  { emoji: '📊', d1: 'Bài học đa dạng', d2: 'hấp dẫn, sinh động', mau: '#d1fae5' },
  { emoji: '🛡️', d1: 'Theo dõi tiến độ học tập', d2: 'dễ dàng', mau: '#e0f2fe' },
  { emoji: '👨‍👩‍👧', d1: 'Đồng hành cùng phụ huynh', d2: 'trong hành trình học của con', mau: '#ede9fe' },
];

// Dải "Khám phá": link tới MỌI hub chính từ trang chủ (trang mạnh nhất) → dồn internal
// link về các trang money-keyword. Trước đây trang chủ chỉ link /khoa-hoc + /tro-choi.
const HUBS = [
  { href: '/khoa-hoc', emoji: '📚', label: 'Khóa học', c: '#FF6B9D' },
  { href: '/tieng-viet', emoji: '📖', label: 'Tiếng Việt', c: '#c81e5b' },
  { href: '/hoc-toan', emoji: '🔢', label: 'Công cụ Toán', c: '#6d28d9' },
  { href: '/tai-lieu-in', emoji: '🖨️', label: 'Tài liệu in', c: '#a16207' },
  { href: '/bai-tap', emoji: '✏️', label: 'Bài tập theo chủ đề', c: '#FF9F45' },
  { href: '/phieu-bai-tap', emoji: '📄', label: 'Phiếu bài tập PDF', c: '#4ECDC4' },
  { href: '/de-thi', emoji: '📝', label: 'Đề thi có chấm điểm', c: '#A06CD5' },
  { href: '/tro-choi', emoji: '🎮', label: 'Trò chơi học tập', c: '#38BDF8' },
  { href: '/kham-pha', emoji: '🔎', label: 'Đố vui khám phá', c: '#22C55E' },
  { href: '/san-choi-tri-tue', emoji: '🎯', label: 'Sân chơi Trí tuệ', c: '#7C3AED' },
  { href: '/thi-tai', emoji: '🏆', label: 'Thi Tài giành huy chương', c: '#F97316' },
  { href: '/trieu-phu-nhi', emoji: '👑', label: 'Ai Là Triệu Phú Nhí', c: '#FFC42E' },
  { href: '/vong-tron-am', emoji: '🎡', label: 'Vòng tròn âm vần', c: '#EF4444' },
  { href: '/noi-am-van', emoji: '🔗', label: 'Game nối âm vần', c: '#6366F1' },
  { href: '/vong-tu-vung', emoji: '🔤', label: 'Vòng tròn từ vựng Anh', c: '#0EA5E9' },
  { href: '/luyen-nghe', emoji: '🎧', label: 'Luyện nghe tiếng Anh', c: '#8B5CF6' },
  { href: '/hoc-tieng-anh', emoji: '🦉', label: 'Game học tiếng Anh', c: '#10B981' },
  { href: '/tinh-huong-tieng-anh', emoji: '🗣️', label: '360 tình huống nói với con', c: '#FF6B9D' },
  { href: '/tu-vung-tieng-anh', emoji: '🔤', label: 'Từ vựng tiếng Anh', c: '#6BCB77' },
  { href: '/cong-cu', emoji: '🛠️', label: 'Công cụ miễn phí', c: '#8B5CF6' },
  { href: '/bai-viet', emoji: '📖', label: 'Góc phụ huynh', c: '#F59E0B' },
];

export default async function HomePage() {
  const [courses, articles] = await Promise.all([fetchCourses(), fetchArticles()]);
  const theoLop = buildTheoLop();

  return (
    <main className="kid-bg relative overflow-hidden">
      {/* Banner giữ nguyên như trước (người dùng 20/11/2026: "banner không được thay đổi"); sau banner là khối
          "cấu trúc mới": hỏi lớp → hôm nay của bé → ba môn của lớp → sắp thi → trò chơi hợp lớp → khóa học, bài viết, tài liệu. */}
      {/* ── HERO ──
          Ảnh banner đã vẽ sẵn cả chữ lẫn nút, tỉ lệ 1536×370 (rất ngang). Dùng
          thẳng ảnh ở màn rộng thì đẹp đúng như bản thiết kế; nhưng ở màn hẹp
          ảnh co lại còn vài chục pixel chiều cao, chữ trong ảnh không đọc nổi —
          nên mobile dựng lại bằng chữ thật trên nền trời.

          Chữ trong ảnh máy tìm kiếm và trình đọc màn hình đều không thấy, nên
          <h1> thật vẫn phải có: ở mobile thì hiện, ở desktop thì ẩn bằng sr-only. */}
      <section className="relative" aria-label="Giới thiệu Bé Hay Học">
        {/* Màn rộng: dùng đúng ảnh thiết kế */}
        <Link href="/khoa-hoc" className="relative hidden lg:block" aria-label="Bắt đầu học ngay">
          <Image
            src="/assets/images/banner.png"
            alt="Bé Hay Học — học mỗi ngày, tự tin vươn xa. Học Toán, Tiếng Việt, Tiếng Anh cho học sinh tiểu học."
            width={1536} height={370} priority
            className="h-auto w-full"
          />
          <h1 className="sr-only">Học mỗi ngày, tự tin vươn xa — Bé Hay Học</h1>
        </Link>

        {/* Màn hẹp: chữ thật trên nền trời, đọc được ở mọi cỡ */}
        <div className="relative overflow-hidden rounded-b-[36px] lg:hidden"
          style={{ background: 'linear-gradient(180deg,#bfe9ff 0%,#daf3ff 45%,#eaf9e6 100%)' }}>
          <div className="pointer-events-none absolute inset-0 select-none" aria-hidden>
            <span className="absolute left-[6%] top-[12%] text-4xl opacity-80">☁️</span>
            <span className="absolute right-[8%] top-[6%] text-3xl opacity-70">☁️</span>
            <span className="absolute right-[12%] bottom-[8%] text-5xl opacity-90">🏫</span>
          </div>
          <div className="relative px-4 pb-8 pt-7">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-[11px] font-black text-slate-600 shadow-sm">
              ⭐ Nền tảng học tập dành cho học sinh tiểu học
            </span>
            <h1 className="kid-display mt-3 text-[32px] font-black leading-[1.1]">
              <span className="block text-[#1e5aa8]">Học mỗi ngày</span>
              <span className="block text-[#f5911e]">Tự tin vươn xa</span>
            </h1>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-600">
              Bé Hay Học giúp bé học Toán, Tiếng Việt, Tiếng Anh qua các bài học sinh động,
              trò chơi hấp dẫn và phương pháp khoa học, hiệu quả.
            </p>
            <Link href="/khoa-hoc"
              className="mt-5 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-black text-[#7a4a00] transition active:translate-y-0.5"
              style={{ background: 'linear-gradient(180deg,#ffd452 0%,#f7b731 100%)', boxShadow: '0 5px 0 #d99a12' }}>
              ▶ Bắt đầu học ngay
            </Link>
          </div>
        </div>
      </section>

      <HomeTheoLop data={theoLop} />

      {/* ── COURSES ── */}
      <section className="mx-auto w-full max-w-[1200px] px-4 py-5 sm:px-6">
        <div className="bg-white rounded-3xl border-4 border-pink-200 p-4 sm:p-8" style={{ boxShadow: '0 8px 30px rgba(255,107,157,0.20)' }}>
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-widest mb-0.5 kid-display" style={{ color: '#FF6B9D' }}>🎓 Khóa học</p>
              <h2 className="text-xl sm:text-3xl font-black kid-display" style={{ background: 'linear-gradient(135deg, #FF6B9D, #FFD93D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Các khóa học dành cho bé</h2>
            </div>
            {/* Link chữ cho gọn, không dùng nút to */}
            <Link href="/khoa-hoc" className="shrink-0 text-xs sm:text-sm font-black kid-display text-[#FF6B9D] hover:underline">
              Xem tất cả →
            </Link>
          </div>

          <HomeCourseSection courses={courses} />
        </div>
      </section>

      {/* ── BÀI VIẾT ── */}
      {articles.length > 0 && (
        <section className="mx-auto w-full max-w-[1200px] px-4 py-5 sm:px-6">
          <div className="bg-white rounded-3xl border-4 border-cyan-200 p-6 sm:p-8" style={{ boxShadow: '0 8px 30px rgba(78,205,196,0.20)' }}>
            <div className="flex items-end justify-between mb-6 flex-wrap gap-2">
              <div>
                <p className="text-xs font-black uppercase tracking-widest mb-1 kid-display" style={{ color: '#4ECDC4' }}>📚 Góc kiến thức</p>
                <h2 className="text-2xl sm:text-3xl font-black kid-display" style={{ background: 'linear-gradient(135deg, #4ECDC4, #FF6B9D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Bài viết hữu ích cho ba mẹ</h2>
              </div>
              <Link href="/bai-viet" className="text-sm font-black kid-display px-4 py-2 rounded-full text-white shrink-0" style={{ background: 'linear-gradient(135deg, #4ECDC4, #6BCB77)', boxShadow: '0 3px 0 #0e9488' }}>
                Xem tất cả →
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
              {articles.map((article, idx) => {
                const colors = ['#FF6B9D', '#4ECDC4', '#A06CD5', '#FF9F45'];
                const c = colors[idx % colors.length];
                return (
                  <Link key={article.id} href={`/bai-viet/${article.slug}`}
                    className="group flex flex-col rounded-3xl overflow-hidden kid-card-hover bg-white snap-start shrink-0"
                    style={{ width: 220, border: `3px solid ${c}`, boxShadow: `0 4px 0 ${c}66` }}>
                    <div className="relative w-full aspect-[16/9] shrink-0" style={{ background: `linear-gradient(135deg, ${c}, ${c}88)` }}>
                      {article.thumbnailUrl
                        ? <Image src={article.thumbnailUrl} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
                        : <div className="absolute inset-0 flex items-center justify-center text-4xl">📝</div>
                      }
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-black text-slate-900 text-sm leading-snug line-clamp-2 flex-1 kid-display">{article.title}</h3>
                      {article.excerpt && (
                        <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                          {article.excerpt.length > 160 ? `${article.excerpt.slice(0, 157)}…` : article.excerpt}
                        </p>
                      )}
                      <span className="mt-3 text-xs font-black px-3 py-1.5 rounded-full text-white w-fit kid-display" style={{ background: c, boxShadow: `0 2px 0 ${c}99` }}>Đọc thêm »</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── TÀI LIỆU IN ── */}
      <section className="mx-auto w-full max-w-[1200px] px-4 py-5 sm:px-6" aria-labelledby="tai-lieu-in-h">
        <div className="flex flex-col gap-3 rounded-[28px] border-2 border-amber-200 bg-white p-5 sm:flex-row sm:items-center">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-50 text-2xl" aria-hidden>🖨️</span>
          <div className="min-w-0 flex-1">
            <h2 id="tai-lieu-in-h" className="kid-display text-lg font-black text-slate-900 sm:text-xl">Tài liệu in cho bé</h2>
            <p className="text-sm text-slate-600">Phiếu bài tập miễn phí, phiếu tập viết ô li và bộ đề in A4 kèm đáp án — lọc theo lớp, theo môn.</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Link href="/tai-lieu-in" className="kid-display rounded-full bg-amber-500 px-4 py-2 text-sm font-black text-white shadow-[0_3px_0_#b45309]">Xem tài liệu in →</Link>
            <Link href="/goi-tai-lieu" className="kid-display rounded-full bg-amber-50 px-4 py-2 text-sm font-black text-amber-800">Gói tài liệu</Link>
          </div>
        </div>
      </section>

      {/* ── DẢI CAM KẾT ── */}
      <section className="mx-auto w-full max-w-[1200px] px-4 py-5 sm:px-6" aria-label="Vì sao chọn Bé Hay Học">
        <ul className="grid grid-cols-1 gap-x-2 gap-y-3 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-slate-100 lg:grid-cols-5">
          {DIEM_MANH.map((d) => (
            <li key={d.d1} className="flex items-center gap-2.5 px-2">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-lg"
                style={{ background: d.mau }} aria-hidden>{d.emoji}</span>
              <span className="min-w-0 text-[11px] font-bold leading-tight text-slate-600 sm:text-xs">
                <span className="block text-slate-800">{d.d1}</span>
                {d.d2}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── KHÁM PHÁ — GẤP LẠI ──
          17 lối vào này cần cho tìm kiếm (dồn liên kết nội bộ từ trang mạnh nhất),
          nhưng bày hết ra đầu trang thì người vào rối, không biết bắt đầu từ đâu.
          Gấp vào một thẻ mở-đóng: ai cần thì mở, ai không thì không thấy. */}
      <section className="mx-auto w-full max-w-[1200px] px-4 py-5 sm:px-6" aria-label="Khám phá Bé Hay Học">
        <details className="bg-white rounded-3xl border-4 border-sky-200 p-4 sm:p-6" style={{ boxShadow: '0 8px 30px rgba(56,189,248,0.18)' }}>
          <summary className="cursor-pointer text-lg sm:text-2xl font-black kid-display text-slate-900">Xem tất cả nội dung của Bé Hay Học</summary>
          <div className="h-4" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {HUBS.map((h) => (
              <Link
                key={h.href}
                href={h.href}
                className="flex items-center gap-2 rounded-2xl border-2 bg-white px-3 py-3 kid-card-hover"
                style={{ borderColor: h.c, boxShadow: `0 3px 0 ${h.c}aa` }}
              >
                <span className="text-2xl leading-none" aria-hidden>{h.emoji}</span>
                <span className="font-black text-xs sm:text-sm text-slate-800 kid-display leading-tight">{h.label}</span>
              </Link>
            ))}
          </div>

          {/* Học theo lớp: link tới hub /lop-1…5 (gom cả 3 môn của từng lớp) */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm font-black text-slate-700 kid-display">Học theo lớp:</span>
            <Link href="/lop/mau-giao" className="rounded-full bg-slate-100 px-4 py-1.5 text-sm font-black text-slate-700 hover:bg-sky-100 hover:text-sky-700 kid-display">Mẫu giáo</Link>
            {['1', '2', '3', '4', '5'].map((gr) => (
              <Link
                key={gr}
                href={`/lop-${gr}`}
                className="rounded-full bg-slate-100 px-4 py-1.5 text-sm font-black text-slate-700 hover:bg-sky-100 hover:text-sky-700 kid-display"
              >
                Lớp {gr}
              </Link>
            ))}
          </div>

          {/* Chuyên đề evergreen (keyword traffic cao) */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-sm font-black text-slate-700 kid-display">Chuyên đề:</span>
            <Link href="/hoc-toan" className="rounded-full bg-sky-100 px-4 py-1.5 text-sm font-black text-sky-800 hover:bg-sky-200 kid-display">🔢 Học Toán (10 công cụ)</Link>
            <Link href="/toan-tu-duy" className="rounded-full bg-slate-100 px-4 py-1.5 text-sm font-black text-slate-700 hover:bg-violet-100 hover:text-violet-700 kid-display">Toán tư duy</Link>
            <Link href="/bang-cuu-chuong" className="rounded-full bg-slate-100 px-4 py-1.5 text-sm font-black text-slate-700 hover:bg-amber-100 hover:text-amber-700 kid-display">Bảng cửu chương</Link>
            <Link href="/bang-chu-cai" className="rounded-full bg-slate-100 px-4 py-1.5 text-sm font-black text-slate-700 hover:bg-pink-100 hover:text-pink-700 kid-display">Bảng chữ cái</Link>
            <Link href="/luyen-viet-chu" className="rounded-full bg-slate-100 px-4 py-1.5 text-sm font-black text-slate-700 hover:bg-teal-100 hover:text-teal-700 kid-display">Luyện viết chữ</Link>
            <Link href="/xem-dong-ho" className="rounded-full bg-slate-100 px-4 py-1.5 text-sm font-black text-slate-700 hover:bg-blue-100 hover:text-blue-700 kid-display">Xem đồng hồ</Link>
            <Link href="/phan-so" className="rounded-full bg-slate-100 px-4 py-1.5 text-sm font-black text-slate-700 hover:bg-orange-100 hover:text-orange-700 kid-display">Phân số</Link>
            <Link href="/bang-phien-am-ipa" className="rounded-full bg-slate-100 px-4 py-1.5 text-sm font-black text-slate-700 hover:bg-sky-100 hover:text-sky-700 kid-display">Bảng phiên âm IPA</Link>
          </div>
        </details>
      </section>

      {/* ── CTA ── */}
      <section className="mx-auto w-full max-w-[1200px] px-4 py-5 sm:px-6">
        <div className="rounded-[32px] px-8 py-10 text-center text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #FF6B9D 0%, #FFD93D 50%, #4ECDC4 100%)', boxShadow: '0 12px 40px rgba(255,107,157,0.35)' }}>
          <span aria-hidden className="absolute top-4 left-6 text-4xl opacity-80" style={{ animation: 'wiggle 3s infinite' }}>🚀</span>
          <span aria-hidden className="absolute bottom-4 right-6 text-4xl opacity-80" style={{ animation: 'bounce-pop 2.5s infinite' }}>🌟</span>
          <h2 className="text-3xl sm:text-4xl font-black mb-3 kid-display drop-shadow-md">Bắt đầu cùng bé hôm nay 🎉</h2>
          <p className="text-white/90 text-sm leading-relaxed max-w-lg mx-auto mb-6">
            Đăng ký miễn phí, khám phá bài học và trò chơi phù hợp với độ tuổi của bé ngay bây giờ.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/dang-ky"
              className="kid-btn-3d text-sm" style={{ background: 'white', color: '#FF6B9D', boxShadow: '0 6px 0 rgba(0,0,0,0.18)' }}>
              ✨ Đăng ký miễn phí
            </Link>
            <Link href="/khoa-hoc"
              className="kid-btn-3d text-sm" style={{ background: 'linear-gradient(135deg, #A06CD5, #6d28d9)', boxShadow: '0 6px 0 #4c1d95' }}>
              📚 Xem khóa học
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
