import type { Metadata } from 'next';
import Link from 'next/link';
import { getPublishedCourses } from '../lib/topicSeo';
import { gamesData } from '../components/edu/data/gamesData';
import { SITE_NAME, canonical } from '../lib/seo';
import { KidShell, KidCrumb, KidHero, KidCard, KidPills } from '../components/seo/kid';

// Tìm kiếm nội bộ: /tim-kiem?q=... — khớp target WebSite SearchAction. Trang KQ noindex.
export const revalidate = 3600;

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const metadata: Metadata = {
  title: 'Tìm kiếm',
  description: 'Tìm khóa học, bài tập, đề thi, trò chơi và bài viết trên Bé Hay Học.',
  alternates: { canonical: canonical('/tim-kiem') },
  robots: { index: false, follow: true },
};

type Entry = { href: string; label: string; kind: string };

function norm(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
}

const STATIC_ENTRIES: Entry[] = [
  { href: '/khoa-hoc', label: 'Khóa học cho bé', kind: 'Khu vực' },
  { href: '/bai-tap', label: 'Bài tập theo chủ đề', kind: 'Khu vực' },
  { href: '/phieu-bai-tap', label: 'Phiếu bài tập PDF', kind: 'Khu vực' },
  { href: '/de-thi', label: 'Đề thi & kiểm tra', kind: 'Khu vực' },
  { href: '/tro-choi', label: 'Trò chơi học tập', kind: 'Khu vực' },
  { href: '/tu-vung-tieng-anh', label: 'Từ vựng tiếng Anh', kind: 'Khu vực' },
  { href: '/cong-cu', label: 'Công cụ miễn phí', kind: 'Khu vực' },
  { href: '/toan-tu-duy', label: 'Toán tư duy', kind: 'Chuyên đề' },
  { href: '/bang-cuu-chuong', label: 'Bảng cửu chương', kind: 'Chuyên đề' },
  { href: '/bang-chu-cai', label: 'Bảng chữ cái tiếng Việt', kind: 'Chuyên đề' },
  { href: '/luyen-viet-chu', label: 'Luyện viết chữ', kind: 'Chuyên đề' },
  ...['1', '2', '3', '4', '5'].map((g) => ({ href: `/lop-${g}`, label: `Học lớp ${g}`, kind: 'Theo lớp' })),
  ...['1', '2', '3', '4', '5'].map((g) => ({ href: `/de-thi-lop-${g}`, label: `Đề thi lớp ${g}`, kind: 'Đề thi' })),
  ...['1', '2', '3', '4', '5'].map((g) => ({ href: `/toan-tu-duy-lop-${g}`, label: `Toán tư duy lớp ${g}`, kind: 'Toán tư duy' })),
];

async function fetchArticles(): Promise<Entry[]> {
  try {
    const res = await fetch(`${API}/api/articles?limit=200`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json = await res.json();
    const list = (Array.isArray(json) ? json : (json?.data ?? [])) as { title?: string; slug?: string; isPublished?: boolean }[];
    return list
      .filter((a) => a.slug && a.title && a.isPublished !== false)
      .map((a) => ({ href: `/bai-viet/${a.slug}`, label: a.title as string, kind: 'Bài viết' }));
  } catch { return []; }
}

async function buildIndex(): Promise<Entry[]> {
  const [courses, articles] = await Promise.all([getPublishedCourses().catch(() => []), fetchArticles()]);
  const courseEntries: Entry[] = courses.map((c) => ({ href: `/khoa-hoc/${c.slug}`, label: c.title, kind: 'Khóa học' }));
  const gameEntries: Entry[] = gamesData
    .filter((g) => g.status === 'ready')
    .map((g) => ({ href: `/tro-choi/${g.slug}`, label: `Trò chơi: ${g.title}`, kind: 'Trò chơi' }));
  return [...STATIC_ENTRIES, ...courseEntries, ...gameEntries, ...articles];
}

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.q) ? sp.q[0] : sp.q;
  const q = (raw ?? '').trim();

  const index = await buildIndex();
  const nq = norm(q);
  const results = q ? index.filter((e) => norm(e.label).includes(nq)).slice(0, 60) : [];

  return (
    <KidShell max="3xl">
      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Tìm kiếm' }]} />

      <KidHero emoji="🔎" eyebrow="Tra cứu" title="Tìm kiếm" tone="sky">
        <form action="/tim-kiem" method="get" className="mt-5 flex gap-2">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Tìm khóa học, bài tập, đề thi, trò chơi…"
            aria-label="Từ khóa tìm kiếm"
            className="flex-1 rounded-2xl border-2 border-sky-200 px-4 py-3 text-slate-800 outline-none focus:border-sky-400"
          />
          <button type="submit" className="rounded-2xl px-6 py-3 font-black text-white kid-display kid-btn-3d" style={{ backgroundImage: 'linear-gradient(135deg,#87CEEB,#4ECDC4)', boxShadow: '0 6px 0 #0d7a74' }}>
            Tìm
          </button>
        </form>
      </KidHero>

      {q && results.length > 0 && (
        <div className="mt-6">
          <KidCard emoji="✨" title={`Kết quả cho “${q}”`} tone="green" badge={results.length}>
            <ul className="space-y-2.5">
              {results.map((r) => (
                <li key={`${r.kind}-${r.href}`}>
                  <Link href={r.href} className="flex items-center justify-between gap-3 rounded-2xl border-2 border-slate-100 bg-white px-4 py-3 font-bold text-slate-800 transition hover:-translate-y-0.5 hover:border-sky-300">
                    <span className="min-w-0">{r.label}</span>
                    <span className="shrink-0 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-black text-sky-600">{r.kind}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </KidCard>
        </div>
      )}

      {q && results.length === 0 && (
        <div className="mt-6">
          <KidCard tone="orange">
            <p className="text-center font-bold text-slate-600">Không tìm thấy kết quả cho “{q}”. Thử từ khóa khác hoặc xem các khu vực bên dưới nhé!</p>
          </KidCard>
        </div>
      )}

      {(!q || results.length === 0) && (
        <div className="mt-6">
          <KidCard emoji="🧭" title="Khu vực phổ biến" tone="purple">
            <KidPills items={STATIC_ENTRIES.map((e) => ({ href: e.href, label: e.label }))} />
          </KidCard>
        </div>
      )}
    </KidShell>
  );
}
