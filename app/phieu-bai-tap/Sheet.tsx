/**
 * Phần hiển thị dùng chung cho mọi loại phiếu bài tập in ra giấy.
 * Không có hook → dùng được cho cả server component lẫn client component.
 */

export type OptionItem = { key: string; text: string; imageUrl?: string; pair?: string };
export type Quiz = {
  id: number;
  questionText: string;
  questionType: string;
  questionImageUrl?: string | null;
  optionsJson?: OptionItem[] | null;
  correctAnswerJson?: unknown;
  explanation?: string | null;
};

const BLANK = 'inline-block min-w-[56px] border-b-2 border-slate-400 align-bottom';

// ── Phân số "a/b" → hiển thị xếp chồng (tử trên, gạch ngang, mẫu dưới) khi in ──
const FRAC_RE_G = /(\d+)\s*\/\s*(\d+)/g;

function Frac({ n, d }: { n: string; d: string }) {
  return (
    <span className="inline-flex flex-col items-center align-middle" style={{ lineHeight: 1.05 }}>
      <span className="block px-1">{n}</span>
      <span className="block border-t border-current px-1">{d}</span>
    </span>
  );
}

// Trả về mảng node: phần "a/b" thành <Frac/>, còn lại giữ nguyên chữ.
function fracNodes(text: string, keyPrefix = ''): React.ReactNode {
  if (!text || !/\d\s*\/\s*\d/.test(text)) return text;
  const nodes: React.ReactNode[] = [];
  const re = new RegExp(FRAC_RE_G.source, 'g');
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(<span key={`${keyPrefix}t${i}`}>{text.slice(last, m.index)}</span>);
    nodes.push(<Frac key={`${keyPrefix}f${i}`} n={m[1]} d={m[2]} />);
    last = m.index + m[0].length;
    i++;
  }
  if (last < text.length) nodes.push(<span key={`${keyPrefix}t${i}`}>{text.slice(last)}</span>);
  return nodes;
}

// ── Đáp án dạng đọc được cho ba mẹ ──────────────────────────────────────────
export function answerText(q: Quiz): string {
  // Một số dạng (counting, table_fill…) lưu optionsJson là OBJECT → chỉ dùng khi là array.
  const opts = Array.isArray(q.optionsJson) ? q.optionsJson : [];
  const a = q.correctAnswerJson;
  const label = (k: string) => opts.find((x) => x.key === k)?.text ?? k;
  const labelWithKey = (k: string) => {
    const o = opts.find((x) => x.key === k);
    if (!o) return k;
    // Đáp án bằng hình không in A/B/C nên chỉ đọc theo tên hình
    return o.imageUrl ? o.text : `${k}. ${o.text}`;
  };

  if (a === null || a === undefined) return '—';
  if (typeof a === 'boolean') return a ? 'Đúng' : 'Sai';
  if (typeof a === 'number') return String(a);
  if (typeof a === 'string') return labelWithKey(a);

  if (Array.isArray(a)) {
    const keys = a.map(String);
    if (q.questionType === 'drag_drop' || q.questionType === 'sorting') {
      return keys.map(label).join('  →  ');
    }
    return keys.map(labelWithKey).join(' ; ');
  }

  if (typeof a === 'object') {
    const entries = Object.entries(a as Record<string, unknown>);
    if (!entries.length) return 'Hoàn thành hoạt động';
    // Nối: "Thêm vào → Cộng"
    if (q.questionType === 'matching') {
      return entries.map(([k, v]) => `${label(k)} → ${String(v)}`).join(' ; ');
    }
    // Ghép hình: giá trị là key của token
    if (q.questionType === 'puzzle') {
      return entries.map(([, v]) => label(String(v))).join(' ; ');
    }
    // Bảng điền số lượng: chỉ liệt kê các ô cần điền → "Bò 🐄: 2 ; Đám mây ☁️: 3"
    const qtab = parseQuantityTable(q.questionText);
    if (qtab) {
      const map = a as Record<string, unknown>;
      return qtab.rows.filter((r) => r.key).map((r) => `${r.label}: ${String(map[r.key!] ?? '')}`).join(' ; ');
    }
    // Điền chỗ trống / bảng: chỉ cần giá trị
    return entries.map(([, v]) => String(v)).join(' ; ');
  }
  return '—';
}

