import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAccess } from '../../khoa-hoc-iq/lib/access';
import { VOCAB_TOPICS } from '../../lib/vocab';
import { buildVocabFallback } from '../../lib/phonicsWords';
import { getPack, packKey } from '../packs';
import BuyPack from './BuyPack';
import ExamBook from './ExamBook';
import PackToolbar from './PackToolbar';
import PhonicsPrintSheet from './PhonicsPrintSheet';
import ThiLop1Book from './ThiLop1Book';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pack = getPack((await params).slug);
  return pack ? { title: `Bản in · ${pack.title}`, description: pack.subtitle, robots: { index: false, follow: true } } : {};
}

// Khổ A4, mỗi đề sang trang mới, số trang ở chân trang (Chrome in @page margin box).
const BOOK_CSS = `
  @page { size: A4; margin: 12mm 12mm 14mm; @bottom-right { content: "Trang " counter(page); font: 9px sans-serif; color: #94a3b8; } }
  .ps, .ps * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  @media print {
    .no-print { display: none !important; }
    body, .khv-root { background: #fff !important; }
    .page { box-shadow: none !important; }
    .page + .page { break-before: page; }
    .q-item, .keep { break-inside: avoid; }
  }
`;

/** Bản xem thử khi chưa mua: số phần tử mỗi mục của gói Phonics. */
const PHONICS_PREVIEW = 6;

export default async function PackPrintPage({ params }: Props) {
  const { slug } = await params;
  const pack = getPack(slug);
  if (!pack) notFound();
  const unlocked = packKey(slug) in (await getAccess());

  const locked = (
    <div className="mx-auto max-w-[794px] rounded-2xl border-4 border-amber-300 bg-amber-50 p-5 text-center">
      <p className="font-bold text-amber-900">
        {pack.kind === 'phonics'
          ? `Bản xem thử: ${PHONICS_PREVIEW} card mỗi phần. Mua gói để in trọn bộ.`
          : pack.kind === 'thi-lop-1'
            ? 'Bản xem thử: tờ đầu tiên, chưa kèm đáp án. Mua gói để in trọn bộ kèm phần đáp án.'
          : 'Bản xem thử: Đề 1, chưa kèm đáp án. Mua gói để in đủ bộ đề, kèm đáp án và lời giải.'}
      </p>
      <div className="mt-3">
        <BuyPack pack={pack} list={`ban-in-${slug}`} />
      </div>
    </div>
  );

  if (pack.kind === 'phonics') {
    return (
      <div className="min-h-screen bg-slate-100 pb-10 print:bg-white print:pb-0">
        <PhonicsPrintSheet fallback={buildVocabFallback(VOCAB_TOPICS)} limit={unlocked ? null : PHONICS_PREVIEW} locked={unlocked ? null : locked} />
      </div>
    );
  }

  if (pack.kind === 'thi-lop-1') {
    return (
      <div className="min-h-screen bg-slate-100 pb-10 print:bg-white print:pb-0">
        <style>{BOOK_CSS}</style>
        <PackToolbar />
        <ThiLop1Book pack={pack} unlocked={unlocked} locked={locked} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 pb-10 print:bg-white print:pb-0">
      <style>{BOOK_CSS}</style>
      <PackToolbar />
      <ExamBook pack={pack} unlocked={unlocked} locked={locked} />
    </div>
  );
}
