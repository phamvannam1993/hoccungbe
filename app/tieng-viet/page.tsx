import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { KidShell, KidCrumb, KidPills } from '../components/seo/kid';
import { ItemGrid, Section } from '../components/catalog/CatalogCards';
import { SCHOOL_GRADES, SUBJECT_META, TV_GROUPS, gradeName } from '../lib/catalog';
import { queryCatalog } from '../lib/catalogFull';

// Trang gom TIẾNG VIỆT: mọi trang Tiếng Việt (trước đây không có trên menu), xếp theo Đọc · Viết · Chính tả ·
// Từ và câu · Tập làm văn · Truyện & ca dao. Danh sách lấy từ sổ đăng ký app/lib/catalog.ts.

const PATH = '/tieng-viet';
const TITLE = 'Tiếng Việt tiểu học cho bé: đọc, viết, chính tả, từ và câu, tập làm văn';
const DESCRIPTION =
  'Mọi bài Tiếng Việt miễn phí cho bé mẫu giáo đến lớp 5: học đọc, đánh vần, tập viết chữ đẹp, chính tả s/x – ch/tr, luyện từ và câu, tập làm văn, truyện cổ tích và đồng dao có đọc mẫu.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical(PATH) },
  openGraph: { title: `${TITLE} | ${SITE_NAME}`, description: DESCRIPTION, url: canonical(PATH), type: 'website', siteName: SITE_NAME, locale: 'vi_VN', images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: TITLE }] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [`${SITE_URL}/og-home.jpg`] },
};

export default function Page() {
  const pal = SUBJECT_META['tieng-viet'].palette;
  // Trang học + phiếu tập viết (chỉ trang hub /luyen-viet-chu-dep, không liệt kê từng bộ) + trò chơi chữ.
  const all = queryCatalog({ subject: 'tieng-viet' }).filter((x) => !x.href.startsWith('/luyen-viet-chu-dep/'));
  const groups = TV_GROUPS.map((gr) => ({ ...gr, items: all.filter((x) => x.group === gr.id && x.kind !== 'tro-choi') })).filter((gr) => gr.items.length);
  const games = all.filter((x) => x.kind === 'tro-choi');

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Tiếng Việt cho bé',
    numberOfItems: all.length,
    itemListElement: all.map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: x.title, url: `${SITE_URL}${x.href}` })),
  };
  const crumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Tiếng Việt', item: `${SITE_URL}${PATH}` },
    ],
  };

  return (
    <KidShell max="5xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([crumb, ld]) }} />
      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Tiếng Việt' }]} />

      <header className="rounded-[28px] border-2 bg-white p-5 sm:p-7" style={{ borderColor: pal.border }}>
        <p className="kid-display text-xs font-black uppercase tracking-widest" style={{ color: pal.c }}>Môn học</p>
        <h1 className="kid-display mt-1 text-3xl font-black text-slate-900 sm:text-4xl">📖 Tiếng Việt</h1>
        <p className="mt-2 max-w-2xl leading-7 text-slate-600">
          {all.length} trang học miễn phí, từ nhận mặt chữ đến viết bài văn. Bấm nghe đọc mẫu, làm bài có chấm và giải thích.
        </p>
        <nav aria-label="Đi tới nhóm" className="mt-4 flex flex-wrap gap-2">
          {groups.map((gr) => (
            <a key={gr.id} href={`#${gr.id}`} className="kid-display rounded-full border-2 bg-white px-3.5 py-1.5 text-sm font-black text-slate-700 hover:bg-slate-50" style={{ borderColor: pal.border }}>
              {gr.emoji} {gr.label}
            </a>
          ))}
          {games.length > 0 && (
            <a href="#tro-choi" className="kid-display rounded-full border-2 bg-white px-3.5 py-1.5 text-sm font-black text-slate-700 hover:bg-slate-50" style={{ borderColor: pal.border }}>
              🎮 Trò chơi chữ
            </a>
          )}
        </nav>
      </header>

      <div className="mt-5 grid gap-5">
        {groups.map((gr) => (
          <Section key={gr.id} id={gr.id} emoji={gr.emoji} title={gr.label} palette={pal} desc={gr.desc}>
            <ItemGrid items={gr.items} />
          </Section>
        ))}
        {games.length > 0 && (
          <Section id="tro-choi" emoji="🎮" title="Trò chơi chữ" palette={pal} desc="Vừa chơi vừa nhận mặt chữ, ghép vần, tô chữ." more={{ href: '/tro-choi', label: 'Kho trò chơi' }}>
            <ItemGrid items={games} compact cols={4} />
          </Section>
        )}
        <Section emoji="🎒" title="Tiếng Việt theo lớp" palette={pal} desc="Khóa học theo sách, bài tập, đề thi và phiếu in của từng lớp.">
          <KidPills items={[{ href: '/lop/mau-giao', label: 'Mẫu giáo' }, ...SCHOOL_GRADES.map((g) => ({ href: `/lop-${g}#tieng-viet`, label: gradeName(g) }))]} />
        </Section>
      </div>
    </KidShell>
  );
}