// ── Kỹ năng của câu (gợi ý cho ba mẹ) ───────────────────────────────────────
export function skillOf(q: Quiz, fallback: string): string {
  const t = q.questionText.toLowerCase();
  if (t.includes('viết sai') || t.includes('lỗi sai')) return 'Phát hiện lỗi chính tả';
  if (t.includes('sắp xếp')) return 'Sắp xếp đúng trật tự';
  if (t.includes('cùng vần')) return 'Nhận biết vần giống nhau';
  if (t.includes('bao nhiêu tiếng')) return 'Đếm tiếng trong câu';
  if (t.includes('nhóm nào')) return 'Phân loại theo nhóm';
  if (t.includes('chọn chữ') || t.includes('viết thường') || t.includes('viết hoa')) return 'Nhận biết mặt chữ';
  if (t.includes('điền')) return 'Điền phần còn thiếu';
  if (t.includes('nối')) return 'Nối đúng cặp';
  if (t.includes('đếm')) return 'Đếm số lượng';
  if (t.includes('gạch bỏ')) return 'Loại trừ đáp án sai';
  return fallback;
}

// Dạng bảng điền số lượng: "Đếm/Quan sát tranh và điền số lượng: Gà 🐓 = 3; Bò 🐄 = [b1]; …"
// Mỗi dòng "nhãn = <giá trị>": số cho sẵn (given) hoặc ô [bN] (key).
function parseQuantityTable(text: string): { rows: { label: string; key?: string; given?: string }[] } | null {
  const m = (text || '').match(/^\s*[^:]*điền số lượng\s*:\s*([\s\S]+)$/i);
  if (!m) return null;
  const body = m[1].replace(/\s*\.\s*$/, '');
  const segs = body.split(';').map((s) => s.trim()).filter(Boolean);
  const rows: { label: string; key?: string; given?: string }[] = [];
  for (const seg of segs) {
    const mm = seg.match(/^([\s\S]*?)\s*=\s*(\[b\d+\]|\d+)$/);
    if (!mm) return null;
    const label = mm[1].trim();
    const bm = mm[2].match(/^\[(b\d+)\]$/);
    if (bm) rows.push({ label, key: bm[1] });
    else rows.push({ label, given: mm[2] });
  }
  return rows.length >= 2 && rows.some((r) => r.key) ? { rows } : null;
}

function QuantityTable({ rows }: { rows: { label: string; key?: string; given?: string }[] }) {
  return (
    <div className="mt-2 overflow-hidden rounded-md border border-slate-300" style={{ maxWidth: 460 }}>
      <table className="w-full border-collapse text-[15px]">
        <thead>
          <tr className="bg-slate-100">
            <th className="border border-slate-300 px-3 py-1.5 text-left font-bold">Nhóm đồ vật</th>
            <th className="w-[120px] border border-slate-300 px-3 py-1.5 text-center font-bold">Số lượng</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.key ?? `g-${i}`}>
              <td className="border border-slate-300 px-3 py-2 text-slate-700">{r.label}</td>
              <td className="border border-slate-300 px-3 py-2 text-center">
                {r.key ? <span className={`${BLANK} min-w-[70px]`} /> : <span className="font-bold text-slate-800">{r.given}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Đề bài: thay [b1], [r1c1]… bằng ô trống để bé viết ──────────────────────
function QuestionText({ text }: { text: string }) {
  const qtab = parseQuantityTable(text);
  if (qtab) {
    return (
      <>
        <span>Điền số thích hợp:</span>
        <QuantityTable rows={qtab.rows} />
      </>
    );
  }
  const parts = text.split(/(\[[^\]]+\])/g);
  return (
    <>
      {parts.map((p, i) =>
        /^\[[^\]]+\]$/.test(p) ? <span key={i} className={`${BLANK} mx-1`} /> : <span key={i}>{fracNodes(p, `q${i}-`)}</span>,
      )}
    </>
  );
}

