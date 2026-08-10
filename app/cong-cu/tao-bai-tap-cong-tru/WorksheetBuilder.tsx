'use client';

import { useMemo, useState } from 'react';

// Bộ tạo bài tập tính nhẩm. Logic ra đề nằm ở ./generator (thuần, test được);
// file này chỉ lo giao diện chọn tuỳ chọn và trình bày phiếu in.

import { generate, type Op } from './generator';

const OPS: { key: Op; label: string }[] = [
  { key: '+', label: 'Cộng' },
  { key: '-', label: 'Trừ' },
  { key: '×', label: 'Nhân' },
  { key: '÷', label: 'Chia' },
];

const RANGES = [10, 20, 100, 1000];
const COUNTS = [10, 20, 30, 40];

// CSS in: phải ẩn cả phần khung của site (SiteShell dựng header / footer / thanh
// điều hướng dưới / modal chào mừng) chứ không chỉ phần trong trang này — nếu không,
// bản in ra 4 trang trong đó tờ phiếu chỉ chiếm một trang.
const PRINT_CSS = `
@media print {
  header,
  footer,
  nav,
  [data-nosnippet] { display: none !important; }
  .no-print { display: none !important; }
  /* main có pb-24 để chừa chỗ cho thanh điều hướng dưới — trên giấy thành trang trắng. */
  main { padding: 0 !important; }
  .sheet {
    box-shadow: none !important;
    border: none !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  @page { size: A4; margin: 14mm; }
}
`;

export default function WorksheetBuilder() {
  const [ops, setOps] = useState<Op[]>(['+', '-']);
  const [max, setMax] = useState(10);
  const [count, setCount] = useState(20);
  const [columns, setColumns] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [seed, setSeed] = useState(1); // seed cố định lúc đầu → SSR khớp client

  const problems = useMemo(
    () => generate(seed, ops.length ? ops : ['+'], max, count),
    [seed, ops, max, count],
  );

  const toggleOp = (op: Op) =>
    setOps((cur) => (cur.includes(op) ? (cur.length > 1 ? cur.filter((o) => o !== op) : cur) : [...cur, op]));

  const opLabel = ops.map((o) => OPS.find((x) => x.key === o)?.label.toLowerCase()).join(', ');

  return (
    <div>
      <style>{PRINT_CSS}</style>

      <div className="no-print rounded-2xl border-2 border-sky-100 bg-sky-50/60 p-4">
        <h2 className="text-lg font-bold text-slate-900">Tuỳ chỉnh phiếu</h2>

        <fieldset className="mt-4">
          <legend className="text-sm font-semibold text-slate-700">Phép tính</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {OPS.map((o) => (
              <button
                key={o.key}
                type="button"
                onClick={() => toggleOp(o.key)}
                aria-pressed={ops.includes(o.key)}
                className={`rounded-full border-2 px-4 py-1.5 text-sm font-semibold transition ${
                  ops.includes(o.key)
                    ? 'border-sky-500 bg-sky-500 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-sky-400'
                }`}
              >
                {o.label} {o.key}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-4">
          <legend className="text-sm font-semibold text-slate-700">Phạm vi số</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {RANGES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setMax(r)}
                aria-pressed={max === r}
                className={`rounded-full border-2 px-4 py-1.5 text-sm font-semibold transition ${
                  max === r ? 'border-sky-500 bg-sky-500 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-sky-400'
                }`}
              >
                Đến {r}
              </button>
            ))}
          </div>
          {(ops.includes('×') || ops.includes('÷')) && (
            <p className="mt-2 text-xs text-slate-500">
              Phép nhân và chia luôn nằm trong bảng cửu chương, không phụ thuộc phạm vi đã chọn.
            </p>
          )}
        </fieldset>

        <fieldset className="mt-4">
          <legend className="text-sm font-semibold text-slate-700">Số câu</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {COUNTS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCount(c)}
                aria-pressed={count === c}
                className={`rounded-full border-2 px-4 py-1.5 text-sm font-semibold transition ${
                  count === c ? 'border-sky-500 bg-sky-500 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-sky-400'
                }`}
              >
                {c} câu
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-4 flex flex-wrap gap-4 text-sm font-medium text-slate-700">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={columns} onChange={(e) => setColumns(e.target.checked)} className="h-4 w-4" />
            Đặt tính theo cột dọc
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={showAnswers} onChange={(e) => setShowAnswers(e.target.checked)} className="h-4 w-4" />
            Hiện đáp án
          </label>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSeed((s) => s + 1)}
            className="rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-sky-700"
          >
            🎲 Tạo đề mới
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-xl border-2 border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 hover:border-sky-400"
          >
            🖨️ In / Lưu PDF
          </button>
        </div>
      </div>

      <div className="sheet mt-6 rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-slate-200 pb-3">
          <h2 className="text-lg font-extrabold text-slate-900">
            Phiếu bài tập {opLabel} trong phạm vi {max}
          </h2>
          <span className="text-sm text-slate-500">{problems.length} câu</span>
        </div>
        <p className="mt-3 text-sm text-slate-500">Họ và tên: ……………………………… Lớp: ……… Ngày: ………</p>

        {columns ? (
          <ol className="mt-5 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
            {problems.map((p, i) => (
              <li key={i} className="text-right font-mono text-lg text-slate-800">
                <div className="text-xs text-left text-slate-400">Câu {i + 1}</div>
                <div>{p.a}</div>
                <div className="border-b-2 border-slate-400 pb-1">
                  {p.op} {p.b}
                </div>
                <div className="pt-1 text-slate-700">{showAnswers ? p.answer : ' '}</div>
              </li>
            ))}
          </ol>
        ) : (
          <ol className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {problems.map((p, i) => (
              <li key={i} className="font-mono text-base text-slate-800">
                <span className="mr-2 text-xs text-slate-400">{i + 1}.</span>
                {p.a} {p.op} {p.b} ={' '}
                <span className={showAnswers ? 'font-bold text-emerald-700' : 'text-slate-300'}>
                  {showAnswers ? p.answer : '……'}
                </span>
              </li>
            ))}
          </ol>
        )}

        <p className="mt-6 border-t border-slate-200 pt-3 text-xs text-slate-400">behayhoc.com — phiếu bài tập miễn phí</p>
      </div>
    </div>
  );
}
