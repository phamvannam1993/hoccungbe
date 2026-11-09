// Bản in các gói đề /thi-lop-1…5 (đề giữa kì, học kì, phiếu ôn tập): bìa, mỗi tờ một trang A4 (vẽ bằng PhieuThi như
// trang làm bài /thi-lop-1), phần đáp án ở cuối. Chưa mua: chỉ tờ đầu, không có đáp án.

import { TO_THEO_GOI } from '../../thi-lop-1/de';
import { TO_THEO_GOI_L2 } from '../../thi-lop-2/de';
import { TO_THEO_GOI_L3 } from '../../thi-lop-3/de';
import { TO_THEO_GOI_L4 } from '../../thi-lop-4/de';
import { TO_THEO_GOI_L5 } from '../../thi-lop-5/de';
import type { Pack } from '../packs';
import PhieuThi from '../../thi-lop-1/PhieuThi';

export default function ThiLop1Book({ pack, unlocked, locked }: { pack: Pack; unlocked: boolean; locked: React.ReactNode }) {
  const tatCa = TO_THEO_GOI[pack.slug] ?? TO_THEO_GOI_L2[pack.slug] ?? TO_THEO_GOI_L3[pack.slug] ?? TO_THEO_GOI_L4[pack.slug] ?? TO_THEO_GOI_L5[pack.slug] ?? [];
  const to = unlocked ? tatCa : tatCa.slice(0, 1);
  const dem = (mon: string) => tatCa.filter((p) => p.mon === mon).length;
  return (
    <div className="ps mx-auto max-w-[860px] space-y-6 px-2 pt-6 print:max-w-none print:space-y-0 print:p-0">
      {/* Mỗi tờ đề vừa một trang A4: chữ nhỏ lại khi in, bỏ khung/bóng của bản xem trên màn */}
      <style>{`@media print {
        html, body { min-width: 0 !important; overflow: visible !important; }
        .ps { width: 180mm !important; max-width: 180mm !important; margin: 0 auto !important; padding: 0 !important; }
        .tl1-to { break-before: page; width: 180mm !important; max-width: 180mm !important; overflow: hidden; }
        .tl1-to > div { width: 100% !important; max-width: 100% !important; box-sizing: border-box; }
        .tl1-to > div { font-size: 12.5px !important; padding: 0 !important; box-shadow: none !important; border-radius: 0 !important; }
        .tl1-to img { max-height: 5.5rem !important; }
        /* Phiếu ôn tập, phiếu chính tả dày hơn một trang → thu nhỏ cả tờ cho vừa A4 */
        .tl1-to[data-kieu="on-tap"] > div { zoom: 0.78; }
        .tl1-to[data-kieu="ct"] > div { zoom: 0.72; }
        .tl1-to[data-kieu="ct"] img { max-height: 4rem !important; }
        .tl1-to[data-kieu="tv-phieu"] > div { zoom: 0.8; }
        .tl1-to[data-kieu="tv-hk1"] > div { zoom: 0.82; }
        .tl1-to[data-kieu="tv-phieu"] img { max-height: 4.5rem !important; }
      }`}</style>
      <section className="page keep rounded-2xl bg-white p-10 text-center shadow print:rounded-none print:shadow-none">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-pink-500">Bé Hay Học</p>
        <h1 className="mt-4 text-4xl font-black text-slate-800">{pack.title}</h1>
        <p className="mt-2 text-xl font-bold text-slate-600">
          {[dem('toan') && 'Toán', dem('tieng-viet') && 'Tiếng Việt'].filter(Boolean).join(' – ')} · Lớp {pack.grade ?? 1}
        </p>
        <ul className="mx-auto mt-8 max-w-md space-y-2 text-left text-lg">
          {dem('toan') ? <li>🔢 <b>Toán</b> — {dem('toan')} tờ</li> : null}
          {dem('tieng-viet') ? <li>📖 <b>Tiếng Việt</b> — {dem('tieng-viet')} tờ</li> : null}
        </ul>
        <p className="mt-10 text-sm text-slate-500">Đáp án ở cuối bộ đề. Làm bài trực tuyến, có chấm điểm: behayhoc.com/thi-lop-{pack.grade ?? 1}</p>
      </section>

      {!unlocked ? <div className="no-print">{locked}</div> : null}

      {to.map((p) => (
        <section key={p.slug} className="tl1-to" data-kieu={p.kieu}>
          <PhieuThi phieu={p} mode="in" />
        </section>
      ))}

      {unlocked ? (
        <>
          <section className="tl1-to keep rounded-2xl bg-white p-10 text-center shadow print:rounded-none print:shadow-none">
            <h2 className="text-3xl font-black text-emerald-700">ĐÁP ÁN</h2>
            <p className="mt-2 text-slate-600">Ô có nhiều đáp án đúng (vd. “8 &gt; …”) ghi một đáp án mẫu; câu viết phép tính theo tranh ghi một phép tính mẫu.</p>
          </section>
          {tatCa.map((p) => (
            <section key={`da-${p.slug}`} className="tl1-to" data-kieu={p.kieu}>
              <PhieuThi phieu={p} mode="dap-an" />
            </section>
          ))}
        </>
      ) : null}
    </div>
  );
}
