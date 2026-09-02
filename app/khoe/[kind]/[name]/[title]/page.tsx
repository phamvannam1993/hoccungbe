import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, canonical } from '../../../../lib/seo';
import { KidShell } from '../../../../components/seo/kid';
import { SHARE_META, buildSharePath, type ShareKind } from '../../../../lib/share';

type Props = { params: Promise<{ kind: string; name: string; title: string }> };

function dec(s?: string) {
  if (!s) return '';
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

function parse(p: { kind: string; name: string; title: string }) {
  const kind = (SHARE_META[p.kind as ShareKind] ? p.kind : 'huy-hieu') as ShareKind;
  return { kind, name: dec(p.name) || 'Bé', title: dec(p.title) || 'thành tích mới' };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await params;
  const { kind, name, title } = parse(p);
  const t = `${name} ${SHARE_META[kind].label} "${title}" 🎉`;
  const d = `Xem thành tích của bé trên ${SITE_NAME} — nơi học Toán, Tiếng Việt, Tiếng Anh miễn phí, vui và dễ dùng cho trẻ.`;
  return {
    title: t,
    description: d,
    alternates: { canonical: canonical(buildSharePath(kind, name, title)) },
    robots: { index: false, follow: true },
    openGraph: { title: t, description: d, type: 'website', siteName: SITE_NAME, locale: 'vi_VN' },
    twitter: { card: 'summary_large_image', title: t, description: d },
  };
}

export default async function Page({ params }: Props) {
  const p = await params;
  const { kind, name, title } = parse(p);
  const meta = SHARE_META[kind];

  return (
    <KidShell max="3xl">
      <div className="mt-6 overflow-hidden rounded-[32px] border-4 border-amber-100 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-8 text-center">
        <p className="text-7xl">{meta.emoji}</p>
        <p className="mt-3 text-sm font-black uppercase tracking-widest text-amber-500">Thành tích của bé</p>
        <h1 className="mt-1 text-2xl font-black text-slate-800 sm:text-3xl kid-display">
          {name} vừa {meta.label}
        </h1>
        <p className="mt-2 text-xl font-black text-orange-600 sm:text-2xl">“{title}”</p>

        <div className="mx-auto mt-6 max-w-md rounded-2xl bg-white/70 p-4 text-slate-600">
          <p className="font-semibold">
            {SITE_NAME} — nơi bé học <strong>Toán, Tiếng Việt, Tiếng Anh</strong> qua bài học và trò chơi, hoàn toàn <strong>miễn phí</strong>.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/" className="rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-7 py-3 text-base font-black text-white shadow-md">
            🎒 Cho bé học miễn phí ngay
          </Link>
          <Link href="/thi-tai" className="rounded-full border-2 border-orange-200 px-6 py-3 text-sm font-black text-orange-600">
            🏆 Thử Thi Tài
          </Link>
        </div>
      </div>
    </KidShell>
  );
}
