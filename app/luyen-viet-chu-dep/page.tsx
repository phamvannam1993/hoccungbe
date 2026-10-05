import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { KidShell, KidCrumb, KidHero, KidFaq } from '../components/seo/kid';
import { CAC_BO, taoTrang, nhomTheoDoCao, NET_CO_BAN } from '../lib/luyenViet';

export const revalidate = 86400;

const TITLE = 'Luyện viết chữ đẹp lớp 1 – Vở tập viết ô li in miễn phí (PDF)';
const DESCRIPTION =
  'Bộ phiếu tập viết chữ đẹp cho bé lớp 1: 13 nét cơ bản, 29 chữ cái thường, chữ hoa, chữ số, vần, từ ngữ và câu ngắn. In trên khung ô li 5mm đúng vở tập viết, có nét mờ để bé tô theo. Tải PDF miễn phí.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/luyen-viet-chu-dep') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/luyen-viet-chu-dep'),
    type: 'website',
    siteName: SITE_NAME,
    locale: 'vi_VN',
    images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [`${SITE_URL}/og-home.jpg`] },
};

export default function Page() {
  const bos = CAC_BO.map((b) => ({ ...b, soTrang: taoTrang(b.slug).length }));
  const tong = bos.reduce((s, b) => s + b.soTrang, 0);

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Luyện viết chữ đẹp', item: `${SITE_URL}/luyen-viet-chu-dep` },
    ],
  };

  // Bảng này là thứ ba mẹ hay tra nhất khi kèm bé viết.
  const nhomCao = nhomTheoDoCao();

  return (
    <KidShell max="5xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Luyện viết chữ đẹp' }]} />

      <KidHero
        emoji="✍️"
        eyebrow="Vở tập viết in tại nhà"
        title="Luyện viết chữ đẹp cho bé"
        tone="blue"
        description={
          <>
            {tong} trang phiếu tập viết trên <strong>khung ô li 5mm</strong> đúng như vở tập viết ở lớp. Mỗi dòng có
            <strong> chữ mẫu đậm</strong> để bé nhìn, <strong>chữ mờ</strong> để bé tô theo, rồi khoảng trống để bé tự viết.
          </>
        }
      >
        <p className="mt-4 text-sm font-semibold text-slate-500">
          Bấm vào một bộ, rồi bấm <strong>In / Tải PDF</strong>. Miễn phí, in lại bao nhiêu lần cũng được.
        </p>
        <Link
          href="/luyen-viet-chu"
          className="mt-3 inline-flex items-center gap-2 rounded-2xl border-2 border-slate-200 px-5 py-3 text-sm font-black text-slate-700 hover:bg-slate-50"
        >
          ✍️ Chưa có máy in? Chơi trò tô chữ trên màn hình
        </Link>
      </KidHero>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {bos.map((b) => (
          <Link
            key={b.slug}
            href={`/luyen-viet-chu-dep/${b.slug}`}
            className="group rounded-3xl border-2 border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-md"
            style={{ borderTopColor: b.mau, borderTopWidth: 6 }}
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl" aria-hidden>{b.emoji}</span>
              <div className="min-w-0">
                <h2 className="text-lg font-black text-slate-800 group-hover:underline">{b.ten}</h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">{b.moTa}</p>
                <p className="mt-2 text-xs font-bold" style={{ color: b.mau }}>
                  {b.lop} · {b.soTrang} trang A4
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Bảng độ cao — nội dung ba mẹ tra nhiều, cũng là phần kéo tìm kiếm */}
      <section className="mt-8 rounded-3xl border-2 border-slate-100 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black text-slate-800">Độ cao chuẩn của chữ viết thường</h2>
        <p className="mt-1 text-sm font-semibold text-slate-500">
          Theo mẫu chữ viết trong trường tiểu học. Bé viết đúng độ cao thì chữ tự khắc đều và đẹp.
        </p>
        <ul className="mt-4 space-y-2">
          {nhomCao.map((n) => (
            <li key={n.cao} className="flex flex-wrap items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3">
              <span className="w-24 shrink-0 text-sm font-black text-blue-600">
                {String(n.cao).replace('.', ',')} ô li
              </span>
              <span className="font-chu-mau text-2xl font-bold tracking-widest text-slate-700">
                {n.chu.join(' ')}
              </span>
            </li>
          ))}
          <li className="flex flex-wrap items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3">
            <span className="w-24 shrink-0 text-sm font-black text-blue-600">Thò xuống</span>
            <span className="text-sm font-semibold text-slate-600">
              Chữ <b>g</b>, <b>y</b> thò xuống 3 ô li; chữ <b>p</b>, <b>q</b> thò xuống 2 ô li dưới dòng kẻ.
            </span>
          </li>
        </ul>
      </section>

      <section className="mt-8 rounded-3xl border-2 border-slate-100 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black text-slate-800">Học viết theo thứ tự nào?</h2>
        <ol className="mt-3 space-y-2 text-sm font-semibold text-slate-600">
          <li><b>1. Nét cơ bản</b> — {NET_CO_BAN.length} nét. Viết được nét rồi mới ghép thành chữ, bỏ qua bước này là chữ bé xấu về sau.</li>
          <li><b>2. Chữ cái thường</b> — 29 chữ, viết đúng độ cao từng chữ.</li>
          <li><b>3. Chữ số và chữ hoa</b> — dùng khi viết tên riêng và đầu câu.</li>
          <li><b>4. Vần và từ</b> — tập nối chữ, canh khoảng cách giữa các chữ.</li>
          <li><b>5. Câu ngắn</b> — viết hoa đầu câu, chấm cuối câu.</li>
        </ol>
      </section>

      <div className="mt-8">
        <KidFaq
          tone="blue"
          items={[
            {
              q: 'Phiếu có mất phí không?',
              a: 'Không. Toàn bộ phiếu in và tải PDF miễn phí, dùng cho gia đình và lớp học đều được.',
            },
            {
              q: 'In bằng máy in thường có được không?',
              a: 'Được. Phiếu thiết kế khổ A4, lề 12mm, chỉ dùng mực đen và xanh nhạt nên in máy phun hay laser đều rõ.',
            },
            {
              q: 'Ô li 5mm có đúng vở của con không?',
              a: 'Đúng. Vở ô li tiểu học dùng ô vuông 5mm, phiếu vẽ đúng kích thước đó nên bé chuyển sang viết vở không bị lạ tay. Khi in nhớ chọn tỉ lệ 100%, đừng chọn "Fit to page".',
            },
            {
              q: 'Bé mấy tuổi thì bắt đầu được?',
              a: 'Khoảng 5 tuổi có thể bắt đầu với bộ Nét cơ bản. Chữ cái và vần hợp với bé vào lớp 1.',
            },
            {
              q: 'Mỗi ngày nên cho bé viết bao nhiêu?',
              a: 'Một trang là đủ, khoảng 10–15 phút. Viết ít mà đều tay tốt hơn viết nhiều một lúc rồi chán.',
            },
          ]}
        />
      </div>
    </KidShell>
  );
}
