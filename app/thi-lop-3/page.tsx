import Link from 'next/link';
import { NHOM_DE, THI_LOP_3 } from './de';
import PackUpsell from '../components/upsell/PackUpsell';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://behayhoc.com';

/** Khu thi riêng cho lớp 3: 5 đề Toán giữa kì 1 và 20 đề kiểm tra học kì 1 — chấm điểm ngay trên trang. */
export default function ThiLop3Page() {
  const soToan = THI_LOP_3.filter((e) => e.mon === 'toan').length;
  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Thi thử lớp 3 – Toán',
    numberOfItems: THI_LOP_3.length,
    itemListElement: THI_LOP_3.map((e, i) => ({ '@type': 'ListItem', position: i + 1, name: e.title, url: `${SITE}/thi-lop-3/${e.slug}` })),
  };

  return (
    <div className="kid-bg relative min-h-screen overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />

      <div className="relative mx-auto max-w-4xl px-4 pb-2 pt-4 sm:px-6">
        <nav className="flex items-center gap-1.5 text-sm font-bold">
          <Link href="/" className="text-pink-600 hover:text-pink-700">🏠 Trang chủ</Link>
          <span className="text-purple-400">›</span>
          <Link href="/lop-3" className="text-pink-600 hover:text-pink-700">Lớp 3</Link>
          <span className="text-purple-400">›</span>
          <span className="text-purple-700">Thi thử</span>
        </nav>
      </div>

      <div className="relative mx-auto max-w-4xl px-4 py-4 sm:px-6">
        <div className="mb-6 rounded-[32px] border-4 border-pink-200 bg-white p-6 sm:p-8" style={{ boxShadow: '0 8px 30px rgba(255,107,157,0.20)' }}>
          <div className="mb-2 flex items-center gap-3">
            <span className="text-4xl">🏆</span>
            <h1
              className="text-2xl font-black kid-display sm:text-3xl"
              style={{ background: 'linear-gradient(135deg, #FF6B9D, #A06CD5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Thi thử lớp 3 – Toán
            </h1>
          </div>
          <p className="text-sm font-medium leading-7 text-purple-700/90 sm:text-base">
            <strong>{soToan} đề Toán lớp 3</strong>: 5 đề kiểm tra giữa kì 1 (Kết nối tri thức) và 20 đề kiểm tra học kì 1 — trình bày y như tờ đề giấy, có hình vẽ.
            Bé điền thẳng vào tờ đề, đặt tính, tìm x, đếm hình; nộp bài là có điểm trong ô &quot;Điểm&quot; và đáp án từng ô.
          </p>
        </div>

        <div className="mb-8 grid gap-3 lg:grid-cols-2">
          <PackUpsell slug="de-giua-ki-1-toan-lop-3" spot="thi-lop-3-hub" title="In 5 đề giữa kì 1 Toán lớp 3, kèm đáp án" />
          <PackUpsell slug="de-hoc-ki-1-toan-lop-3" spot="thi-lop-3-hub" title="In 20 đề kiểm tra học kì 1 Toán lớp 3, kèm đáp án" />
        </div>

        {NHOM_DE.map((nhom) => (
          <section key={nhom.key} className="mb-8">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">{nhom.icon}</span>
              <h2 className="text-xl font-black text-purple-800 kid-display">{nhom.title}</h2>
            </div>
            <p className="mb-4 text-sm font-medium text-purple-700/80">{nhom.desc}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {nhom.items.map((e) => (
                <Link
                  key={e.slug}
                  href={`/thi-lop-3/${e.slug}`}
                  className="group rounded-3xl border-4 border-purple-100 bg-white p-4 transition-transform hover:-translate-y-0.5 hover:border-pink-200"
                  style={{ boxShadow: '0 6px 20px rgba(160,108,213,0.12)' }}>
                  <p className="font-black leading-snug text-slate-800 group-hover:text-pink-600">{e.title}</p>
                  {e.description ? <p className="mt-1 text-sm text-slate-500">{e.description}</p> : null}
                  <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
                    <span className="rounded-full bg-sky-50 px-2.5 py-1 text-sky-700">{e.bai.length} bài · {e.soO} ô</span>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">Chấm điểm ngay</span>
                    {e.thoiGian ? <span className="rounded-full bg-rose-50 px-2.5 py-1 text-rose-700">{e.thoiGian} phút</span> : null}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <p className="pb-8 text-center text-sm font-semibold text-purple-600">
          Muốn thêm đề có chấm điểm cho các lớp khác? Xem <Link href="/de-thi" className="underline">kho đề thi</Link>.
        </p>
      </div>
    </div>
  );
}