function Circle({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-slate-400 text-xs font-bold">
      {children}
    </span>
  );
}

// ── Thân câu hỏi: mỗi dạng in một kiểu riêng ────────────────────────────────
function QuestionBody({ q }: { q: Quiz }) {
  const opts = Array.isArray(q.optionsJson) ? q.optionsJson : [];
  const type = q.questionType;

  // Đúng / Sai
  if (type === 'true_false') {
    return (
      <div className="ml-8 mt-2 flex gap-6 text-[15px] text-slate-700">
        <span className="flex items-center gap-2"><Circle> </Circle> Đúng</span>
        <span className="flex items-center gap-2"><Circle> </Circle> Sai</span>
      </div>
    );
  }

  // Điền vào chỗ trống → ô trống đã nằm trong đề bài
  if (type === 'fill_blank') return null;

  // Đếm số lượng → in các hình để bé đếm (optionsJson dạng {d1:"🐶",...} là OBJECT)
  if (type === 'counting') {
    const items = opts.length
      ? opts.map((o) => o.text)
      : Object.values((q.optionsJson ?? {}) as Record<string, string>);
    return (
      <div className="ml-8 mt-2">
        <div className="flex flex-wrap gap-1.5 text-2xl leading-none">
          {items.map((t, i) => <span key={i}>{t}</span>)}
        </div>
        <div className="mt-2 text-[15px] text-slate-700">Trả lời: <span className={`${BLANK} min-w-[80px]`} /></div>
      </div>
    );
  }

  // Sắp xếp thứ tự → thẻ từ + ô điền thứ tự
  if (type === 'drag_drop' || type === 'sorting') {
    return (
      <div className="ml-8 mt-2">
        <div className="flex flex-wrap gap-2">
          {opts.map((o) => (
            <span key={o.key} className="rounded-md border-2 border-slate-300 bg-slate-50 px-2.5 py-1 text-[15px] font-bold text-slate-700">
              {o.key}. {o.text.trim()}
            </span>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-2 text-[15px] text-slate-500">
          Thứ tự đúng:
          {opts.map((o, i) => (
            <span key={o.key} className="flex items-center gap-2">
              <span className={`${BLANK} min-w-[44px]`} />
              {i < opts.length - 1 && <span>→</span>}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // Gạch bỏ → in các từ để bé gạch, không có vòng khoanh
  if (type === 'cross_out') {
    return (
      <div className="ml-8 mt-2 flex flex-wrap gap-3">
        {opts.map((o) => (
          <span key={o.key} className="rounded-md border border-dashed border-slate-300 px-2.5 py-1 text-[15px] text-slate-700">
            {o.text}
          </span>
        ))}
      </div>
    );
  }

  // Nối → hai cột để bé kẻ nối
  if (type === 'matching') {
    const right = Object.values((q.correctAnswerJson ?? {}) as Record<string, string>)
      .map(String)
      .filter((v, i, arr) => arr.indexOf(v) === i)
      .sort((a, b) => a.localeCompare(b, 'vi')); // xếp a→z để không lộ đáp án
    return (
      <div className="ml-8 mt-2 flex gap-10">
        <div className="space-y-2">
          {opts.map((o) => (
            <div key={o.key} className="flex items-center gap-2 text-[15px] text-slate-700">
              <span>{o.text}</span><span className="text-slate-400">●</span>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {right.map((v) => (
            <div key={v} className="flex items-center gap-2 text-[15px] text-slate-700">
              <span className="text-slate-400">●</span><span>{v}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Điền bảng
  if (type === 'table_fill') {
    const headers = (opts.find((o) => o.key === 'headers')?.text ?? '').split('|');
    const rows = opts.filter((o) => o.key !== 'headers').map((o) => o.text.split('|'));
    if (!rows.length) return null;
    return (
      <div className="ml-8 mt-2 overflow-hidden rounded-md border border-slate-300">
        <table className="w-full border-collapse text-[14px]">
          {headers.length > 1 && (
            <thead>
              <tr className="bg-slate-100">
                {headers.map((h, i) => <th key={i} className="border border-slate-300 px-2 py-1 text-left font-bold">{h}</th>)}
              </tr>
            </thead>
          )}
          <tbody>
            {rows.map((cells, ri) => (
              <tr key={ri}>
                {cells.map((c, ci) => (
                  <td key={ci} className="border border-slate-300 px-2 py-2 text-slate-700">
                    {c.startsWith('_') ? <span className={`${BLANK} w-full`} /> : c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Tia số
  if (type === 'number_line') {
    const marks = (opts.find((o) => o.key === 'marks')?.text ?? '').split('|').filter(Boolean);
    return (
      <div className="ml-8 mt-3">
        <div className="flex items-end gap-0">
          {marks.map((m, i) => (
            <span key={i} className="flex flex-1 flex-col items-center">
              <span className="h-3 w-px bg-slate-400" />
              <span className="mt-0.5 text-xs text-slate-600">{m}</span>
            </span>
          ))}
        </div>
        <div className="-mt-[18px] h-px w-full bg-slate-400" />
        <div className="mt-3 text-[15px] text-slate-700">Trả lời: <span className={`${BLANK} min-w-[80px]`} /></div>
      </div>
    );
  }

  // Ghép: chỗ trống là câu mẫu, các thẻ bên dưới để bé chọn
  if (type === 'puzzle') {
    const slots = opts.filter((o) => o.key.startsWith('slot'));
    const tokens = opts.filter((o) => !o.key.startsWith('slot'));
    return (
      <div className="ml-8 mt-2">
        {slots.map((s) => (
          <div key={s.key} className="text-[15px] font-bold text-slate-800">
            <QuestionText text={s.text} />
          </div>
        ))}
        <div className="mt-2 flex flex-wrap gap-2">
          {tokens.map((o) => (
            <span key={o.key} className="rounded-md border-2 border-slate-300 bg-slate-50 px-2.5 py-1 text-[15px] text-slate-700">
              {o.text}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // Trò chơi phân loại: in các thẻ + hai nhóm để bé ghi vào
  if (type === 'game') {
    const groups = [...new Set(opts.map((o) => o.pair).filter(Boolean))] as string[];
    return (
      <div className="ml-8 mt-2">
        <div className="flex flex-wrap gap-2">
          {opts.map((o) => (
            <span key={o.key} className="rounded-md border-2 border-slate-300 bg-slate-50 px-2.5 py-1 text-[15px] text-slate-700">
              {o.text}
            </span>
          ))}
        </div>
        {groups.length > 0 && (
          <div className="mt-2 grid grid-cols-2 gap-3">
            {groups.map((g) => (
              <div key={g} className="rounded-md border border-slate-300 p-2">
                <div className="text-xs font-black uppercase text-slate-500">{g}</div>
                <div className="mt-3 border-b border-dotted border-slate-400" />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Tô chữ / tô số / tô câu
  if (type === 'trace_number' || type === 'letter_tracing' || type === 'trace_sentence') {
    return (
      <div className="ml-8 mt-2 rounded-md border-2 border-dashed border-slate-300 px-3 py-4 text-3xl font-black text-slate-200">
        {(q.correctAnswerJson as { number?: string; letter?: string })?.number
          ?? (q.correctAnswerJson as { letter?: string })?.letter
          ?? '. . . . . .'}
      </div>
    );
  }

  // Đáp án là HÌNH → xếp dọc: ảnh trong khung nét đứt, vòng tròn khoanh ở dưới
  if (opts.some((o) => o.imageUrl)) {
    return (
      <div className="ml-8 mt-2 grid grid-cols-4 gap-2">
        {opts.map((o) => (
          <div key={o.key} className="flex flex-col items-center gap-1 rounded-lg border-2 border-dashed border-slate-300 p-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={o.imageUrl} alt={o.text} className="h-16 w-full rounded object-contain" />
            {o.text && <span className="text-center text-[10px] leading-tight text-slate-600">{o.text}</span>}
            {/* Ảnh thì không cần A/B/C — chỉ cần vòng tròn để bé khoanh */}
            <Circle> </Circle>
          </div>
        ))}
      </div>
    );
  }

  // Trắc nghiệm chữ (1 hoặc nhiều đáp án)
  if (opts.length > 0) {
    return (
      <div className="ml-8 mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5">
        {opts.map((o) => {
          // Đáp án chỉ gồm số/ký hiệu toán (vd "10 234", "4 020 305") → không cho xuống dòng
          // giữa chừng để khỏi vỡ; đáp án có chữ vẫn ngắt dòng bình thường.
          const numericOnly = /^[\d\s.,/=<>+\-×÷:()²³°%–—]+$/.test(o.text.trim());
          return (
            <div key={o.key} className="flex items-center gap-2 text-[15px] text-slate-700">
              <Circle>{o.key}</Circle>
              <span className={`min-w-0 ${numericOnly ? 'whitespace-nowrap tabular-nums' : 'break-words'}`}>{fracNodes(o.text, `${o.key}-`)}</span>
            </div>
          );
        })}
      </div>
    );
  }

  // Không có lựa chọn → chừa dòng cho bé viết
  return (
    <div className="ml-8 mt-3 space-y-3">
      <div className="border-b border-dotted border-slate-400" />
      <div className="border-b border-dotted border-slate-400" />
    </div>
  );
}

// Màu thẻ câu hỏi xoay vòng cho vui mắt (giống mẫu phiếu in)
const CARD_COLORS = [
  { border: '#f9a8d4', num: '#ec4899', title: '#be185d', bg: '#fff5f9' }, // hồng
  { border: '#99f6e4', num: '#14b8a6', title: '#0f766e', bg: '#f2fdfc' }, // xanh ngọc
  { border: '#c4b5fd', num: '#8b5cf6', title: '#6d28d9', bg: '#faf8ff' }, // tím
  { border: '#fcd34d', num: '#f59e0b', title: '#b45309', bg: '#fffcf2' }, // vàng
  { border: '#86efac', num: '#22c55e', title: '#15803d', bg: '#f4fdf6' }, // xanh lá
];

// Các dạng cần bề ngang rộng → chiếm cả 2 cột
const WIDE = new Set(['table_fill', 'number_line', 'matching', 'sorting', 'drag_drop', 'game', 'puzzle', 'trace_sentence']);

// ── Một câu hỏi hoàn chỉnh ──────────────────────────────────────────────────
export function QuestionItem({
  q, index, isAnswer, skillFallback,
}: {
  q: Quiz; index: number; isAnswer: boolean; skillFallback: string;
}) {
  const c = CARD_COLORS[index % CARD_COLORS.length];
  const multi = q.questionType === 'multiple_choice' || q.questionType === 'cross_out';
  return (
    <div className="h-full rounded-2xl border-2 p-3" style={{ borderColor: c.border, background: c.bg }}>
      <div className="flex items-start gap-2">
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black text-white"
          style={{ background: c.num }}
        >
          {index + 1}
        </span>
        <span className="text-[14px] font-black leading-snug" style={{ color: c.title }}>
          Câu {index + 1}: <QuestionText text={q.questionText} />
          {multi && <span className="ml-1 text-[11px] font-normal text-slate-500">(chọn nhiều đáp án)</span>}
        </span>
      </div>

      {q.questionImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={q.questionImageUrl} alt="" className="ml-8 mt-2 max-h-24 object-contain" />
      )}

      <QuestionBody q={q} />

      {isAnswer && (
        <div className="ml-8 mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-[12px]">
          <div className="font-black text-emerald-700">Đáp án: {fracNodes(answerText(q), 'ans-')}</div>
          <div className="text-emerald-800">Kỹ năng: {skillOf(q, skillFallback)}</div>
          {q.explanation && <div className="mt-0.5 text-slate-600">{fracNodes(q.explanation, 'exp-')}</div>}
        </div>
      )}
    </div>
  );
}

function InfoCell({ label, w }: { label: string; w: string }) {
  return (
    <div className={`${w} px-3 py-2`}>
      <div className="text-[11px] font-bold text-pink-500">{label}</div>
      <div className="mt-2 border-b border-dotted border-slate-400" />
    </div>
  );
}

// ── Khung phiếu: đầu phiếu + câu hỏi + cuối phiếu ───────────────────────────
export function Sheet({
  courseTitle, lessonTitle, stageLabel, stageColor, stageBg,
  quizCount, minutes, quizzes, isAnswer, skillFallback, footerLink, qrDataUrl, intro,
}: {
  courseTitle: string;
  lessonTitle: string;
  stageLabel: string;
  stageColor: string;
  stageBg: string;
  quizCount: number;
  minutes: number;
  quizzes: Quiz[];
  isAnswer: boolean;
  skillFallback: string;
  footerLink: string;
  qrDataUrl?: string;
  intro?: React.ReactNode;
}) {
  return (
    <div className="sheet mx-auto my-4 max-w-[820px] rounded-2xl border-4 border-pink-200 bg-white p-6 shadow-lg print:my-0">
      {/* ── Đầu phiếu: logo + ô thông tin bé ── */}
      <div className="keep flex flex-col items-start gap-4 sm:flex-row sm:justify-between print:flex-row print:justify-between">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🎓</span>
          <div>
            <div className="text-xl font-black leading-none">
              <span className="text-pink-500">BÉ </span>
              <span className="text-sky-500">HAY </span>
              <span className="text-violet-500">HỌC</span>
            </div>
            <div className="mt-1 text-[10px] text-slate-500">Học vui mỗi ngày – Bé tiến bộ từng bước</div>
          </div>
        </div>
        <div className="flex flex-1 justify-end">
          <div className="flex w-full max-w-[420px] divide-x divide-pink-200 rounded-xl border-2 border-pink-300">
            <InfoCell label="Họ và tên bé:" w="flex-[2]" />
            <InfoCell label="Lớp:" w="flex-1" />
            <InfoCell label="Ngày:" w="flex-1" />
          </div>
        </div>
      </div>

      {/* ── Tiêu đề + pill môn/bài + badge mức độ, thời gian ── */}
      <div className="keep mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between print:flex-row print:items-end print:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-pink-500">
            PHIẾU BÀI TẬP <span className="align-middle text-2xl">📖</span>
            {/* Nội dung thật cho SEO/screen-reader, không đổi bố cục in */}
            <span className="sr-only"> {lessonTitle} — {courseTitle}</span>
          </h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-full border-2 border-pink-200 bg-pink-50 px-3 py-1 text-xs font-bold text-pink-600">
              {courseTitle}
            </span>
            <span className="rounded-full border-2 border-pink-300 px-3 py-1 text-xs font-bold text-slate-700">
              {lessonTitle}
            </span>
          </div>
        </div>
        <div className="shrink-0 space-y-2">
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-black"
            style={{ background: stageBg, color: stageColor }}
          >
            ✅ {stageLabel} • {quizCount} câu
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-black text-amber-600">
            🕐 Thời gian: {minutes} phút
          </div>
        </div>
      </div>

      {isAnswer && (
        <div className="keep mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-center text-sm font-black text-emerald-700">
          BẢN ĐÁP ÁN DÀNH CHO BA MẸ
        </div>
      )}

      {/* ── Đường kẻ ngôi sao ── */}
      <div className="keep my-4 flex items-center gap-2">
        <span className="text-xl">⭐</span>
        <div className="flex-1 border-t-2 border-dashed border-pink-200" />
        <span className="text-sm">⭐</span>
        <div className="flex-1 border-t-2 border-dashed border-pink-200" />
        <span className="text-sm">⭐</span>
        <div className="flex-1 border-t-2 border-dashed border-pink-200" />
        <span className="text-xl">⭐</span>
      </div>

      {intro}

      {/* ── Câu hỏi: mobile 1 cột (khỏi vỡ số), từ sm trở lên & khi in dùng 2 cột ── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 print:grid-cols-2">
        {quizzes.map((q, i) => {
          // Câu có đáp án bằng hình cần cả bề ngang, nếu không ảnh sẽ chen nhau
          const wide = WIDE.has(q.questionType) || (Array.isArray(q.optionsJson) ? q.optionsJson : []).some((o) => o.imageUrl);
          return (
            <div key={q.id} className={`q-item ${wide ? 'sm:col-span-2 print:col-span-2' : ''}`}>
              <QuestionItem q={q} index={i} isAnswer={isAnswer} skillFallback={skillFallback} />
            </div>
          );
        })}
      </div>

      {/* ── Cuối phiếu: gợi ý ba mẹ • tự đánh giá • QR ── */}
      <div className="keep mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 print:grid-cols-3">
        <div className="rounded-2xl border-2 border-amber-200 bg-amber-50/60 p-3">
          <div className="flex items-center gap-1.5 text-xs font-black text-amber-700">👨‍👩‍👧 Gợi ý cho phụ huynh</div>
          <p className="mt-1.5 text-[10px] leading-relaxed text-slate-600">
            Hãy khen ngợi và khuyến khích bé khi bé hoàn thành bài tập để tạo động lực học nhé!
          </p>
        </div>

        <div className="rounded-2xl border-2 border-sky-200 bg-sky-50/60 p-3">
          <div className="text-center text-xs font-black text-sky-700">Tự đánh giá của bé</div>
          <div className="mt-2 grid grid-cols-3 gap-1 text-center">
            {[
              { i: '⭐', t: 'Con làm tốt' },
              { i: '☁️', t: 'Con cần luyện thêm' },
              { i: '💗', t: 'Con muốn ba mẹ giúp' },
            ].map((x) => (
              <div key={x.t} className="flex flex-col items-center gap-1">
                <span className="text-lg leading-none">{x.i}</span>
                <span className="text-[9px] leading-tight text-slate-600">{x.t}</span>
                <span className="h-4 w-4 rounded-full border-2 border-slate-400" />
              </div>
            ))}
          </div>
          <div className="mt-2 text-center text-[10px] text-slate-600">
            Số câu đúng: <span className="inline-block w-8 border-b border-slate-400" /> / {quizzes.length}
          </div>
        </div>

        <div className="rounded-2xl border-2 border-pink-200 bg-pink-50/60 p-3 text-center">
          <div className="text-xs font-black text-pink-600">Quét để học online</div>
          {qrDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qrDataUrl} alt="QR" className="mx-auto mt-1.5 h-16 w-16" />
          ) : (
            <div className="mx-auto mt-1.5 h-16 w-16 rounded bg-slate-100" />
          )}
          <p className="mt-1 text-[9px] leading-tight text-slate-600">
            Quét mã để nghe âm thanh và luyện tập thêm nhé!
          </p>
        </div>
      </div>

      {/* Ba mẹ nhận xét */}
      <div className="keep mt-3 rounded-2xl border-2 border-dashed border-slate-300 px-3 py-2">
        <div className="text-[11px] font-bold text-slate-600">Ba mẹ nhận xét:</div>
        <div className="mt-3 border-b border-dotted border-slate-400" />
      </div>

      <div className="keep mt-3 flex items-center justify-center gap-2 text-[11px] font-bold italic text-pink-500">
        <span>💗</span> Học vui – Hiểu nhanh – Bé tự tin mỗi ngày! <span>💚</span>
      </div>
      <div className="mt-1 text-center text-[9px] text-slate-400">{footerLink}</div>
    </div>
  );
}

export const PRINT_CSS = `
  @page { size: A4; margin: 10mm; }
  @media print {
    .no-print { display: none !important; }
    body { background: #fff !important; }
    /* Ép in đúng màu nền (vòng tròn số, thẻ màu) dù Chrome mặc định bỏ nền */
    .sheet, .sheet * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .sheet { box-shadow: none !important; margin: 0 !important; border: none !important; max-width: none !important; padding: 0 !important; }
    /* Không cắt đôi một câu qua hai trang */
    .q-item, .keep { break-inside: avoid; page-break-inside: avoid; }
    img { max-height: 90px !important; }
  }
`;
